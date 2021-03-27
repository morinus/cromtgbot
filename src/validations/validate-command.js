const botCommands = require('../../botCommands.json');


function validateIsBotCommand(msg) {
    const message = msg.content.toLowerCase();
    const isValidBotCommand = message.startsWith("!karta");
    
    // TODO:
    // Expand to check for each of the available

    return isValidBotCommand;
}

function validateIsNotBotUser(msg) {
    return msg.author != msg.author.bot;
}

function isValid(msg) {
    const isValidBotCommand = validateIsBotCommand(msg);
    const isNotBotUser = validateIsNotBotUser(msg);
    const isValid = isValidBotCommand && isNotBotUser;

    return isValid;
}

module.exports = { isValid }