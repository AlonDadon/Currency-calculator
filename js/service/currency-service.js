'use strict'

const gCurrency = loadFromStorage('currency') || {}

const API_KEY = '4e4483bb1e61b841cf598fe5'

const gUserSelected = {
    inputNames: ['curr-currency', 'to-currency'],
    selectedInputName: 'curr-currency',
    currCurrency: {
        amount: 1,
        currencyType: 'EUR'
    },
    toCurrency: {
        amount: 4.19,
        currencyType: 'ILS'
    }
}

// An object that contains all the exported functions

const currencyService = {
    updateCurrencyAmount,
    getAllCurrencyType,
    getCurrencyValue,
    updateSelectedInputName,
    updateCurrencyType,
    getInputNames
}

// The function returns the names of the inputs

function getInputNames() {
    return gUserSelected.inputNames
}

// The function updates the model on which input the user is now

function updateSelectedInputName(inputName) {
    gUserSelected.selectedInputName = inputName
    console.log('gUserSelected.selectedInputName', gUserSelected.selectedInputName);

}

//  The function sends a request to the server and receives
//  the current currency value and
//  then updates the global variables(gCurrency,gUserSelected)

function convertCurrency(currCurrency, toCurrency, amount) {
    console.log('currCurrency', currCurrency);
    console.log('toCurrency', toCurrency);
    console.log('amount', amount);
    // example of object from the api
    const prmData = {
        "result": "success",
        "documentation": "https://www.exchangerate-api.com/docs",
        "terms_of_use": "https://www.exchangerate-api.com/terms",
        "time_last_update_unix": 1722816001,
        "time_last_update_utc": "Mon, 05 Aug 2024 00:00:01 +0000",
        "time_next_update_unix": 1722902401,
        "time_next_update_utc": "Tue, 06 Aug 2024 00:00:01 +0000",
        "base_code": "EUR",
        "target_code": "ILS",
        "conversion_rate": 4.1431,
        "conversion_result": 8.2862
    }
    // return
    // const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${currCurrency}/${toCurrency}/${amount}`
    // const prm = axios.get(url)
    // const currencyConvert = prm.data
    // console.log(currencyConvert)

    // axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/EUR/ILS/1`)
    // return axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/
    //                 pair/${currCurrency}/${toCurrency}/${amount}`)
}


// The function updates the model with 
// the amount of coins according to the user's choice or 
// according to the current value of the coin

function updateCurrencyAmount(coinsAmount, inputName) {
    const currNum = parseInt(coinsAmount)
    if (currNum !== typeof "number" && isNaN(currNum) && !currNum) return
    if (inputName === 'curr-currency') {
        gUserSelected.currCurrency.amount = currNum
    } else {
        gUserSelected.toCurrency.amount = currNum
    }
}

// The function updates the model with
// the type of currency the user has selected
function updateCurrencyType(currencyType, selectName) {
    if (selectName === 'curr-currency') {
        gUserSelected.currCurrency.currencyType = currencyType
    } else {
        gUserSelected.toCurrency.currencyType = currencyType
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


