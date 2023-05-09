
const calendar = new Calendar({
    appendTo           : targetElement,
    sidebar            : false,
    hideNonWorkingDays : true,
    mode               : 'week',
    // Setup data transport
    crudManager : {
        loadUrl  : '/data/calendar-data.json',
        autoLoad : true
    }
});