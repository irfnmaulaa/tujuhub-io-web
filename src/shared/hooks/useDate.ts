import {useState} from "react";
import {getLocalTimeZone, parseDate} from "@internationalized/date";
import moment from "moment-timezone";
import type {DateValue} from "@heroui/react";
import useProfile from "@/modules/profile/api/useProfile.ts";

export default function useDate() {
    const profile = useProfile()
    const [timezone, setTimezone] = useState(profile.data?.timeZone || getLocalTimeZone())

    return {
        create: (date?: Date | string | null | undefined) => {
            if(!date) return moment().tz(timezone)
            return moment(date).tz(timezone)
        },
        toDateValue: (date: Date | string | null | undefined) => {
            if(!date) return parseDate(moment().format('YYYY-MM-DD'))
            return parseDate(moment(date).format('YYYY-MM-DD'))
        },
        toDateString: (date: DateValue | null) => {
            return moment(date?.toDate(timezone)).format('YYYY-MM-DD')
        },
        greeting: () => {
            const currentHour = parseInt(moment().tz(timezone).format("HH"), 10);

            if (currentHour >= 3 && currentHour < 12){
                return "Good morning";
            } else if (currentHour >= 12 && currentHour < 15){
                return "Good afternoon";
            }   else if (currentHour >= 15){
                return "Good evening";
            } else {
                return "Hi"
            }
        },
        setTimezone,
        timezone,
        getMonthName: (date: Date | string | null | undefined) => {
            if(!date) {
                return moment().subtract(1, "month").startOf("month").format('MMMM');
            }
            return moment(date).subtract(1, "month").startOf("month").format('MMMM');
        },
        getShortMonthName: (date: Date | string | null | undefined) => {
            if(!date) {
                return moment().startOf("month").format('MMM');
            }
            return moment(date).startOf("month").format('MMM');
        },
        formatDateRange: (start: Date | string, duration: string) => {
            const startDate = moment(start).tz(timezone);
            const endDate = moment(start).tz(timezone).add(duration.split(' ')[0], duration.split(' ')[1] as 'hour');

            const sameDay = startDate.isSame(endDate, 'day');
            const sameMonth = startDate.isSame(endDate, 'month');
            const sameYear = startDate.isSame(endDate, 'year');

            if (sameDay) {
                return `${startDate.format('D MMM YYYY • HH:mm')} - ${endDate.format('HH:mm')}`;
            }

            if (sameMonth && sameYear) {
                return `${startDate.format('D MMM • HH:mm')} — ${endDate.format('D MMM YYYY • HH:mm')}`;
            }

            if (sameYear) {
                return `${startDate.format('D MMM • HH:mm')} — ${endDate.format('D MMM YYYY • HH:mm')}`;
            }

            return `${startDate.format('D MMM YYYY • HH:mm')} — ${endDate.format('D MMM YYYY • HH:mm')}`;

        },
        formatDateRangeEnd: (start: Date | string, end: Date | string) => {
            const startDate = moment(start).tz(timezone);
            const endDate = moment(end).tz(timezone);

            const sameDay = startDate.isSame(endDate, 'day');
            const sameMonth = startDate.isSame(endDate, 'month');
            const sameYear = startDate.isSame(endDate, 'year');

            if (sameDay) {
                return `${startDate.format('D MMM YYYY • HH:mm')} - ${endDate.format('HH:mm')}`;
            }

            if (sameMonth && sameYear) {
                return `${startDate.format('D MMM • HH:mm')} — ${endDate.format('D MMM YYYY • HH:mm')}`;
            }

            if (sameYear) {
                return `${startDate.format('D MMM • HH:mm')} — ${endDate.format('D MMM YYYY • HH:mm')}`;
            }

            return `${startDate.format('D MMM YYYY • HH:mm')} — ${endDate.format('D MMM YYYY • HH:mm')}`;

        }
    }
}