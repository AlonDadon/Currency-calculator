'use strict'

function onInit() {

    renderInput()

    const funcDebounce = utilService.debounce

    document.querySelector('input[name=curr-currency]').addEventListener('input', funcDebounce(onChangeCurrencyValue, 1000))
    document.querySelector('select[name=curr-currency]').addEventListener('change', onChangeCurrencyValue, 'ev')
    document.querySelector('input[name=to-currency]').addEventListener('input', funcDebounce(onChangeCurrencyValue, 1000))
    document.querySelector('select[name=to-currency]').addEventListener('change', onChangeCurrencyValue, 'ev')
}

// The function receives the amount of coins 
// that the user typed and then sends the
//  data to update the data model

function onUpdateCurrencyAmount(ev) {

    const currencyAmount = ev.value
    const inputName = ev.name

    // Updates the model with which input the user is at
    currencyService.updateSelectedInputName(inputName)
    // Updates the model in how many currencies should be converted
    currencyService.updateCurrencyAmount(currencyAmount, inputName)
}

// todo : Choose an appropriate name for the function

// When the user changes the type of currency or 
// the user types the number of currencies to be converted,
// the function sends the data to the currency-service

function onChangeCurrencyValue(ev) {
    onUpdateCurrencyType(ev)
    // Gets the current value of the currency from the modal
    const valueCurrency = getCurrencyValue();
    // todo update the dom , create render function
    console.log('valueCurrency', valueCurrency);
}

function onUpdateCurrencyType(ev) {
    const selectName = ev.srcElement.name
    const currencyType = document.querySelector(`select[name=${selectName}]`).value
    // update currencyType in modal
    currencyService.updateCurrencyType(currencyType, selectName)
}


function renderInput() {
    const inputNames = currencyService.getInputNames()
    const currencyType = currencyService.getAllCurrencyType()

    const currencyValue = getCurrencyValue()
    const currCurrencyVal = currencyValue.currCurrency.amount
    const toCurrencyValue = currencyValue.toCurrency.amount

    let strHtml = ``

    inputNames.forEach((inputName, idx) => {
        strHtml += `
     <div class="calculator-container">
    
         <select name="${inputName}" placeholder="usd" aria-label="currency-type">`

        for (const currCurrencyType in currencyType) {
            strHtml += `<option ${(currCurrencyType === 'EUR' && idx === 0) ? 'selected="selected"' : ''} 
                        ${(currCurrencyType === 'ILS' && idx === 1) ? 'selected="selected"' : ''}
                        value="${currCurrencyType}">${currCurrencyType}</option> <br> \n`
        }

        // todo update real value to input

        strHtml += `</select>
                    
                    <div class="input-border"></div>
                
                    <input type="number" value="${(idx === 0 ? currCurrencyVal : toCurrencyValue)}" 
                        name="${inputName}" ${(idx === 0) ? 'autofocus' : ''} 
                        oninput = "onUpdateCurrencyAmount(this)" >
        </div > `
    })

    const elDiv = document.querySelector(`.calculator`)
    elDiv.innerHTML = strHtml
}





