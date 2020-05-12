/**
 * dataHelpers.js
 * Provides functions for retrieving data from storage.
 */
const fs = require('fs');
const filename = './data/plots.json';

/**
 * Loads the json file and returns a JSON object
 */
function loadData() {
    var plotFile = fs.readFileSync(filename, "utf8");
    return JSON.parse(plotFile);
}
/**
 * Writes a json object to the file
 * @param {*} data the object to be serialized to a file
 */
function writeData(data) {
    fs.writeFileSync(filename, JSON.stringify(data));
}


var helperExports = {
    loadData,
    writeData
}
module.exports = helperExports;
