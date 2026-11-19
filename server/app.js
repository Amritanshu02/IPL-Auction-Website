const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const socketio = require("socket.io");
const http = require("http");
const { existsSync } = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/user.route");
const newsRouter = require("./routes/news.route");
const auctionRouter = require("./routes/auction.route");
// const User = require("./database/models/user.model");
const path = require("path");
require("./database/connection");

const app = express();
const server = http.createServer(app);
const frontendOrigin = process.env.FRONTEND_ORIGIN
  ? new URL(process.env.FRONTEND_ORIGIN).origin
  : null;
const corsOptions = {
  origin: frontendOrigin || "http://localhost:3000",
  credentials: true,
};

const io = socketio(server, {
  cors: corsOptions,
  allowRequest: (request, callback) => {
    const { origin } = request.headers;
    callback(null, !frontendOrigin || !origin || origin === frontendOrigin);
  },
});

//Middleware
app.use(cookieParser());
app.use(cors(corsOptions));

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

const port = process.env.PORT || 8000;
server.listen(port, () => {
  //User.collection.deleteMany({});
  console.log(`Listening on port ${port}`);
});
