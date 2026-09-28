const Product = require("../models/product");
const Cart = require("../models/cart");

const fetchAllProducts = (cb) => {
  Product.findAll()
    .then(cb)
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  fetchAllProducts((products) => {
    res.render("./shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  // Product.findAll({ where: { id: productId } })
  //   .then((products) => {
  //     res.render("./shop/product-detail", {
  //       pageTitle: `Product ${products.at(0).id}`,
  //       path: `/products`,
  //       product: products.at(0),
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  Product.findByPk(productId)
    .then((product) => {
      res.render("./shop/product-detail", {
        pageTitle: product.title,
        path: `/products`,
        product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  fetchAllProducts((products) => {
    res.render("./shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find((p) => p.id === product.id);
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render("./shop/cart", {
        pageTitle: "Your cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetchById(productId, (product) => {
    Cart.addProduct(product.id, product.price);
  });
  res.redirect("/cart");
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetchById(productId, (product) => {
    Cart.deleteById(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("./shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
