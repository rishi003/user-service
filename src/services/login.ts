import { User } from "../entities/User";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Application } from "express";

const jwtSecret = "SecreteToken";

module.exports = function (app: Application) {
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
                expiresIn: 60 * 60,
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
};
