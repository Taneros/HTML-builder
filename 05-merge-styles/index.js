const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');
const bundleStyle = path.join(destPath, 'bundle.css');
const fsp = require('fs/promises');

async function makeBundle(src, dest) {
  // read directory
  const entries = await fsp.readdir(src, { withFileTypes: true });
  // check if dir already exist else -> delete and create new
  try {
    await fsp.mkdir(dest);
    const writeStream = fs.createWriteStream(bundleStyle, { flags: 'w', encoding: 'utf8' });
    // console.log(entries);
    console.log('Look what I found!');
    entries.forEach((el, idx) => {
      if (path.extname(el.name) === '.css') {
        console.log(idx + 1, ':', el.name);
        const readStream = fs.ReadStream(path.join(stylesPath, el.name), { flags: 'r', encoding: 'utf8' });
        readStream.on('data', async (data) => {
          writeStream.write('\n');
          await fsp.appendFile(bundleStyle, data + '\n');
        });

        // readStream.pipe(writeStream);
      }
    });
    writeStream.on('close', () => {
      console.log('These files are carefully bundled and saved to', destPath);
    });
  } catch (error) {
    console.error(error);
    fs.rm(dest, { recursive: true }, (err) => {
      if (err) {
        // console.error(err.message);
        return;
      }
      // console.log('deleted!');
      makeBundle(stylesPath, destPath);
    });
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
 */
