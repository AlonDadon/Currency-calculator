'use strict'

const dateService = {
    getFormattedDate,
    isFromLastMonth
}

// isFromLastMonth(1723539701821 - 2992000000)
// isFromLastMonth(1723539701821)

function isFromLastMonth(timestamp) {
    var todayDate = Date.now()
    const month = 1000 * 60 * 60 * 24 * 30
    return (timestamp > todayDate - month);
}

function isFromLastDay(timestamp) {
    var todayDate = Date.now()
    const day = 1000 * 60 * 60 * 24
    return (timestamp > todayDate - day);
}

function isFromLastHour(timestamp) {
    var todayDate = Date.now()
    const hour = 1000 * 60 * 60
    return (timestamp > todayDate - hour);
}

function isFromLastMinute(timestamp) {
    var todayDate = Date.now()
    const minute = 1000 * 60
    return (timestamp > todayDate - minute);
}

function getFormattedDate(timestamp) {
    // const timestamp = 1723535248827;
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString();
    // console.log(formattedDate);
    return formattedDate
    // console.log(formattedDate);

}