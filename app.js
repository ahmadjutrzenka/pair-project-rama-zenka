const express = require("express");
const session = require("express-session");
const router = require("./routes/index");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "rahasia_session_key",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(function (req, res, next) {
  res.locals.session = req.session || {};
  next();
});

app.use("/", router);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
