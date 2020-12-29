import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { User } from "./entities/User";
import * as jwt from "jsonwebtoken";

const saltRounds = 10;
const jwtSecret = "SecreteToken";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/users/create", (req, res, next) => {
  const user = new User();
  user.setValues({
    username: req.body.username,
  });
  bcrypt.hash(req.body.password, saltRounds, (err, encrypted) => {
    user.password = encrypted;
    user
      .save()
      .then((value) => {
        res.setHeader("Content-Type", "application/json");
        res.send(
          JSON.stringify({
            id: value[0].id,
            username: value[0].username,
            createdAt: value[0].createdAt,
          })
        );
      })
      .catch((error) => {
        if (error.message.includes("already exist")) {
          res.send(`User with the username '${user.username}' already exists.`);
        }
      });
  });
});

app.get("/users/findall", async (req, res) => {
  const [users, performanceResults] = await User.all();
  const _users = users.map((user) => {
    const _user = JSON.parse(JSON.stringify(user));
    delete _user.password;
    return _user;
  });
  res.setHeader("Content-Type", "application/json");
  res.send(_users);
});

app.get("/users/find", async (req, res) => {
  jwt.verify(
    req.headers.authorization?.split(" ")[1] as string,
    jwtSecret,
    (err, user) => {
      if (err) {
        res.sendStatus(401);
      }
    }
  );
  const username: string | undefined = req.query.username as string;
  if (username === undefined) {
    res.send("'username' parameter is required");
  }
  try {
    const [_user, performanceResults] = await User.query().findUnique(
      "username",
      username
    );
    res.setHeader("Content-Type", "application/json");

    res.send(
      JSON.stringify({
        id: _user!.id,
        username: _user!.username,
        createdAt: _user!.createdAt,
      })
    );
  } catch (err) {
    if (err.message.includes("undefined")) {
      res.send("User does not exist");
    }
  }
});

app.post("/users/login", (req, res) => {
  const username = req.body.username as string;
  const password = req.body.password as string;
  User.query()
    .findUnique("username", username)
    .then((value) => {
      bcrypt
        .compare(password, value[0]?.password as string)
        .then((result) => {
          if (result) {
            const token = jwt.sign(req.body, jwtSecret, {
              expiresIn: 60,
            });
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({ access_token: token }));
          } else {
            res.send("Password Incorrect ");
          }
        })
        .catch((err) => {
          res.send(err.message);
        });
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.listen(3000);
