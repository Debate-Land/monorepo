var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

var units: {[key: string]: number} = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: 24 * 60 * 60 * 1000 * 365 / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
}

var getRelativeTime = (d1: any, d2: any = new Date()) => {
    var elapsed = d1 - d2
    for (var u in units)
        if (Math.abs(elapsed) > units[u] || u == 'second')
            return rtf
                .format(Math.round(elapsed / units[u]), u as any)
                .replace(' ago', '')
                .replace(' minutes', 'min')
                .replace(' minute', 'min')
                .replace(' hours', 'h')
                .replace(' hour', 'h')
                .replace('yesterday', '1d')
                .replace(' days', 'd')
                .replace('last week', '1w')
                .replace(' weeks', 'w')
                .replace('last month', '1m')
                .replace(' months', 'm')
                .replace('last year', '1yr')
                .replace(' years', 'yr')

    return 'Now'
}

export default getRelativeTime;
