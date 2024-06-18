const express = require("express");
const app = express();
const fetch = require("node-fetch");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

app.use(express.static("public"));

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

app.set("view engine", "ejs");

app.get("/login/github", (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:9000/login/github/callback`;
  res.redirect(url);
});

async function getAcessToken(code) {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function getGithubUser(access_token) {
  const req = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `bearer ${access_token}`,
    },
  });
  const data = await req.json();
  return data;
}

/* app.get("/login/github/callback", async (req, res) => {
  const code = req.query.code;
  const token = await getAcessToken(code);
  const githubData = await getGithubUser(token);
  res.json(githubData);
});
 */

app.get("/login/github/callback", async (req, res) => {
  const code = req.query.code;
  const token = await getAcessToken(code);
  const githubData = await getGithubUser(token);
  res.render("user", { githubData: githubData });
});

/* app.get("/login/github/callback", async (req, res) => {
  const code = req.query.code;
  const token = await getAcessToken(code);
  const response = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `token ${token}`,
    },
  });
  const data = await response.json();
  res.json({ data });
}); */

app.get("/", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("Servidor iniciado em http://localhost:9000");
});
