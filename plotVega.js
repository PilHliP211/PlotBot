const vega = require('vega'), canvas = require('canvas'), fs = require('fs');
var vegaLite = require('vega-lite');


var linePlotOverTimeSpec = require('./line-plot-over-time.spec.json');
//var linePlotOverTimeSpec = require('./temp.spec.json');

// create a new view instance for a given Vega JSON spec
var view = new vega
  .View(vega.parse(linePlotOverTimeSpec))
  .renderer('none')
  .initialize();

// generate static PNG file from chart
view
  .toCanvas()
  .then(function (canvas) {
    // process node-canvas instance for example, generate a PNG stream to write var
    // stream = canvas.createPNGStream();
    console.log('Writing PNG to file...')
    fs.writeFileSync('linePlotOverTimeChart.png', canvas.toBuffer())
  })
  .catch(function (err) {
    console.log("Error writing PNG to file:")
    console.error(err)
  });