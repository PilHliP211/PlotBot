/**
 * bot.js
 * This is the entry point for initializing the production Discord bot.
 */

const { Client, MessageAttachment } = require('discord.js');

const client = new Client();

const Commander = require('./plotBot/command');

const Channels = require('./plotBot/config.js').Channels;
var channels = new Channels();

client.on('ready', () => {
    console.log('Loading Data.');
    Commander.SetCommandIdentifier(client.user.id);
    console.log('Ready...');
});

client.on('message', message => {
    if(!message.guild || !message.channel) return;
    var guild = client.guilds.cache.array().find(ch => ch.name === message.guild.name);
    var channel = guild.channels.cache.array().find(ch => ch.name === message.channel.name);
    // was plot bot mentioned?
    if (message.mentions.members.array().find(member => member.id === client.user.id)) {
        var listenChans = channels.channelIds;
        // do we car about this channel or is it an init?
        if ((listenChans && listenChans.includes(channel.id)) || message.content.toLowerCase().includes("init")) {
            execute(message);
        }
    }
});

client.login(process.env.BOT_TOKEN);

async function execute(message){
    // parse message and construct a command...
    var command = Commander.CreateCommand(message.content);
    if (command != null) {
        var reply = await command.Execute(message);
        if(command.type === Commander.types().Init) {
            channels = new Channels();
        }

        if(command.type === Commander.types().Add) {
            message.react('👍');
        }
        
        if(reply && reply.length > 0) {
            message.reply(reply);
        }

        if(command.type === Commander.types().Plot) {
            message.channel.send(new MessageAttachment('./output/plot.png', 'plot.png')).catch(console.error);
        }
    }
    else
        console.log('Badly formatted command text');
}