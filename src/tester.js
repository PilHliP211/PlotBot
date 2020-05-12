function releaseTester(){

}

/**
 * For running in debug to avoid having to send 'real world' messages or commands to the bot
 */

const Commander = require('./plotBot/command');

function devTester(){

    var messages = [
    message = {
        content: '@PlotBot Add ' + (Math.floor(Math.random() * 100) + 1),
        author: {
            id: '459397934136688650'
        }
    },
    message = {
        content: '@PlotBot Init',
        author: {
            id: '459397934136688650'
        }
    },
    message = {
        content: '@PlotBot Plot wtd',
        author: {
            id: '459397934136688650'
        }
    },
    message = {
        content: 'butts',
        author: {
            id: '459397934136688650'
        }
    },
    message = {
        content: '@PlotBot ' + (Math.floor(Math.random() * 100) + 1),
        author: {
            id: '459397934136688650'
        }
    }]

    messages = [
        message = {
            content: '@PlotBot Plot wtd',
            author: {
                id: '459397934136688650'
            }
        }
    ]


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
    if(command != null){
        command.FillInMissing(message);
        command.Execute();
    }
    else
        console.log('Badly formatted command text');
}