'use strict'

function onInit() {

    renderInput()
    // const funcDebounce = utilService.debounce
    // document.querySelector('input[name=curr-currency]').addEventListener('input', funcDebounce(onChangeCurrencyValue, 1000))
    // document.querySelector('input[name=to-currency]').addEventListener('input', funcDebounce(onChangeCurrencyValue, 1000))
}

// todo : Choose an appropriate name for the function

// When the user changes the type of currency or 
// the user types the number of currencies to be converted,
// the function sends the data to the currency-service

// function onChangeCurrencyValue(ev) {
// onUpdateCurrencyType(ev)
// renderInput()
// }

// The function receives the amount of coins 
// that the user typed and then sends the
// data to update the data model
// and render()

function onUpdateCurrencyAmount(ev) {

    const currencyAmount = +ev.value
    const inputName = ev.name

    // Checking if it's not a number then rest the inputs
    if (isNaN(currencyAmount)) return renderInput()

    // Updates the model with which input the user is at
    currencyService.updateSelectedInputName(inputName)
    // Updates the model in how many currencies should be converted
    currencyService.updateCurrencyAmount(currencyAmount, inputName)
    // render the result
    setTimeout(renderInput, 300)
}

function onUpdateCurrencyType(currencyType, selectName) {
    // update currencyType in modal
    currencyService.updateCurrencyType(currencyType, selectName)
    // update currencyType in dom
    renderWithDelay(500)
}

function renderWithDelay(t = 300) {
    setTimeout(renderInput, t)
}


// selected input to focus by user
function onSelectedInputToFocus(inputNames, currCurrencyVal, toCurrencyValue) {

    const lastUserInputSelected = currencyService.getUserSelectedInput()

    inputNames.forEach((inputName, idx) => {
        let value = (idx === 0) ? currCurrencyVal : toCurrencyValue
        const elInput = document.querySelector(`input[name=${inputName}]`)
        if (lastUserInputSelected === inputName) {
            elInput.focus()
            value = value + ''
            elInput.setSelectionRange(value.length, value.length)
        }
    })

}

function renderInput() {
    const inputNames = currencyService.getInputNames()
    const currencyType = currencyService.getAllCurrencyType()

    const currencyValue = getCurrencyValue()
    let currCurrencyAmount = currencyValue.currCurrency.amount
    let toCurrencyAmount = currencyValue.toCurrency.amount
    // todo fix value of amount from 4.254848 to 4.254 *************
    let userSelectedType = currencyService.getUserSelectedType()


    // ---if(value === 0) render ''
    currCurrencyAmount = (currCurrencyAmount) ? currencyValue.currCurrency.amount : ''
    toCurrencyAmount = (toCurrencyAmount) ? currencyValue.toCurrency.amount : ''

    let strHtml = ``

    inputNames.forEach((inputName, idx) => {
        strHtml += `
     <div class="calculator-container">
    
         <select name="${inputName}" onchange="onUpdateCurrencyType(this.value,'${inputName}')"
          placeholder="usd" aria-label="currency-type">`

        for (const currCurrencyType in currencyType) {
            strHtml += `<option ${(currCurrencyType === userSelectedType.currType && idx === 0) ? 'selected="selected"' : ''}        
            ${(currCurrencyType === userSelectedType.toType && idx === 1) ? 'selected="selected"' : ''}
            value="${currCurrencyType}">${currCurrencyType}</option> <br> \n`
        }

        strHtml += `</select>
                    
                    <div class="input-border"></div>
                 
                    <input type="text" value="${(idx === 0) ? currCurrencyAmount : toCurrencyAmount}" 
                        name="${inputName}"
                        oninput = "onUpdateCurrencyAmount(this)" >
        </div > `
    })

    const elDiv = document.querySelector(`.calculator`)
    elDiv.innerHTML = strHtml

    onSelectedInputToFocus(inputNames, currCurrencyAmount, toCurrencyAmount)
}