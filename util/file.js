const fs = require("fs");

const deleteFile = (filePath) => {
  const enhancedFilePath = filePath.replace("/", "");
  console.log(enhancedFilePath);

  fs.unlink(enhancedFilePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
