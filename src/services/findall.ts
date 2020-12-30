import { User } from "../entities/User";
import { Application } from "express";

module.exports = function (app: Application) {
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
};
