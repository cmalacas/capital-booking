export const formatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
});

export const format_date = (date) => {

    if ( date === '0000-00-00') return date;

    const str = date.split('-');

    const year = str[0];
    const month = str[1];
    const day = str[2];

    const months = {
        '01' : 'Jan',
        '02' : 'Feb',
        '03' : 'Mar',
        '04' : 'Apr',
        '05' : 'May',
        '06' : 'Jun',
        '07' : 'Jul',
        '08' : 'Aug',
        '09' : 'Sep',
        '10' : 'Oct',
        '11' : 'Nov',
        '12' : 'Dec'
    }

    return `${day}-${months[month]}-${year}`

}

export const format_datetime = (datetime, dateOnly = false) => {

    let date = [];

    if (datetime) {

        if (datetime.indexOf('T') >= 1) {

            date = datetime.split('T');

        } else {

            date = datetime.split(' ');

        }

        const str = date[0].split('-');

        const time = date[1] ? date[1].split(':') : ['00', '00'];
        
        let am = 'AM';

        const year = str[0];
        const month = str[1];
        const day = str[2];

        let hr = time[0];
        let min = time[1];

        if (parseInt(hr) > 12) {

            am = 'PM';

            hr = parseInt(hr) - 12;

            if (hr < 10) {

                hr = `0${hr}`;
            }

        }

        const months = {
            '00' : '00',
            '01' : 'Jan',
            '02' : 'Feb',
            '03' : 'Mar',
            '04' : 'Apr',
            '05' : 'May',
            '06' : 'Jun',
            '07' : 'Jul',
            '08' : 'Aug',
            '09' : 'Sep',
            '10' : 'Oct',
            '11' : 'Nov',
            '12' : 'Dec'
        }

        if (dateOnly) {

            return `${day}-${months[month]}-${year}`

        } else {

            return `${day}-${months[month]}-${year} ${hr}:${min} ${am}`

        }

    } else {

        return 'Not Specified'

    }

}