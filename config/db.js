const mongoose = require("mongoose");
const uri = require("./keys");

const options = {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect and handle initial connection errors
const DB = () => {
  mongoose.connect(uri, options).then(
    () => {
      console.log("connected to mongodb");
    },
    (err) => {
      console.log("mongodb initial connection error", err);
    }
  );
};

// To handle errors after initial connection was established
mongoose.connection.on("error", (err) => {
  console.log("mongodb runtime error", err);
});

module.exports = DB;
