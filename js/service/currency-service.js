'use strict'

const gCurrency = storageService.loadFromStorage('currency') || {}
console.log(gCurrency);

const API_KEY = '4e4483bb1e61b841cf598fe5'

const gUserSelected = {
    inputNames: ['curr-currency', 'to-currency'],
    selectedInputName: 'curr-currency',
    currCurrency: {
        amount: 0,
        currencyType: 'EUR'
    },
    toCurrency: {
        amount: 0,
        currencyType: 'ILS'
    }
}

// An object with all functions to export
const currencyService = {
    updateCurrencyAmount,
    getAllCurrencyType,
    getCurrencyValue,
    updateSelectedInputName,
    updateCurrencyType,
    getInputNames,
    getUserSelectedInput,
    getUserSelectedType
}

// The function returns the names of the inputs
function getUserSelectedType() {
    return {
        currType: utilService.getCopyObjValue(gUserSelected.currCurrency, 'currencyType'),
        toType: utilService.getCopyObjValue(gUserSelected.toCurrency, 'currencyType')
    }
}

function getInputNames() {
    return gUserSelected.inputNames
}
function getUserSelectedInput() {
    return gUserSelected.selectedInputName
}

// The function updates the model on which input the user is now

function updateSelectedInputName(inputName) {
    gUserSelected.selectedInputName = inputName
}



//  The function updates the currency value in the object in both directions
//  example key EUR:4.20 and key ILS:0.24
//  this way the data is saved in gCurrency 
//  and this reduces the amount of request to api

function updateGCurrency(conversionRate, currTypeCurrency, toTypeCurrency, amount, lastUpdate) {
    const newRate = conversionRate

    const lastUpdateUtc = dateService.getFormattedDate(lastUpdate)
    // Updates the key of the current currency
    if (gCurrency[currTypeCurrency]) {

        gCurrency[currTypeCurrency][toTypeCurrency] = {
            conversionRate: newRate,
            // ['lastUpdate']: lastUpdate,
            // 'lastUpdate': lastUpdate,
            lastUpdate,
            // lastUpdate: Date.now(),
            lastUpdateUtc
        }

    } else {
        // If the key does not exist, create it

        gCurrency[currTypeCurrency] = {
            [toTypeCurrency]: {
                conversionRate: newRate,
                // ['lastUpdate']: lastUpdate,
                // lastUpdate: Date.now(),
                // 'lastUpdate': lastUpdate,
                lastUpdate,
                lastUpdateUtc
            }
        }

    }

    // Updates the key of the secondary currency
    if (gCurrency[toTypeCurrency]) {

        gCurrency[toTypeCurrency][currTypeCurrency] = {
            conversionRate: amount / newRate,
            // ['lastUpdate']: lastUpdate,
            // lastUpdate: Date.now(),
            // 'lastUpdate': lastUpdate,
            lastUpdate,
            lastUpdateUtc,
        }

    } else {

        gCurrency[toTypeCurrency] = {
            [currTypeCurrency]: {
                conversionRate: amount / newRate,
                // ['lastUpdate']: lastUpdate,
                // lastUpdate: Date.now(),
                // 'lastUpdate': lastUpdate,
                lastUpdate,
                lastUpdateUtc,
            }
        }
    }
    console.log(gCurrency)

    storageService.saveToStorage('currency', gCurrency)
}

//  The function sends a request to the server and receives
//  the current currency value and
//  then updates the gCurrency

