const express = require("express");

const router = express.Router();

router.get("/car-product", (req, res, next) => {
  res.send(
    "<form action='/car-product' method='POST'><input type='text' name='carProduct' /><button type='submit'>Name A Car Product</button></form>",
  );
});

router.post("/car-product", (req, res, next) => {
  console.log(req.body);

  res.redirect("/");
});

module.exports = router;
