import { User } from "../entities/User";
import { Application } from "express";

module.exports = function (app: Application) {
  app.get("/users/find", async (req, res) => {
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
};
