// import * as fs from 'fs';
const fs = require('fs');
const filePath = '01-read-file/text.txt';
const stream = fs.createReadStream(filePath, { flags: 'r' });

stream.on('data', (data) => {
  console.log(
    data
      .toString()
      .replace(/[\n\r]+/gm, '')
      .split()
  );
});
