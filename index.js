const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

/**
 * Parse command line arguments
 */
function parseArgs() {
  if (process.argv.length < 3) {
    console.error('Please provide a CSV file name as an argument');
    process.exit(1);
  }
  // Get the filename from the command line arguments
  const fileName = process.argv[2];
  const searchIndex = process.argv[3];
  const searchValue = process.argv[4];
  const filePath = path.join(__dirname, fileName);
  return [filePath, searchIndex, searchValue];
}

/**
 * Throw an error and exit the process
 */
function throwErr(message) {
  console.error(message);
  process.exit(1);
}

/**
 * Read a CSV file and get data in an array
 *
 * @param {string} filePath - Path to the CSV file
 * @returns {array} - Array of objects
 */
function readCSVFile(filePath) {
  const result = [];
  if (!filePath || filePath === '')
    throwErr('Please provide a valid file path');
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => result.push(data))
      .on('end', () => resolve(result))
      .on('error', (error) => reject(error));
  });
}

async function main() {
  const [filePath, searchIndex, searchValue] = parseArgs();
  const result = await readCSVFile(filePath);
  if (result.length === 0) throwErr('No data found in the CSV file');

  const searchResult = result.filter((item) => {
    return (
      Object.values(item)[searchIndex].toString().includes(searchValue) > 0
    );
  });
  console.log(searchResult);
}

main();
