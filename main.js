/*
 * Author: Ben Yang
 * Student Number: A00955176
 * Modified Date: July 16, 2022
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((filePaths) =>
    filePaths.forEach((path) => {
      IOhandler.grayScale(path, pathProcessed);
    })
  )
  .catch((err) => console.log(err));
