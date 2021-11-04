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
      assCopyDir(assPathSrc, assPathDist);
      makeBundle(stylesPath, destPath);
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
// const myPromise = new Promise((res, rej) => {});

// myPromise
//   .then(() => {
//     fs.mkdir(projectDistPath, { recursive: true }, (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log('Directory is created.');
//     });
//   })
//   .then(() => {
//     assCopyDir(assPathSrc, assPathDist);
//   })
//   .then(() => {
//     makeBundle(stylesPath, destPath);
//   })
//   .then(createIndexHTML())
//   .catch((err) => {
//     console.error(err);
//   });

async function assCopyDir(src, dest) {
  const entries = await fsp.readdir(src, { withFileTypes: true });
  fs.access(dest, async (err) => {
    if (err) {
      await fsp.mkdir(dest);
      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          assCopyDir(srcPath, destPath);
        } else {
          await fsp.copyFile(srcPath, destPath);
        }
      }
    } else {
      fs.rm(dest, { recursive: true }, async (err) => {
        if (err) {
          console.error(err);
          return;
        }
        assCopyDir(src, dest);
      });
    }
  });
}

// make bundle.css -> copy to project-dist

async function makeBundle(src, dest) {
  // read directory src
  const entriesSrc = await fsp.readdir(src, { withFileTypes: true });
  // check if bundle exist -> delete bundle.css
  fs.unlink(bundleStyle, (err) => {
    if (err) {
      console.error(err);
      bundle();
    }
    // run bundling function if not exist
    else {
      console.log(bundleStyle, 'file deleted!');
      bundle();
    }
  });
  function bundle() {
    const writeStream = fs.createWriteStream(bundleStyle, { flags: 'a', encoding: 'utf8' });
    entriesSrc.forEach((el, idx) => {
      if (path.extname(el.name) === '.css') {
        const readStream = fs.createReadStream(path.join(stylesPath, el.name), { flags: 'r', encoding: 'utf8' });
        readStream.on('data', (chunk) => {
          writeStream.write(chunk + '\n\r');
        });
      }
    });
    console.log('\nFiles are bundled and saved to', destPath);
  }
}

async function createIndexHTML() {
  // copy templates file
  fs.copyFile(templateHTMLPath, indexHTMLPath, (err) => {
    if (err) console.error(err);
    console.log('template.html successfully copied! to', projectDistPath);
  });

  const indexRdStream = fs.createReadStream(indexHTMLPath, { flags: 'r', encoding: 'utf8' });
  const indexWrStream = fs.createWriteStream(path.join(projectDistPath, 'index-upd.html'), { flags: 'w', encoding: 'utf8' });
  let header = [];
  readHeader();
  let articles;
  readArticles();
  let footer;

  readFooter();

  function readHeader() {
    const buffer = [];
    const rd = fs.createReadStream(path.join(componentsPathSrc, 'header.html'));
    rd.on('data', (chunk) => {
      // console.log(chunk.toString());
      buffer.push(chunk.toString());
    });
    rd.on('end', () => {
      // console.log(buffer.join(''));
      header = buffer.slice();
      // console.log(header[0]);
    });
    return buffer.join('');
  }

  function readArticles() {
    const buffer = [];
    const rd = fs.createReadStream(path.join(componentsPathSrc, 'articles.html'));
    rd.on('data', (chunk) => {
      buffer.push(chunk.toString());
    });
    articles = buffer.join('');
  }

  function readFooter() {
    const buffer = [];
    const rd = fs.createReadStream(path.join(componentsPathSrc, 'footer.html'));
    rd.on('data', (chunk) => {
      buffer.push(chunk.toString());
    });
    footer = buffer.join('');
  }

  indexRdStream.on('data', async (chunk) => {
    chunk = chunk
      .toString()
      .replace(/{{header}}/, '****')
      .replace(/{{articles}}/, articles)
      .replace(/{{footer}}/, footer);
    indexWrStream.write(chunk);
  });

  indexRdStream.on('end', () => {
    // indexWrStream.end();
    fs.unlink(path.join(destPath, 'index.html'), (err) => {
      if (err) {
        console.error(err);
      }
    });
    fs.rename(path.join(destPath, 'index-upd.html'), path.join(destPath, 'index.html'), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}
