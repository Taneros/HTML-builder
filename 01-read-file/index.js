// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
// const filePath = './01-read-file/text.txt';
const stream = fs.createReadStream(filePath, { flags: 'r', encoding: 'utf8' });

stream.on('error', (err) => {
  console.log(`${err.message}`);
});

stream.on('data', (data) => {
  console.log(data.toString().replace(/[\n\r]+/gm, ''));
});
