const fs = require('fs');
const { report } = require('process');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const createPath = ( path ) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
} 

const readFiles = async (fileDirectory) => {
  try {
    const filenames = await readdir(fileDirectory);
    const files_promise = filenames.map(filename => {
        return readFile(fileDirectory + filename, 'utf-8');
    });
    const response = await Promise.all(files_promise);
    let result = [];
    response.forEach((row) => { row.split(/\r?\n/).forEach((bin) => {result.push(bin)})});
    result = result.filter(e => e);
    return result;
  } catch (error) {
      console.error('Error while reading files under ' , fileDirectory, ', \n error message =>' , error);
  }
}

const createFile = async (filename, headers) => {
  try {
    fs.writeFileSync(filename, headers);
  } catch (error) {
    console.error(`Got an error trying to create ${filename}: ${error.message}`);
  }
}

const addRecord = async ({ filename, headers, data }) => {
  try {
    let newLine = [];
    headers.split(',').forEach((header) => {
      newLine.push(data[header]);
    });
    newLine = `\n${newLine}`; 
    await fs.appendFileSync(filename, newLine, { flag: 'a' });
  } catch (error) {
    console.error(`Got an error trying to add a record to ${filename}: ${error.message}`);
  }
}

const FileService = { createPath, readFiles, createFile, addRecord };
module.exports = FileService;