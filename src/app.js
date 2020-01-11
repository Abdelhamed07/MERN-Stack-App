// ---- requires ---- //
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const v1 = require("./routes/v1");
const passport = require("passport");
// ---- DB Config ---- //
mongoose.connect(process.env.MONGO_DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
  console.log(`Database is runnig on url ${process.env.MONGO_DB_URL}`);
});

mongoose.connection.on("error", err => {
  console.error(`Database isn't runnig on url ${err}`);
});
// ---- Middlewares ---- //
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
require('./passport/passport')(passport);
// ---- Routes ---- //
app.use("/api/v1", v1);
// ---- ERROR ---- //
app.use((req, res, next) => {
  var err = new Error("url isn't found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Error processing your request";

  res.status(status).send({
    error
  });
});

module.exports = app;
