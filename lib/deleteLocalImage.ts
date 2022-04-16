import * as path from "path";
import * as fs from "fs";

export const deleteLocalImage = (folder = "/public/files", image) => {
  const pathImageFolder = path.join(process.cwd(), folder);

  fs.readdir(pathImageFolder, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      let fileName = path.parse(file).name;
      let filePath = path.join(pathImageFolder, path.parse(file).base);

      if (fileName === image) {
        fs.unlink(filePath, (err) => {
          if (err) throw `${err} error happened`;
        });
      }
    }
  });
};
