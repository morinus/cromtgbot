const Discord = require("discord.js");
const token = require("./config.json");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    // TODO:
});

// Login to CroMtg Discord as CroMtgBot#6982
client.login(token.BOT_TOKEN);