async function _convertCurrency(amount = '2', isCurrCurrency) {

    // Checks from which currency to which currency should be converted
    // depending on the user's choice
    const currTypeCurrency = (isCurrCurrency) ? gUserSelected.currCurrency.currencyType : gUserSelected.toCurrency.currencyType
    const toTypeCurrency = (isCurrCurrency) ? gUserSelected.toCurrency.currencyType : gUserSelected.currCurrency.currencyType

    // url for get request(axios)
    // const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${currTypeCurrency}/${toTypeCurrency}/${amount}`
    const url = `https://v6.exchangerate-api.com/pair/${currTypeCurrency}/${toTypeCurrency}/${amount}`


    // check if currency exists in gCurrency
    if (gCurrency[currTypeCurrency] && gCurrency[toTypeCurrency]) {

        const lastUpdateToCheck = gCurrency[currTypeCurrency][toTypeCurrency].lastUpdate
        // checks if a month has passed since we send a request from server(api)
        if (dateService.isFromLastMonth(lastUpdateToCheck)) {

            // get from gCurrency(localStorage)
            return Promise.resolve()

                .then(() => {
                    return {
                        conversionRate: gCurrency[currTypeCurrency][toTypeCurrency].conversionRate,
                        lastUpdate: gCurrency[currTypeCurrency][toTypeCurrency].lastUpdate
                    }
                })

                .then((data) => updateGCurrency(data.conversionRate, currTypeCurrency, toTypeCurrency, amount, data.lastUpdate))

                .then(() => amount * gCurrency[currTypeCurrency][toTypeCurrency].conversionRate)
        } else {

            // get from ajax
            return axios.get(url)

                .then((prmData) => {
                    console.log(prmData);
                    return prmData.data
                })

                .then(() => {
                    return {
                        conversionRate: prmData.conversion_rate,
                        lastUpdate: prmData.time_last_update_unix * 1000
                    }
                })

                .then((data) => updateGCurrency(data.conversionRate, currTypeCurrency, toTypeCurrency, amount, data.lastUpdate))

                .then(() => amount * gCurrency[currTypeCurrency][toTypeCurrency].conversionRate)

                .catch((err) => (console.log('The server is down right now, please try again later')))
        }
    }
    else {

        // if the currency does not exists in gCurrency
        return axios.get(url)

            .then((prmData) => {
                console.log(prmData);
                return prmData.data
            })

            .then((prmData) => {
                return {
                    conversionRate: prmData.conversion_rate,
                    lastUpdate: prmData.time_last_update_unix * 1000
                }
            })

            .then((data) => updateGCurrency(data.conversionRate, currTypeCurrency,
                toTypeCurrency, amount, data.lastUpdate))

            .then(() => amount * gCurrency[currTypeCurrency][toTypeCurrency].conversionRate)

            .catch((err) => (console.log('The server is down right now, please try again later')))
    }

}

// The function updates the model with 
// the amount of coins according to the user's choice or 
// according to the current value of the coin

// todo fix the argument of inputName to isCurrCurrency***********
async function updateCurrencyAmount(currencyAmount, inputName) {
    const currNum = parseInt(currencyAmount)

    if (currNum !== typeof "number" && isNaN(currNum) && !currNum) {
        gUserSelected.currCurrency.amount = 0
        gUserSelected.toCurrency.amount = 0
        return
    }

    if (inputName === 'curr-currency') {
        // update the user selected//
        gUserSelected.currCurrency.amount = currNum
        // (get)-Receives the currency amount after the conversion

        // Update the secondary input
        _convertCurrency(currencyAmount, true)
            .then((conversionRes) => gUserSelected.toCurrency.amount = conversionRes)
    } else {
        gUserSelected.toCurrency.amount = currNum
        _convertCurrency(currencyAmount, false)
            .then((conversionRes) => gUserSelected.currCurrency.amount = conversionRes)
    }
}


// The function updates the model with
// the type of currency the user has selected

// todo fix the argument of inputName to isCurrCurrency***********
function updateCurrencyType(currencyType, selectName) {

    const isCurrCurrency = (selectName === 'curr-currency') ? true : false

    // If the user selects the same type in the second input, 
    // then the function switches between the values ​​in the inputs
    // example inputType1 ='ILS' and inputType2 ='EUR'   
    // and now user selected inputType1'EUR'

    if (isCurrCurrency && currencyType === gUserSelected.toCurrency.currencyType ||
        !isCurrCurrency && currencyType === gUserSelected.currCurrency.currencyType
    ) {
        // save in side the type 
        const currType = utilService.getCopyObjValue(gUserSelected.currCurrency, 'currencyType')
        const toType = utilService.getCopyObjValue(gUserSelected.toCurrency, 'currencyType')
        // save in side amount
        const currAmount = utilService.getCopyObjValue(gUserSelected.currCurrency, 'amount')
        const toAmount = utilService.getCopyObjValue(gUserSelected.toCurrency, 'amount')

        if (isCurrCurrency) {
            // update the type
            gUserSelected.toCurrency.currencyType = currType
            gUserSelected.currCurrency.currencyType = currencyType

            // todo fix the argument of inputName to isCurrCurrency***********
            // update the amount
            updateCurrencyAmount(currAmount, 'to-currency')
        } else {
            gUserSelected.currCurrency.currencyType = toType
            gUserSelected.toCurrency.currencyType = currencyType
            updateCurrencyAmount(toAmount, 'curr-currency')
        }

    } else {

        if (isCurrCurrency) {
            gUserSelected.currCurrency.currencyType = currencyType
        } else {
            gUserSelected.toCurrency.currencyType = currencyType
        }
    }
}

