if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));

// Routes
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

app.listen(port, function() {
  console.log("Servidor rodando na porta", port)
});
