/**
 * command.js
 * This implements the high level API commands for PlotBot.
 */
const moment = require('moment');
const commandIdentifier = "@PlotBot";

class Command {
    /**
     * Constructs a new Command with a type and any parameters.
     * @param {string} params the text of the command with no prepended command identifier or command type string.
     * @param {*} type the type of the command.
     */
    constructor(params, type) {
        this._params = params;
        this._type = type;
    }

    set params(params) {
        this._params = params;
    }
    get params() {
        return this._params;
    }
    set type(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }

    Execute() {
        if (this._type === Type().Init) {
            console.log("Init " + this._params);
            init(this._params.split(" "));
        }
        else if (this._type === Type().Add) {
            console.log("Add " + this._params);
            add(this._params.split(" "));
        }
        else if (this._type === Type().Plot) {
            console.log("Plot " + this._params);
            plot(this._params.split(" "));
        }
    }
}

var commandExports = {
    types: function () {
        return Type();
    },
    Command,
    /**
     * Validates that the content of a message is a command and determines the command type.
     * @param {string} messageContent The content of a message to be turned into a command.
     * @returns {Command} a Command ready for execution or null if unusable message content was passed.
     */
    CreateCommand
}
module.exports = commandExports;


function init(params) {

}

function add(params) {

}

function plot(params) {
    var vega = require('./helpers/plotVega');
    var timespan = params[0];
    if(!timespan){
        timespan = "wtd"
    }
    var filters = getFiltering(timespan);
    vega.create(filters.startingTime,filters.endingTime, filters.tickCount);
    return;
}

function getFiltering(timespan){
    var startingTime;
    var endingTime;
    var niceFormat;
    var tickCount
    switch(timespan){
        case "week":
            startingTime = moment().startOf("day").subtract(1,"weeks").toDate().getTime();
            endingTime = moment(startingTime).add(1,"weeks").endOf("day").toDate().getTime();
            niceFormat = {"interval":"day","step":7}
            break;
        case "month":
            startingTime = moment().startOf("day").subtract(1,"months").toDate().getTime();
            endingTime = moment(endingTime).add(1,"months").endOf("day").toDate().getTime();
            niceFormat = {"interval":"week","step":4} //roughly...
            break;
        case 'mtd':
            startingTime = moment().startOf("month").toDate().getTime();
            endingTime = moment().endOf("day").toDate().getTime();
            niceFormat = {"interval":"month","step":1}
            break;
        case "wtd":
        default:
            startingTime = moment().startOf("week").toDate().getTime();
            endingTime = moment().endOf("day").toDate().getTime();
            niceFormat = {"interval":"week","step":1}
            break;
    }
    tickCount = moment.duration(moment(endingTime).diff(moment(startingTime))).days() * 2
    if(moment().isAfter(moment().hours(12).startOf("hour"))) tickCount++;

    return {"startingTime":startingTime,"endingTime":endingTime, "niceFormat":niceFormat, "tickCount": tickCount}
}

function thing(){
    // TODO:
    // delete first item in message
    // process every item left in message as a user to be included in the filter
}

function Type() {
    const CommandType = {
        Init:'Init',
        Add:'Add',
        Plot:'Plot',
    };
    Object.freeze(CommandType);
    return CommandType;
}

function CreateCommand(messageContent) {
    if (!messageContent.startsWith(commandIdentifier)) {
        return null;
    }
    var pieces = messageContent.split(' ');
    // remove commandIdentifier
    pieces.shift();
    var commandTypeStr = pieces[0];
    if (!Number.isNaN(parseInt(commandTypeStr))) {
        // if the first piece is a number use the default Add command.    
        return new Command(pieces.join(" "), Type().Add);
    }
    else if (commandTypeStr == Type().Add) {
        pieces.shift();
        return new Command(pieces.join(" "), Type().Add);
    }
    else if (commandTypeStr == Type().Init) {
        pieces.shift();
        return new Command(pieces.join(" "), Type().Init);
    }
    else if (commandTypeStr == Type().Plot) {
        pieces.shift();
        return new Command(pieces.join(" "), Type().Plot);
    }
    else {
        return null;
    }
}