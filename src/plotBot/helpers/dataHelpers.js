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

    var plotFile;
    try{
        plotfile = fs.readFileSync(filename, "utf8");
    } catch (err){
        console.log("datafile could not be opened. creating new datafile.");
        plotFile = createNewDataFile();
    }
    return JSON.parse(plotFile);
}
/**
 * Writes a json object to the file
 * @param {*} data the object to be serialized to a file
 */
function writeData(data) {
    fs.writeFileSync(filename, JSON.stringify(data));
}

/**
 * Reads the current file and writes a top-level piece provided to the file
 * @param {*} datapiece the object to be serialized to a file as a piece
 * @param {string} piecename the key for the data to be overwritten
 */
function writeDataPiece(datapiece,piecename) {
    var file = loadData();
    file[piecename] = datapiece;
    writeData(file);
}

function createNewDataFile() {
    var f = new File(["{}"],filename);
    return f;
}


var helperExports = {
    loadData,
    writeDataPiece
}
module.exports = helperExports;
