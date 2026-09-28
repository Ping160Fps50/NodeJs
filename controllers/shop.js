const Product = require("../models/product");

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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("./shop/cart", {
        pageTitle: "Your cart",
        path: "/cart",
        products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products.at(0);
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product = products.at(0);
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.fetchById(productId, (product) => {
  //   Cart.deleteById(productId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            }),
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("./shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
