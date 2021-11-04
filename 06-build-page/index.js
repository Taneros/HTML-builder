const fs = require('fs');
const path = require('path');
const templateHTMLPath = path.join(__dirname, 'template.html');
const componentsPathSrc = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');
const assPathSrc = path.join(__dirname, 'assets');
const assPathDist = path.join(projectDistPath, 'assets');
const indexHTMLPath = path.join(projectDistPath, 'index.html');
const fsp = require('fs/promises');
const stylesPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');
const bundleStyle = path.join(destPath, 'style.css');

// create folder project-dist
createProjectDir(projectDistPath);

async function createProjectDir(dest) {
  fs.access(dest, async (err) => {
    if (err) {
      await fsp.mkdir(dest);
      assetsCopy(assPathSrc, assPathDist);
      makeCSSBundle(stylesPath, destPath);
      createIndexHTML();
    } else {
      fs.rm(dest, { recursive: true }, async (err) => {
        if (err) {
          console.error(err);
        }
        createProjectDir(dest);
      });
    }
  });
}

// copy assets folder
async function assetsCopy(src, dest) {
  const entries = await fsp.readdir(src, { withFileTypes: true });
  await fsp.mkdir(dest);
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      assetsCopy(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

// make bundle.css -> copy to project-dist
async function makeCSSBundle(src, dest) {
  // read directory src
  const entriesSrc = await fsp.readdir(src, { withFileTypes: true });
  const writeStream = fs.createWriteStream(bundleStyle, { flags: 'a', encoding: 'utf8' });
  entriesSrc.forEach((el, idx) => {
    if (path.extname(el.name) === '.css') {
      const readStream = fs.createReadStream(path.join(stylesPath, el.name), { flags: 'r', encoding: 'utf8' });
      readStream.on('data', (chunk) => {
        writeStream.write(chunk + '\n\r');
      });
    }
  });
  // console.log('\nStyles are bundled and saved to', destPath);
}

async function createIndexHTML() {
  // copy templates file to project dest-folder
  await copyTemplateFile();
  function copyTemplateFile() {
    return new Promise((res, rej) => {
      fs.copyFile(templateHTMLPath, indexHTMLPath, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  function readFile(filePath) {
    return new Promise((res, rej) => {
      fs.readFile(filePath, (err, data) => {
        if (err) rej(err);
        else res(data.toString());
      });
    });
  }

  const indexRdStream = fs.createReadStream(indexHTMLPath, { flags: 'r', encoding: 'utf8' });
  const indexWrStream = fs.createWriteStream(path.join(projectDistPath, 'index-upd.html'), { flags: 'w', encoding: 'utf8' });

  indexRdStream.on('data', async (chunk) => {
    // console.log('reading is on!');
    chunk = chunk
      .toString()
      .replace(/{{header}}/, await readFile(path.join(componentsPathSrc, 'header.html')))
      .replace(/{{articles}}/, await readFile(path.join(componentsPathSrc, 'articles.html')))
      .replace(/{{footer}}/, await readFile(path.join(componentsPathSrc, 'footer.html')));
    indexWrStream.write(chunk);
  });

  indexRdStream.on('end', async () => {
    // console.log('reading stream ended');
    await fsp.unlink(path.join(destPath, 'index.html'), (err) => {
      if (err) {
        console.error(err);
      }
    });
    await fsp.rename(path.join(destPath, 'index-upd.html'), path.join(destPath, 'index.html'), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}
