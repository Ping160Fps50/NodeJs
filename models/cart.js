const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json",
);

const getAllProductByFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    let cart = { products: [], totalPrice: 0 };
    if (!err) {
      cb(JSON.parse(fileContent));
    } else {
      cb(cart);
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    getAllProductByFile((cart) => {
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteById(id, productPrice) {
    getAllProductByFile((cart) => {
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((p) => p.id === id);
      if (!product) return;
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * product.qty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getAllProductByFile(cb);
  }
};
