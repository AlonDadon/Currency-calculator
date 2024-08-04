'use strict'


function onInit() {
    renderInput()
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


function renderInput() {
    const inputNames = ['curr-currency', 'curr-currency-1']
    const currencyType = getCurrencyType()
    let strHtml = ``

    inputNames.forEach((inputName, idx) => {
        strHtml += `
     <div class="calculator-container">
    
         <select name="${inputName}" placeholder="usd" aria-label="currency-type">`

        for (const currCurrencyType in currencyType) {
            strHtml += `<option value="${currCurrencyType}">${currCurrencyType}</option> <br> \n`
        }

        strHtml += `</select>
                    
                    <div class="input-border"></div>
        
                    <input type="number" value="1" name="${inputName}" autofocus
                        oninput="onUpdateCoinsAmount(this.value)">
        </div>`

    })

    const elDiv = document.querySelector(`.calculator`)
    elDiv.innerHTML = strHtml
}





