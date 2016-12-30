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
}
