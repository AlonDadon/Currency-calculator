'use strict'


function onInit() {
    document.querySelector('input[name=count-currency]').addEventListener('input', debounce(onValueCurrency, 1000))
    document.querySelector('select[name=curr-currency-type]').addEventListener('change', onValueCurrency)
}

// Updates the amount of coins to check in modal
function onUpdateCoinsAmount(coinsAmount = 1) {
    updateCoinsAmount(coinsAmount)
}

function onValueCurrency() {
    const currencyType = document.querySelector('select[name=curr-currency-type]').value
    // update currencyType in modal
    updateCurrencyType(currencyType)
    // Gets the current value of the currency from the modal
    const valueCurrency = getCurrencyValue();
    // todo update the dom , create render function
    console.log('valueCurrency', valueCurrency);

}





