const CONFIG = require("./config.json");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const cookieParser = require("cookie-parser");
const reloadMagic = require("./reload-magic.js");

const app = express();
app.use(cookieParser());
reloadMagic(app);

let dbo = undefined;
const url = CONFIG.MONGODB_URL;

MongoClient.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    dbo = db.db("media-board");
  }
);

app.use("/", express.static("build"));

app.use("/uploads", express.static("uploads"));

app.get("/session", async (req, res) => {
  const userSession = req.cookies.sid;
  const serverSession = await dbo
    .collection("sessions")
    .findOne({ id: userSession });
  if (serverSession) {
    const username = serverSession.username;
    return res.send(JSON.stringify({ success: true, username }));
  }
  res.send(JSON.stringify({ success: false }));
});

app.get("/all-posts", (req, res) => {
  console.log("request to /all-posts");
  dbo
    .collection("posts")
    .find({})
    .toArray((err, ps) => {
      if (err) {
        console.log("error", err);
        res.send("fail");
        return;
      }
      res.send(JSON.stringify(ps));
    });
});

app.post("/delete-post", upload.none(), async (req, res) => {
  await dbo
    .collection("posts")
    .deleteOne({ _id: ObjectID(req.body.postId) }, { justOne: true });
  return res.send(JSON.stringify({ success: true }));
});

app.post("/signup", upload.none(), async (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;
  try {
    const existingUser = await dbo.collection("users").findOne({ username });
    if (existingUser) {
      return res.send(
        JSON.stringify({
          success: false,
          error: "Signup failed, user already exists"
        })
      );
    }
    const newUser = await dbo
      .collection("users")
      .insertOne({ username: username, password: pwd });
    const sessionID = newUser.insertedId.toString();
    res.cookie("sid", sessionID);
    res.send(JSON.stringify({ success: true }));
    dbo.collection("sessions").insertOne({ id: sessionID, username: username });
    return;
  } catch (error) {
    console.log("/signup error", error);
    return res.send(JSON.stringify({ success: false }));
  }
});

app.post("/login", upload.none(), (req, res) => {
  const name = req.body.username;
  const pwd = req.body.password;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      return res.send(JSON.stringify({ success: false }));
    }
    if (user === null) {
      return res.send(JSON.stringify({ success: false }));
    }
    if (user.password === pwd) {
      res.cookie("sid", user._id.toString());
      return res.send(JSON.stringify({ success: true }));
    }
    return res.send(JSON.stringify({ success: false }));
  });
});

app.post("/new-post", upload.single("img"), (req, res) => {
  console.log("request to /new-post. body: ", req.body);
  const username = req.body.username;
  const description = req.body.description;
  const file = req.file;
  const frontendPath = "/uploads/" + file.filename;
  dbo
    .collection("posts")
    .insertOne({ username, description, frontendPath: frontendPath });
  res.send(JSON.stringify({ success: true }));
});

app.post("/update", upload.none(), (req, res) => {
  console.log("request to /update");
  let id = req.body.id.toString();
  let desc = req.body.description;
  console.log("sent from client", desc, id);
  dbo
    .collection("posts")
    .updateOne({ _id: ObjectID(id) }, { $set: { description: desc } });
  res.send("success");
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
