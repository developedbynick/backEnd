require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const posts = [
  { username: "ceo", title: "post 1" },
  { username: "ceo2", title: "post 2" },
];

app.get("/posts", authenticateToken, (req, res) => {
  // res.json(posts.filter((post) => post.username === req.user.name));

  res.json(posts);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
  console.log(accessToken);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Only use this when you're pre-pending "Bearer" to the auth header.
  // const token = authHeader && authHeader.split(" ")[1];
  const token = authHeader;
  // Validating the token
  if (token === null) return res.sendStatus(401);
  // Verifying the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
