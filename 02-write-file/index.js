const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const streamWriteConsole = fs.createWriteStream(filePath, { flags: 'w', encoding: 'utf8' });
const readline = require('readline');

streamWriteConsole.on('error', (err) => {
  console.log(`${err}`);
});

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter your text: ',
});

readLine.prompt();

readLine.on('line', (line) => {
  switch (line.trim()) {
    case 'exit':
      readLine.close();
      break;
    default:
      line = line + '\n';
      streamWriteConsole.write(line);
      readLine.prompt();
      break;
  }
});

readLine.on('close', () => {
  streamWriteConsole.end();
  streamWriteConsole.on('finish', () => {
    console.log(`\nBye! Your text saved to ${filePath}`);
  });
  setTimeout(() => {
    process.exit(0), 150;
  });
});
