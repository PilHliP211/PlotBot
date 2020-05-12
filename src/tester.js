function releaseTester(){

}

/**
 * For running in debug to avoid having to send 'real world' messages or commands to the bot
 */

const Commander = require('./plotBot/command');

function devTester(){

    var messages = [
    message = {
        content: '@PlotBot Add 78'
    },
    message = {
        content: '@PlotBot Init'
    },
    message = {
        content: '@PlotBot Plot mtd'
    },
    message = {
        content: 'butts'
    },
    message = {
        content: '@PlotBot 78'
    }]


    messages.forEach(message => {
        OnMessage(message);
    })

    console.log("tests completed");
}
devTester();


function OnReady() {
    console.log('Ready..');
}

function OnMessage(message) {
    var command = Commander.CreateCommand(message.content);
    if(command != null)
        command.Execute();
    else
        console.log('Badly formatted command text');
}