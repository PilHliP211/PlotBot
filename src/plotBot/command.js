/**
 * command.js
 * This implements the high level API commands for PlotBot.
 */
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
            init(this._params);
        }
        else if (this._type === Type().Add) {
            console.log("Add " + this._params);
            add(this._params);
        }
        else if (this._type === Type().Plot) {
            console.log("Plot " + this._params);
            plot(this._params);
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

function init(message) {

}

function add(message) {

}

function plot(message) {

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