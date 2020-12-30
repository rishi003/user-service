import { User } from "../entities/User";
import { Application } from "express";
import bcrypt from "bcrypt";

const saltRounds = 10;

module.exports = function (app: Application) {
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
            res.send(
              `User with the username '${user.username}' already exists.`
            );
          }
        });
    });
  });
};
