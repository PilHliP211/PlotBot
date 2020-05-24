/**
 * plotVega.js
 * Provides functions for plotting graphs with the vega API
 */
const vega = require('vega'), canvas = require('canvas'), fs = require('fs');

let create =
  async function createPlot(beginMillis, endMillis, tickCount, user) {


    var plotSpec = require('./line.spec.json');
    // dynamic updates based on call params
    var expr = 'time(datum.moment) > ' + beginMillis + ' && time(datum.moment) < ' + endMillis + ' && datum.user == "' + user+'"';
    var dataPoints = plotSpec.data.find(item => item.name == "plotPoints");
    var filter = { "type": "filter", "expr": expr }
    dataPoints.transform.push(filter);
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
    var cvs = view.toCanvas();
    await cvs
      .then(function (canvas) {
        // process node-canvas instance for example, generate a PNG stream to write var
        // stream = canvas.createPNGStream();
        var dir = './output';
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        fs.writeFileSync(dir + '/plot.png', canvas.toBuffer());
        console.log('Wrote PNG to file...');
      })
      .catch(function (err) {
        console.log("Error writing PNG to file:")
        console.error(err)
      });
      delete require.cache[require.resolve('./line.spec.json')];
  };

module.exports.create = create;