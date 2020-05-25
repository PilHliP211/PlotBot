/**
 * command.js
 * This implements the high level API commands for PlotBot.
 */
const moment = require('moment')

const Points = require('./points').Points;
var points = new Points();

const Channels = require('./config.js').Channels;
var channels = new Channels();

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

    async Execute(message) {
        this.fillInMissing(message);
        if (this._type === Type().Init) {
            console.log("Init " + this._params);
            return init(message.channel);
        }
        else if (this._type === Type().Add) {
            console.log("Add " + this._params);
            return add(this._params.split(" "));
        }
        else if (this._type === Type().Plot) {
            console.log("Plot " + this._params);
            return await plot(this._params.split(" "));
        }
    }

    fillInMissing(message){
        var pieces = this._params.split(" ");
        if(this._type == Type().Add) {
            // ensure the command format is ok:
            var value = parseInt(pieces[0]);
            if (!value) return; // this means the Execute will fail.

            // if user piece was omitted, use the id of the message author
            if (pieces.length < 2)
                pieces.push(message.author.id);
        }
        else if(this._type == Type().Plot){
            pieces.push(message.author.id);
        }
        this._params = pieces.join(" ");
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


function init(channel) {
    if(!channels) channels = [];
    channels.AddListenToChannel(channel.id);
    return getHelp();
}

function add(params) {
    var value = parseInt(params[0]);
    if (!value) return -1;

    var user = params[1];
    var mentionPrefix = "<@";
    if (user.startsWith(mentionPrefix))
        user = user.substring(user.indexOf(mentionPrefix) + mentionPrefix.length, user.length - 1);
    
    points.add(points.createPoint(user,value,moment()));
    points.write();
    return;
}

async function plot(params) {
    var timespan = params[0];
    if(!timespan){
        timespan = "week"
    }
    var user = params[1];
    var filters = getFiltering(timespan,user);
    await require('./helpers/plotVega').create(filters.startingTime,filters.endingTime, filters.tickCount, filters.user);
    return "Here ya go!";
}

function getFiltering(timespan, user){
    var startingTime;
    var endingTime;
    var niceFormat;
    var tickCount
    switch(timespan){
        case "week":
            startingTime = moment().startOf("week").toDate().getTime();
            endingTime = moment(startingTime).endOf("week").toDate().getTime();
            niceFormat = {"interval":"day","step":7}
            break;
        case "month":
            startingTime = moment().startOf("day").toDate().getTime();
            endingTime = moment(endingTime).endOf("month").toDate().getTime();
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

    return {"startingTime":startingTime,"endingTime":endingTime, "niceFormat":niceFormat, "tickCount": tickCount, "user":user}
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
    var pieces = messageContent.split(' ');
    // remove bot mention
    pieces.shift();
    var commandTypeStr = pieces[0].toLowerCase();
    if (!Number.isNaN(parseInt(commandTypeStr))) {
        // if the first piece is a number use the default Add command.    
        return new Command(pieces.join(" "), Type().Add);
    }
    else if (commandTypeStr == Type().Add.toLowerCase()) {
        pieces.shift();
        return new Command(pieces.join(" "), Type().Add);
    }
    else if (commandTypeStr == Type().Init.toLowerCase()) {
        pieces.shift();
        return new Command(pieces.join(" "), Type().Init);
    }
    else if (commandTypeStr == Type().Plot.toLowerCase()) {
        pieces.shift();
        return new Command(pieces.join(" "), Type().Plot);
    }
    else {
        return null;
    }
}

function getHelp() {
    var helpText = "";
    helpText += "Hey there! My name is PlotBot! :sunglasses:\n";
    helpText += "I'm a discord bot that helps users plot and track values and trends over time.\n";
    helpText += "First, plot a few points using the `add` command. Like this:\n";
    helpText += "`@PlotBot add 75`\n";
    helpText += "This will create a plot point for your user with value of 75 for this instance in time.\n";
    helpText += "If you are lazy like me, you don't even need to send the `add` part. Just send `@PlotBot 75` to Add a value of 75.\n";
    /*
    helpText += "You can also specify other users by @-ing them after you specify the value to plot for them:\n";
    helpText += "`@PlotBot add 124 @userName`\n";
    helpText += "This will create a plot point for their user with value of 124 for this instance in time.\n";
    */
    // no ability to specify custom moments for now.
    /*
    helpText += "Finally, you can specify a point in time other than right now by specifying a date and time string after the user:\n";
    helpText += "`@PlotBot add 394 @userName May 4th 2020 3:30pm`\n";
    helpText += "This will create a plot point for that user with value of 394 on May 4th at 3:30.\n";
    helpText += "If you want to specify a plot for your own graph but at a different time, just @ your own user.\n";
    */

    helpText += "Now that you have given me some data, I can do some cool stuff with it! \n If you send me: \n";
    helpText += "`@PlotBot plot `\n";
    helpText += "I'll reply with an image of a graph of all plots this week for your user.\n";

    /*
    helpText += "You can specify day, week, month or year. You can also add additional users you would like to see graphed along with yourself.\n";
    helpText += "`@PlotBot graph month @userName @wumpus`\n";
    helpText += "<placeholder sample graph image>\n";
    */

    helpText += "Thanks for listening! I can't wait to get to work! :smile:";

    return helpText;
}