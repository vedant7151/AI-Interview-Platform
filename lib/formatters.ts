const DATE_FORMATTER = new Intl.DateTimeFormat(undefined,{
    dateStyle : 'medium',
    timeStyle : 'short'
})

export function formatDateTime(dateTime : Date){
    return DATE_FORMATTER.format(dateTime)
}