// The function returns the
//  updated model (gUserSelected) after the conversion

function getCurrencyValue() {
    const currencyValue = { ...gUserSelected }
    return currencyValue
}

// get all names of currencies types

function getAllCurrencyType() {
    // get-- "https://openexchangerates.org/api/currencies.json"
    return {
        "AED": "United Arab Emirates Dirham",
        "AFN": "Afghan Afghani",
        "ALL": "Albanian Lek",
        "AMD": "Armenian Dram",
        "ANG": "Netherlands Antillean Guilder",
        "AOA": "Angolan Kwanza",
        "ARS": "Argentine Peso",
        "AUD": "Australian Dollar",
        "AWG": "Aruban Florin",
        "AZN": "Azerbaijani Manat",
        "BAM": "Bosnia-Herzegovina Convertible Mark",
        "BBD": "Barbadian Dollar",
        "BDT": "Bangladeshi Taka",
        "BGN": "Bulgarian Lev",
        "BHD": "Bahraini Dinar",
        "BIF": "Burundian Franc",
        "BMD": "Bermudan Dollar",
        "BND": "Brunei Dollar",
        "BOB": "Bolivian Boliviano",
        "BRL": "Brazilian Real",
        "BSD": "Bahamian Dollar",
        "BTC": "Bitcoin",
        "BTN": "Bhutanese Ngultrum",
        "BWP": "Botswanan Pula",
        "BYN": "Belarusian Ruble",
        "BZD": "Belize Dollar",
        "CAD": "Canadian Dollar",
        "CDF": "Congolese Franc",
        "CHF": "Swiss Franc",
        "CLF": "Chilean Unit of Account (UF)",
        "CLP": "Chilean Peso",
        "CNH": "Chinese Yuan (Offshore)",
        "CNY": "Chinese Yuan",
        "COP": "Colombian Peso",
        "CRC": "Costa Rican Colón",
        "CUC": "Cuban Convertible Peso",
        "CUP": "Cuban Peso",
        "CVE": "Cape Verdean Escudo",
        "CZK": "Czech Republic Koruna",
        "DJF": "Djiboutian Franc",
        "DKK": "Danish Krone",
        "DOP": "Dominican Peso",
        "DZD": "Algerian Dinar",
        "EGP": "Egyptian Pound",
        "ERN": "Eritrean Nakfa",
        "ETB": "Ethiopian Birr",
        "EUR": "Euro",
        "FJD": "Fijian Dollar",
        "FKP": "Falkland Islands Pound",
        "GBP": "British Pound Sterling",
        "GEL": "Georgian Lari",
        "GGP": "Guernsey Pound",
        "GHS": "Ghanaian Cedi",
        "GIP": "Gibraltar Pound",
        "GMD": "Gambian Dalasi",
        "GNF": "Guinean Franc",
        "GTQ": "Guatemalan Quetzal",
        "GYD": "Guyanaese Dollar",
        "HKD": "Hong Kong Dollar",
        "HNL": "Honduran Lempira",
        "HRK": "Croatian Kuna",
        "HTG": "Haitian Gourde",
        "HUF": "Hungarian Forint",
        "IDR": "Indonesian Rupiah",
        "ILS": "Israeli New Sheqel",
        "IMP": "Manx pound",
        "INR": "Indian Rupee",
        "IQD": "Iraqi Dinar",
        "IRR": "Iranian Rial",
        "ISK": "Icelandic Króna",
        "JEP": "Jersey Pound",
        "JMD": "Jamaican Dollar",
        "JOD": "Jordanian Dinar",
        "JPY": "Japanese Yen",
        "KES": "Kenyan Shilling",
        "KGS": "Kyrgystani Som",
        "KHR": "Cambodian Riel",
        "KMF": "Comorian Franc",
        "KPW": "North Korean Won",
        "KRW": "South Korean Won",
        "KWD": "Kuwaiti Dinar",
        "KYD": "Cayman Islands Dollar",
        "KZT": "Kazakhstani Tenge",
        "LAK": "Laotian Kip",
        "LBP": "Lebanese Pound",
        "LKR": "Sri Lankan Rupee",
        "LRD": "Liberian Dollar",
        "LSL": "Lesotho Loti",
        "LYD": "Libyan Dinar",
        "MAD": "Moroccan Dirham",
        "MDL": "Moldovan Leu",
        "MGA": "Malagasy Ariary",
        "MKD": "Macedonian Denar",
        "MMK": "Myanma Kyat",
        "MNT": "Mongolian Tugrik",
        "MOP": "Macanese Pataca",
        "MRU": "Mauritanian Ouguiya",
        "MUR": "Mauritian Rupee",
        "MVR": "Maldivian Rufiyaa",
        "MWK": "Malawian Kwacha",
        "MXN": "Mexican Peso",
        "MYR": "Malaysian Ringgit",
        "MZN": "Mozambican Metical",
        "NAD": "Namibian Dollar",
        "NGN": "Nigerian Naira",
        "NIO": "Nicaraguan Córdoba",
        "NOK": "Norwegian Krone",
        "NPR": "Nepalese Rupee",
        "NZD": "New Zealand Dollar",
        "OMR": "Omani Rial",
        "PAB": "Panamanian Balboa",
        "PEN": "Peruvian Nuevo Sol",
        "PGK": "Papua New Guinean Kina",
        "PHP": "Philippine Peso",
        "PKR": "Pakistani Rupee",
        "PLN": "Polish Zloty",
        "PYG": "Paraguayan Guarani",
        "QAR": "Qatari Rial",
        "RON": "Romanian Leu",
        "RSD": "Serbian Dinar",
        "RUB": "Russian Ruble",
        "RWF": "Rwandan Franc",
        "SAR": "Saudi Riyal",
        "SBD": "Solomon Islands Dollar",
        "SCR": "Seychellois Rupee",
        "SDG": "Sudanese Pound",
        "SEK": "Swedish Krona",
        "SGD": "Singapore Dollar",
        "SHP": "Saint Helena Pound",
        "SLL": "Sierra Leonean Leone",
        "SOS": "Somali Shilling",
        "SRD": "Surinamese Dollar",
        "SSP": "South Sudanese Pound",
        "STD": "São Tomé and Príncipe Dobra (pre-2018)",
        "STN": "São Tomé and Príncipe Dobra",
        "SVC": "Salvadoran Colón",
        "SYP": "Syrian Pound",
        "SZL": "Swazi Lilangeni",
        "THB": "Thai Baht",
        "TJS": "Tajikistani Somoni",
        "TMT": "Turkmenistani Manat",
        "TND": "Tunisian Dinar",
        "TOP": "Tongan Pa'anga",
        "TRY": "Turkish Lira",
        "TTD": "Trinidad and Tobago Dollar",
        "TWD": "New Taiwan Dollar",
        "TZS": "Tanzanian Shilling",
        "UAH": "Ukrainian Hryvnia",
        "UGX": "Ugandan Shilling",
        "USD": "United States Dollar",
        "UYU": "Uruguayan Peso",
        "UZS": "Uzbekistan Som",
        "VEF": "Venezuelan Bolívar Fuerte (Old)",
        "VES": "Venezuelan Bolívar Soberano",
        "VND": "Vietnamese Dong",
        "VUV": "Vanuatu Vatu",
        "WST": "Samoan Tala",
        "XAF": "CFA Franc BEAC",
        "XAG": "Silver Ounce",
        "XAU": "Gold Ounce",
        "XCD": "East Caribbean Dollar",
        "XDR": "Special Drawing Rights",
        "XOF": "CFA Franc BCEAO",
        "XPD": "Palladium Ounce",
        "XPF": "CFP Franc",
        "XPT": "Platinum Ounce",
        "YER": "Yemeni Rial",
        "ZAR": "South African Rand",
        "ZMW": "Zambian Kwacha",
        "ZWL": "Zimbabwean Dollar"
    }
}


