const Discord = require("discord.js");
const token = require("./config.json");
const validateCommand = require("./src/validations/validate-command.js");
const processBotCommandSystem = require("./src/systems/process-bot-command-system.js");

const client = new Discord.Client();

// When the bot logs in to the server
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// When a message is sent to a listening channel
client.on('message', msg => {
    const isValidBotCommand = validateCommand.isValid(msg);

    if (isValidBotCommand) {
        processBotCommandSystem.process(msg);
    }
});

client.login(token.BOT_TOKEN);