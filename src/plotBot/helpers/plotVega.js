/**
 * plotVega.js
 * Provides functions for plotting graphs with the vega API
 */

let create =
//todo endMillis for filter
function createPlot(beginMillis, endMillis, tickCount){
  const vega = require('vega'), canvas = require('canvas'), fs = require('fs');
  
  var plotSpec = require('../../../line.spec.json');
  // dynamic updates based on call params
  var expr = 'time(datum.moment) > '+beginMillis+' && time(datum.moment) < '+endMillis;
  var data = plotSpec.data.find(item => item.name == "plotPoints");
  var filter = {"type": "filter", "expr": expr}
  data.transform.push(filter);
  var scale = plotSpec.scales.find(item => item.name == "xscale");
  //scale.nice = {"interval":"hour", "step":10};
  scale.domainMin = beginMillis;
  scale.domainMax = endMillis;
  var axis = plotSpec.axes.find(item => item.scale == "xscale");
  axis.tickCount = tickCount;

  // create a new view instance for a given Vega JSON spec
  var view = new vega
    .View(vega.parse(plotSpec))
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
};

module.exports.create = create;