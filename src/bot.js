/**
 * bot.js
 * This is the entry point for initializing the production Discord bot.
 */

const Discord = require('discord.js');

const client = new Discord.Client();

const Commander = require('./plotBot/command');

client.on('ready', () => {
    console.log('Loading Data.')
    // load data points from file.
    // pass data to new objects as needed.
    console.log('Ready...');
});

client.on('message', message => {
    
    // parse message and construct a command...
    var command = Commander.CreateCommand(message.content);
    if(command != null)
        command.Execute();
    else
        console.log('Badly formatted command text');
});

client.login(process.env.BOT_TOKEN);

function getHelp() {
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
    var value = parseInt(msgCmd[1]);
    if (!value) return -1;

    var user;
    var aMoment;
    if (msgCmd.length > 2)
        user = msgCmd[2].substring(msgCmd[2].indexOf('<@!') + 3, msgCmd[2].length - 1);
    else
        user = message.author.id;

    if (msgCmd.length > 3) {
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


function getLatest(message) {
    sortByTime();
    return points[0];
}

function sortByTime() {
    points.sort((a, b) => (moment(a.moment).isBefore(moment(b.moment))) ? 1 : -1)
}

function printPlotPoint(plotpoint) {
    var output = "";
    output += "User: " + '<@' + plotpoint.user + '>' + '\n';
    output += "```";
    output += "Value: " + plotpoint.value + '\n';
    var time = moment(plotpoint.moment);
    output += "Time: " + time.format() + '\n';

    return output + "```";

}

function plot() {
    
    //const parseTime = d3.timeParse('%d-%b-%y');
    const tsvString = pointArrToTsvString();

    var plotline = require('../plotline')
    plotline.plot(tsvString);

    var data = d3.tsvParse(tsvString, d => {
        return {
            key: parseTime(d.moment),
            value: +d.close
        };
    });
    console.log(data);
    data = createLines(["459397934136688650"],moment().subtract(1, 'week'));
    console.log(data);
    // create output files
    d3.line().x(d => 
        moment(d).format("MM/DD/YYYY a"));
    var line = d3nLine({
        data: data,
        lineColors: ["steelblue"],
        container: `<div id="container"><h2>Multiline Example</h2><div id="chart"></div></div>`,
        width: 800,
        height: 570,
    });
    line.d3.line().x(d => {
        moment(d).format("MM/DD/YYYY a");
        console.log(d);
    });
    output('./outputs/output', line);

    /*
    const canvasModule = require('canvas');
    var d3n = new D3Node({ canvasModule });
    d3n.json(json);
    const canvas = d3n.createCanvas(960, 500);
    const context = canvas.getContext('2d');
    // draw on your canvas, then output canvas to png
    canvas.pngStream().pipe(fs.createWriteStream('output.png'));
    */
    /*
        var document = new JSDOM(),
            svg = d3.select(document.body).append("svg");
        var json = {"my": "json"};
        
        d3.json(json).then( function (data) {
            console.log('starting');
            console.log(data);
        });
    */
    console.log('done');
}


function loadData() {
    var plotFile = fs.readFileSync('plots.json', "utf8");
    return JSON.parse(plotFile);
}

function writeData() {
    var data = getPoints();
    fs.writeFileSync('plots.json', JSON.stringify(data));
}

function getPoints() {
    var data = {}
    data.points = points;
    return data;
}

function pointArrToTsvString() {

    var tsvString = "user\tvalue\tmoment\n";

    points.forEach(point => {
        tsvString += point.user + '\t' + point.value + '\t' + point.moment + '\n';
    });

    return tsvString;
}

/**
 * Takes an Array of users and a moment in the past and generates line data as an array.
 * @param {array} userArr an Array of user IDs.
 * @param {moment} aMoment a moment occuring in the past.
 */
function createLines(userArr, aMoment) {
    var now = moment().minutes(0).seconds(0).milliseconds(0);
    aMoment = aMoment.minutes(0).seconds(0).milliseconds(0);
    const data = [];
    // TODO: this format is probably invalid..
    //const parseTime = d3.timeParse(moment.defaultFormat);

    userArr.forEach(user => {
        const thisUsersRelevantPoints = points.filter(point =>
            point.user == user && moment(point.moment).isSameOrAfter(aMoment)
        );
        var linePoints = [];
        thisUsersRelevantPoints.forEach(item => {
            linePoints.push(
                {
                    key: moment(item.moment).minutes(0).seconds(0).milliseconds(0).format("MM/DD/YYYY a"),
                    value: parseInt(item.value)
                }
            )
        });
        data.push(linePoints);
    });

    data.allKeys = Array.from(getAllMomentsAsStrings(aMoment, now, 'hours'));

    return data;
}

/**
 * retruns an array of all moments between two moments at a certain periodic interval
 * @param {moment} startMoment the lower bound moment
 * @param {moment} endMoment the upper bound moment
 * @param {character} interval either hours or days
 */
function getAllMomentsAsStrings(startMoment, endMoment, interval) {
    var moments = [];
    var intervals = endMoment.diff(startMoment, interval);

    for(var i = 0; i < intervals; i++)
    {
        moments.push(startMoment.add(i,interval).format("MM/DD/YYYY a"));
    }

    return moments;
}


function tester() {
    var userArr = ["459397934136688650"];
    var aMoment = moment().subtract(1, 'week');

    var data = createLines(userArr, aMoment);

    d3nLine({
        data: data,
        container: `<div id="container"><h2>Multiline Example</h2><div id="chart"></div></div>`,
        lineColors: ["steelblue", "darkorange"],
        width: 800,
        height: 570
    })
}