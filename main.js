// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();

//db connect
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database connected"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "mykey",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set template engine
app.set("view engine", "ejs");

// app routing
app.use("", require("./routes/routes.js"));

// const members = [
//   {
//     id: 1,
//     name: "john doe",
//     email: "johndoe@gmail.com",
//     status: "active",
//   },
//   {
//     id: 2,
//     name: "jane doe",
//     email: "janedoe@gmail.com",
//     status: "inactive",
//   },
//   {
//     id: 3,
//     name: "william go",
//     email: "willgo@gmail.com",
//     status: "active",
//   },
// ];

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port:  http://localhost:${PORT}`)
);
