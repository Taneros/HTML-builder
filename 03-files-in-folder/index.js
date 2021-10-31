const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname);

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

function walk(p) {
  // read directory
  fs.readdir(p, (err, items) => {
    // console.log(items);
    // iterate over directory
    items.forEach((el, idx) => {
      // console.log(el);
      // create a new path for el
      const newPath = path.join(p, el);
      // check el info
      fs.lstat(newPath, (err, stats) => {
        if (err) {
          return console.log(err);
        }
        if (stats.isDirectory()) {
          // console.log('\n', el, 'is directory');
          walk(newPath);
        } else {
          // dirInfoArr.push(newPath);
          // console.log('\n', el, 'is not directory');
          console.log(path.basename(el).split('.')[0], '-', path.basename(el).split('.')[1], '- ', convertBytes(stats.size));
        }
      });
    });
  });
}

walk(filePath);

/***
 * 
 * 
 * 
 *   let dirInfoArr = [];
  const dirInfo = await fs.readdir(filePath);
  for (let item of dirInfo) {
    const newPath = path.join(filePath, item);
    if (await fs.stat(newPath).isDiectory()) {
      dirInfoArr = [...dirInfoArr, ...(await walk(newPath))];
    } else {
      dirInfoArr.push(newPath);
    }
  }

  return dirInfoArr;

>>>> https://nodejs.dev/learn/nodejs-file-stats

const fs = require('fs')
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }

  stats.isFile() //true
  stats.isDirectory() //false
  stats.isSymbolicLink() //false
  stats.size //1024000 //= 1MB
})




 */
