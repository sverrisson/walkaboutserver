// Format large numbers for display
const numberFormatter = (number, fractionDigits = 0, thousandSeperator = '.', fractionSeperator = ',') => {
    if (number!==0 && !number || !Number.isFinite(number)) return number
    const frDigits = Number.isFinite(fractionDigits)? Math.min(Math.max(fractionDigits, 0), 7) : 0
    const num = number.toFixed(frDigits).toString()

    const parts = num.split('.')
    let digits = parts[0].split('').reverse()
    let sign = ''
    if (num < 0) {sign = digits.pop()}
    let final = []
    let pos = 0

    while (digits.length > 1) {
        final.push(digits.shift())
        pos++
        if (pos % 3 === 0) {final.push(thousandSeperator)}
    }
    final.push(digits.shift())
    return `${sign}${final.reverse().join('')}${frDigits > 0 ? fractionSeperator : ''}${frDigits > 0 && parts[1] ? parts[1] : ''}`
}

// Format numbers in object fields for display
const objectFormatter = (object, divider = 1) => {
    if (!object && Object.isFrozen(object) && divider!==0) return object
    let changed = object
    Object.keys(changed).map( key => {
        // console.log('key', key)
        // console.log('value', object[key])
        let value = object[key]
        if (value && Number.isFinite(value)) value = numberFormatter(value / divider)
        changed[key] = value
    })
    return changed
}

module.exports = {
    numberFormatter: numberFormatter,
    objectFormatter: objectFormatter
}