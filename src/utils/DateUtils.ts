import moment from "moment";

export class DateUtils {
    static dateToString(date: Date, format: string) {
        return moment(date).format(format);
    }

    static now(format: string) {
        return moment(new Date()).format(format);
    }

    static dow(date: string) {
        return moment(date).format("dddd").toLowerCase();
    }
}
