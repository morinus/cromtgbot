const request = require('request');

function processFetchCardImage(msg) {
    const cardName = msg.content.substr(msg.content.indexOf(' ') + 1, msg.content.length - 1);

    request("https://api.scryfall.com/cards/named?fuzzy={" + cardName + '}', function (error, response, body) {
        if (error != null) {
            console.log(error);
            return;
        }

        const cardJson = JSON.parse(body);
        msg.channel.send(cardJson['image_uris']['border_crop']);
    });
}

function process(msg) {
    const botCommand = msg.content.substr(0, msg.content.indexOf(' '));

    switch (botCommand) {
        case "!karta":
            processFetchCardImage(msg);
            break;
        case "!cijena":
            // TODO: processFetchCardPriceSystem(msg);
            break;
        case "!legalnost":
            // TODO: processFetchCardLegality(msg);
            break;
        default:
            break;
    }
}

module.exports = { process }