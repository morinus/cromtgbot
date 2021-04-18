function validateIsNotBotUser(msg) {
    return msg.author != msg.author.bot;
}

function isValid(msg) {
    const isNotBotUser = validateIsNotBotUser(msg);
    const isValid = isNotBotUser;

    return isValid;
}

module.exports = { isValid };