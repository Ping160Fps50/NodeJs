const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Submit Input</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'/> <button type='submit'>Submit</button></form></body>",
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = decodeURIComponent(
        parsedBody.split("=")[1].replace(/\+/g, " "),
      );
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
    return;
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>First Page</title></head>");
  res.write("<body><h1>Hello World</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;

// module.exports = {
//   handler: requestHandler,
//   someText: "Some Hard Code Text",
// };

// exports.handler = requestHandler;
// exports.someText = "Some Hard Code Text";
