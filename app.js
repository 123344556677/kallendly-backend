const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const DB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());

app.get("/", (req, res) => {
  res.json("Server Running Successfully");
});

app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/bookingsTypes"));
app.use("/api", require("./routes/bookings"));
app.use("/api", require("./routes/profile"));
app.use("/api", require("./routes/integration"));

DB();
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
