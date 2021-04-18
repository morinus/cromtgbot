const request = require('request-promise');
const config = require('../../config.json');


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

async function getCurrencyExchangeRate() {
    try {
        const response = await request.get(("https://currencyapi.net/api/v1/rates?key=" + config.CURRENCYAPI_API_KEY));
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

    // Some cards don't have defined border cropped image so we print the regular .png image
    const hasBorderCropImage = cardData['image_uris']['border_crop'] != undefined;
    if (hasBorderCropImage) {
        msg.channel.send(cardData['image_uris']['border_crop']);
    } else {
        msg.channel.send(cardData['image_uris']['png']);
    }
}

function getIsLegalDiscordEmoticon(legality) {
    const isLegal = 'legal';

    return legality == isLegal ? ":white_check_mark:" : ":no_entry:";
}

async function processFetchCardLegality(msg) {
    const cardData = await getCardData(msg);

    if (cardData == undefined) return;

    const standardLegality = getIsLegalDiscordEmoticon(cardData.legalities.standard);
    const pioneerLegality = getIsLegalDiscordEmoticon(cardData.legalities.pioneer);
    const modernLegality = getIsLegalDiscordEmoticon(cardData.legalities.modern);
    const legacyLegality = getIsLegalDiscordEmoticon(cardData.legalities.legacy);
    const pauperLegality = getIsLegalDiscordEmoticon(cardData.legalities.pauper);

    msg.channel.send(
        "Legalnost karte:\n" +
        standardLegality + " Standard\n" +
        pioneerLegality + " Pioneer\n" + 
        modernLegality + " Modern\n" +
        legacyLegality + " Legacy\n" +
        pauperLegality + " Pauper");
}

async function processFetchCardPrice(msg) {
    const cardData = await getCardData(msg);

    if (cardData == undefined) return;

    // Free plan from currencyapi.net allows 1250 requests per month
    // Free plan allows only USD as base currency so we need to 
    // calculate HRK from response manually
    const data = await getCurrencyExchangeRate();

    if (data == undefined) return;

    const usdToEurRate = data.rates.EUR;
    const usdToHrkRate = data.rates.HRK;
    const eurToHrkRate = usdToHrkRate / usdToEurRate;
    const euroPrice = cardData.prices.eur;
    const hrkPrice = (euroPrice * eurToHrkRate).toFixed(2);

    msg.channel.send("Trenutna cijena: \n```" + hrkPrice + " HRK" + " (" + euroPrice + " EUR)```");
}

function process(msg) {
    const botCommand = msg.content.substr(0, msg.content.indexOf(' '));

    switch (botCommand) {
        case "!karta":
        case "!k":
            processFetchCardImage(msg);
            break;
        case "!legalnost":
        case "!l":
            processFetchCardLegality(msg);
            break;
        case "!cijena":
        case "!c":
            processFetchCardPrice(msg);
            break;
        default:
            break;
    }
}

module.exports = { process };