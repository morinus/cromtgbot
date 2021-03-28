const request = require('request-promise');

async function processFetchCardImage(msg) {
    const cardName = msg.content.substr(msg.content.indexOf(' ') + 1, msg.content.length - 1);
    const response = await request.get(("https://api.scryfall.com/cards/named?fuzzy={" + cardName + '}'));
    const responseJson = JSON.parse(response);

    if (responseJson.object == 'error')
    {
        msg.channel.send(responseJson['details']);
        return;
    }

    const hasBorderCropImage = responseJson['image_uris']['border_crop'] != undefined;
    if (hasBorderCropImage) {
        msg.channel.send(responseJson['image_uris']['border_crop']);
    } else {
        msg.channel.send(responseJson['image_uris']['png']);
    }
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

module.exports = { process };