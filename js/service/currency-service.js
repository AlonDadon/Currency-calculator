'use strict'

const gCurrency = loadFromStorage('currency') || {}
let gCoinsAmount = 1
const API_KEY = ''
let gCurrencyType = 'ils'

function updateCoinsAmount(coinsAmount) {
    const currNum = parseInt(coinsAmount)
    if (currNum !== typeof "number" && isNaN(currNum) && !currNum) return
    gCoinsAmount = currNum
}
function updateCurrencyType(currencyType) {
    gCurrencyType = currencyType
    console.log('service', gCurrencyType);

}

function getCurrencyValue() {
    const coinsAmount = gCoinsAmount
    gCoinsAmount = 0
    return { coinsAmount: coinsAmount * 4, gCurrencyType }
}