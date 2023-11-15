const express = require("express");
const bodyParser = require("body-parser");
const Server = require("http");
const createServer = Server.createServer;
const mongoConnect = require("./database/mongoConnect").mongoConnect;

const serverRoutes = require("./routes/serverRoute");

const app = express();
const httpServer = createServer(app);
const cors = require("cors");
const PORT = 7100;
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());


app.use("/ticket", serverRoutes);


app.use("/", (req, res) => {
  res.send("Server is running");
});

mongoConnect(() => {
  app.listen(PORT);
});
