const fs = require('fs');
const moment = require('moment');
const Discord = require('discord.js');

const client = new Discord.Client();

moment.defaultFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

var points;

client.on('ready', () => {
    var data = loadData();
    points = data.points;
    console.log("There are currently " + points.length + " plotted points.");
    console.log(moment().format());
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'ping') {
        message.reply('pong');
        message.reply('poing');
    }

    if (message.content === 'now') {
        message.reply(moment().format());
    }

    if(message.content.startsWith('get latest')) {
        message.reply(printPlotPoint(getLatest()));
    }

    if(message.content.startsWith('help')) {
        message.reply(getHelp());

    }

    if(message.content.startsWith('add')) {
        if(addPoint(message) < 0)
            message.reply("I ran into some trouble adding this plot point. :frowning:");
        else
            message.reply("Done and done. :sunglasses:");
    }

});

client.login(process.env.BOT_TOKEN);

function getHelp(){
    var helpText;
    helpText += "Hey there! My name is PlotBot! :sunglasses:\n";
    helpText += "I'm a discord bot that helps users plot and track values and trends over time.\n";
    helpText += "First, plot a few points using the `add` command. Like this:\n";
    helpText += "`@PlotBot add 75`\n";
    helpText += "This will create a plot point for your user with value of 75 for this instance in time.\n";
    helpText += "You can also specify other users by @-ing them after you specify the value to plot for them:\n";
    helpText += "`@PlotBot add 124 @userName`\n";
    helpText += "This will create a plot point for their user with value of 124 for this instance in time.\n";
    
    // no ability to specify custom moments for now.
    /*
    helpText += "Finally, you can specify a point in time other than right now by specifying a date and time string after the user:\n";
    helpText += "`@PlotBot add 394 @userName May 4th 2020 3:30pm`\n";
    helpText += "This will create a plot point for that user with value of 394 on May 4th at 3:30.\n";
    helpText += "If you want to specify a plot for your own graph but at a different time, just @ your own user.\n";
    */

    helpText += "Now that you have given me some data, I can do some cool stuff with it: \n";
    helpText += "`@PlotBot graph week`\n";
    helpText += "Then I'll send you a graph of all plots over the last week for your user that looks like this:\n";
    helpText += "<placeholder sample graph image>\n";

    helpText += "You can specify day, week, month or year. You can also add additional users you would like to see graphed along with yourself.\n";
    helpText += "`@PlotBot graph month @userName @wumpus`\n";
    helpText += "<placeholder sample graph image>\n";

    helpText += "Thanks for listening! I can't wait to get to work! :smile: ";

    return helpText;
}

function addPoint(message) {
    // add 15 user 5:00pm
    // add required optional optional
    // add int string moment

    var msgCmd = message.content.split(' ');
    var value  = parseInt(msgCmd[1]);
    if(!value) return -1;

    var user;
    var aMoment;
    if (msgCmd.length > 2)
        user = msgCmd[2].substring(msgCmd[2].indexOf('<@!')+3, msgCmd[2].length - 1);
    else
        user = message.author.id;
    
    if (msgCmd.length > 3)
    {
        // no ability to specify custom moments for now.
        /*
        var momentStr = message.content.slice(message.content.indexOf(user) + user.length);
        aMoment = moment(momentStr);
        */
       aMoment = moment();
    }
    else
        aMoment = moment();

    return add(user, value, aMoment);
}

function add(user, value, moment) {
    var point = {}
    point.user = user;
    point.value = value;
    point.moment = moment
    points.push(point);
    writeData();
    return 0;
}


function getLatest(message){
    sortByTime();
    return points[0];
}

function sortByTime()
{
    points.sort((a, b) => (moment(a.moment).isBefore(moment(b.moment))) ? 1 : -1)
}

function printPlotPoint(plotpoint){
    var output = "";
    output += "User: " + '<@' + plotpoint.user + '>' + '\n';
    output += "```";
    output += "Value: " + plotpoint.value + '\n';
    var time = moment(plotpoint.moment);
    output += "Time: " + time.format() + '\n';

    return output + "```";
    
}

function loadData() {
    var plotFile = fs.readFileSync('plots.json',"utf8");

    return JSON.parse(plotFile);
}

function writeData() {
    var data = {}
    data.points = points;
    fs.writeFileSync('plots.json',JSON.stringify(data));
}