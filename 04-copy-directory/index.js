const fs = require('fs');
// const copyFile = require('fs/promises');
// const mkrDir = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, 'files');
const filePathDest = path.join(__dirname, 'files-copy');
const fsp = require('fs/promises');

async function copyDir(src, dest) {
  const entries = await fsp.readdir(src, { withFileTypes: true });
  // check if dir exist else -> delete and create new
  fs.access(dest, async (err) => {
    if (err) {
      // console.log(`${dest} not exist`);
      // console.log(entries);
      await fsp.mkdir(dest);
      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          await fsp.copyFile(srcPath, destPath);
        }
      }
    } else {
      // console.log(`${dest} exist`);
      fs.rm(dest, { recursive: true }, async (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        // console.log('deleted!');
        copyDir(src, dest);
      });
    }
  });
}

copyDir(filePath, filePathDest);
