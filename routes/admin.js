const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/protected");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  body("title")
    .trim()
    .isString()
    .withMessage("Please Enter A Valid Title (letters and numbers only)!")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters!"),
  body("price").isFloat().withMessage("Price Should Be Float Number!"),
  body("description")
    .isLength({ min: 8, max: 400 })
    .withMessage("Description Should Be Min Char Of 8 And Max Char Of 400!")
    .trim(),
  adminController.postAddProduct,
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  body("title")
    .trim()
    .isString()
    .withMessage("Please Enter A Valid Title (letters and numbers only)!")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters!"),
  body("price").isFloat().withMessage("Price Should Be Float Number!"),
  body("description")
    .isLength({ min: 8, max: 400 })
    .withMessage("Description Should Be Min Char Of 8 And Max Char Of 400!")
    .trim(),
  adminController.postEditProduct,
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
