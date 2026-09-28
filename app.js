// const http = require("http");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./util/database");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");
const carProductLisener = require("./routes/car-product");
// const { engine } = require("express-handlebars");

const app = express();

// app.set("view engine", "pug");
// app.engine(
//   "hbs",
//   engine({ layoutsDir: "views/layout", defaultLayout: "main", extname: "hbs" }),
// );
app.set("view engine, ejs");
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(result);
    
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/admin", carProductLisener);
app.use("/admin", adminRoute);
app.use(shopRoute);

app.use(errorController.get404);

// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000);
