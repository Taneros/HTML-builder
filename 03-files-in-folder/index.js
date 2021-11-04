const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

function convertBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return '0 Bytes';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  if (i === 0) {
    return bytes + ' ' + sizes[i];
  }

  return bytes / Math.pow(1024, i) + ' ' + sizes[i];
}

function readFolder(p) {
  // read directory
  fs.readdir(p, (err, items) => {
    if (err) throw new Error(`${err}`);
    // console.log(items);
    // iterate over directory
    items.forEach((el) => {
      // console.log(el);
      // create a new path for el
      const newPath = path.join(p, el);
      // check el info
      fs.lstat(newPath, (err, stats) => {
        if (err) {
          return console.log(err);
        }
        if (!stats.isDirectory()) {
          // console.log('\n', el, 'is not directory');
          console.log(path.basename(el).split('.')[0], '-', path.basename(el).split('.')[1], '- ', convertBytes(stats.size));
        }
      });
    });
  });
}

readFolder(filePath);
