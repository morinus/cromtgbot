const request = require('request-promise');


async function getCardData(msg) {
    const cardName = msg.content.substr(msg.content.indexOf(' ') + 1, msg.content.length - 1);

    try {
        const response = await request.get(("https://api.scryfall.com/cards/named?fuzzy={" + cardName + '}'));
        const data = JSON.parse(response);

        return data;
    }
    catch (err) {
        // TODO: Error handling
        return undefined;
    }
}

async function processFetchCardImage(msg) {
    const cardData = await getCardData(msg);

    if (cardData == undefined) return;

    const hasBorderCropImage = cardData['image_uris']['border_crop'] != undefined;
    if (hasBorderCropImage) {
        msg.channel.send(cardData['image_uris']['border_crop']);
    } else {
        msg.channel.send(cardData['image_uris']['png']);
    }
}

async function processFetchCardLegality(msg) {
    const cardData = await getCardData(msg);

    if (cardData == undefined) return;
}

async function processFetchCardPrice(msg) {
    const cardData = await getCardData(msg);

    if (cardData == undefined) return;

    // TODO: Fetch current EUR/HRK
    //       optimize output
    const euroToHrk = 7.57;
    const euroPrice = cardData.prices.eur;
    const hrkPrice = (euroPrice * euroToHrk).toFixed(2);

    msg.channel.send("Trenutna cijena: \n```" + hrkPrice + " HRK" + "(" + euroPrice + " EUR)```");
}

function process(msg) {
    const botCommand = msg.content.substr(0, msg.content.indexOf(' '));

    switch (botCommand) {
        case "!karta":
            processFetchCardImage(msg);
            break;
        case "!legalnost":
            processFetchCardLegality(msg);
            break;
        case "!cijena":
            processFetchCardPrice(msg);
            break;
        default:
            break;
    }
}

module.exports = { process };