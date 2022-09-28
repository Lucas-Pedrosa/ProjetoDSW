if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT || 3000;

const express = require("express");
const expressSession = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/app/views");
app.set("layout", "layouts/layout");

app.use(express.json());
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ 
  limit: "10mb", 
  extended: false 
}));
app.use(expressSession({
  secret: process.env.EXPRESS_SESSION_SECRET,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false
}));
app.use(cookieParser());

// Routes
const indexRouter = require("./app/routes/index");
const usersRouter = require("./app/routes/users");

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(port, function() {
  console.log("Servidor rodando na porta", port);
});
