import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./services/create")(app);
require("./services/login")(app);
require("./services/find")(app);
require("./services/findall")(app);

app.listen(3000, "localhost");
