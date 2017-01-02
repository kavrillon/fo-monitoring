import moment from 'moment';

export default class DateUtils {

    static getDateOfISOWeek(w, y, d = 0) {
        const simple = new Date(y, 0, 1 + (w - 1) * 7);
        const dow = simple.getDay();

        if (dow <= 4) {
            simple.setDate(simple.getDate() - dow + 1);
        } else {
            simple.setDate(simple.getDate() + 8 - dow);
        }

        if (d > 0) {
            simple.setDate(simple.getDate() + 5);
        }
        return simple;
    }

    static pointsToDays(points, round = 1, withUnit = false) {
        let value = Math.round(points * round / 2) / round;

        if (withUnit) {
            if (value > 1) {
                value = value + ' days';
            } else {
                value = value + ' day';
            }
        }

        return value;
    }

    /**
     * Get the month key (0 .. 11) value from a start date.
     * As the parameter given is the monday of the week, we'll admit an small error if the week in between two month
     * eg. if the startDate is the Monday 31/10/16:
     * as only the Monday is in October, the month returned will be November
     * For our calculation, we return the month of the Wednesday
     * @param week
     */
    static getMonthKeyFromStartDate(week) {
        const startDate = moment(week).add(2, 'days'); // We take the wednesday (middle of the week)
        return parseInt(moment(startDate).format('M')) - 1; // We take the month of this date
    }
}
