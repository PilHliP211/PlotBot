/**
 * points.js
 * Provides a means for interacting with data points
 */
const helper = require('./helpers/dataHelpers'), moment = require('moment');
class Points {

    constructor() {     
        this.points = sortByTime(helper.loadData().points);
    }

    // this could definitely be rewritten to insert based on point.moment to save on operational complexity..
    add(point) {
        this.points.push(point);
    }

    createPoint(user, value, moment){
        var point = {}
        point.user = user;
        point.value = value;
        point.moment = moment;
        return point;
    }

    write(){
        var file = sortByTime(this.points);
        helper.writeDataPiece(file,"points");
    }

}

function sortByTime(points) {
    if(!points)
    return [];
    points.sort((a, b) => (moment(a.moment).isBefore(moment(b.moment))) ? 1 : -1)
    return points;
}

var pointExports = {
    Points
}
module.exports = pointExports;
