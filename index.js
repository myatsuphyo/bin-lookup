const axios = require('axios');
const FileService = require('./files-service');

// env config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const readPath = process.env.READ_PATH || './data/';
const writePath = process.env.WRITE_PATH || './result/';
const reportFilename = process.env.WRITE_PATH + process.env.REPORT_FILENAME || './result/report.csv';
const reportHeaders = process.env.REPORT_HEADERS || 'bin,brand,bank,www,phone,type,level,country';
const errorFilename = process.env.WRITE_PATH + process.env.ERROR_FILENAME || './result/errors.csv';
const errorHeaders = process.env.ERROR_HEADERS || 'bin,status,statusText';

(async function () {
  await FileService.createPath(writePath);
  await FileService.createFile(reportFilename, reportHeaders);
  await FileService.createFile(errorFilename, errorHeaders);
  const data = await FileService.readFiles(readPath);
  console.log('Total BIN numbers: ', data.length);
  data.forEach((row, index) => {
    if (index%100 === 0 && index !== 0) { console.log (`Reading ${index} BIN numbers ...`)};
    (async () => {
      try {
        const response = await axios.post(process.env.API_ENDPOINT || 'https://pci.bindb.com/api/iin_json/', null, { params:  {
          api_key: process.env.API_KEY, 
          bin: row }});
        await FileService.addRecord({
          filename: reportFilename, 
          headers: reportHeaders, 
          data: response.data.result
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('***** ERROR *****')
          console.error("Your API key is unauthorized.");
          process.exit();
        }
        error.response.bin = row;
        await FileService.addRecord({
          filename: errorFilename, 
          headers: errorHeaders, 
          data: error.response
        });
      }
    })();
  });
  console.log(`Writing at ${writePath}`);
})();

