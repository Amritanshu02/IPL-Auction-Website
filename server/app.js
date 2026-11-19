const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const socketio = require("socket.io");
const http = require("http");
const { existsSync } = require("fs");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const newsRouter = require("./routes/news.route");
const auctionRouter = require("./routes/auction.route");
// const User = require("./database/models/user.model");
const path = require("path");
require("dotenv").config();
require("./database/connection");

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "*",
    credentials: true,
  },
});

//Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    // origin: "*",
    credentials: true,
  })
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.get("/healthz", (req, res) => {
  const connected = mongoose.connection.readyState === mongoose.STATES.connected;
  res.sendStatus(connected ? 200 : 503);
});
app.use(userRouter);
app.use(newsRouter);
app.use(auctionRouter);

const clientBuild = path.join(__dirname, "client", "build");
const clientIndex = path.join(clientBuild, "index.html");
if (process.env.NODE_ENV === "production" && existsSync(clientIndex)) {
  app.use(express.static(clientBuild));
  app.get("*", (req, res) => {
    res.sendFile(clientIndex);
  });
}

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../../client/build"))); // Adjust path to client/build
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../../client/build", "index.html")); // Serve index.html
//   });
// }


require("./routes/socket.route")(io);

server.listen(process.env.PORT || 8000, () => {
  //User.collection.deleteMany({});
  console.log("Listening on port 8000");
});
