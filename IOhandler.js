/*
 * Author: Ben Yang
 * Student Number: A00955176
 * Modified Date: July 16, 2022
 */

const { rejects } = require("assert");
const { resolve } = require("path");

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  const promise = fs
    .createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut }))
    .promise()
    .then(
      () => resolve("Extraction operation complete"),
      (e) => rejects("error", e)
    );
  return promise;
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    const pngFilePath = [];
    fs.readdir(dir, (err, files) => {
      if (err) reject(err);
      files.forEach((file) => {
        if (path.extname(path.join(dir, file)) === ".png") {
          pngFilePath.push(path.join(dir, file));
        }
      });
      resolve(pngFilePath);
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // grayscale conversion
            const gray =
              0.2126 * this.data[idx] +
              0.7152 * this.data[idx + 1] +
              0.0722 * this.data[idx + 2];
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
          }
        }
        this.pack().pipe(
          fs.createWriteStream(path.join(pathOut, path.basename(pathIn)))
        );
        resolve();
      })
      .on("error", (err) => reject(err));
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
