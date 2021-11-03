const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');
const bundleStyle = path.join(destPath, 'bundle.css');
const fsp = require('fs/promises');

async function makeBundle(src, dest) {
  // read directory src
  const entriesSrc = await fsp.readdir(src, { withFileTypes: true });
  const entriesDest = await fsp.readdir(dest, { withFileTypes: true });
  // check if bundle.css exist -> delete bundle.css
  fs.unlink(bundleStyle, (err) => {
    if (err) {
      console.error(err);
      bundle();
    }
    // run bundling function after delete
    else {
      console.log(bundleStyle, 'file deleted successfully');
      bundle();
    }
  });

  function bundle() {
    const writeStream = fs.createWriteStream(bundleStyle, { flags: 'a', encoding: 'utf8' });
    // console.log(entriesSrc);
    console.log('\nLook what I found!');
    entriesSrc.forEach((el, idx) => {
      if (path.extname(el.name) === '.css') {
        console.log(idx + 1, ':', el.name);
        const readStream = fs.createReadStream(path.join(stylesPath, el.name), { flags: 'r', encoding: 'utf8' });
        readStream.on('data', (chunk) => {
          writeStream.write(chunk + '\n\r');
        });
      }
    });
    console.log('\nThese files are carefully bundled and saved to', destPath);
  }
}

makeBundle(stylesPath, destPath);

/****
 *
 * create writeable stream
 * use pipe https://www.youtube.com/watch?v=8Vmvsn5JhVY&list=PLylgIRlJtHWQ4ccsyav6dd0y_SAgLXOnr&index=8
 *
 * Timur Shems
 * https://youtu.be/eQGBS15vUac?t=406
 *
 *  use buffer
 * https://youtu.be/eQGBS15vUac?t=2497
 *
 *
 *
 * use pipe
 * https://youtu.be/eQGBS15vUac?t=3463
 *
 *
 * create buffer
 *
 * https://youtu.be/eQGBS15vUac?t=3755
 *
 *
 * using readFile and writeFile with promises
 *
 */
