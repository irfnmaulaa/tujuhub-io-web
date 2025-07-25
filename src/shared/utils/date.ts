import moment from "moment";
import {getLocalTimeZone, parseAbsolute} from "@internationalized/date";
import useDate from "@/shared/hooks/useDate.ts";

export function generateDatesGroupedByWeek(year: number|string, month: number|string) {
    const startOfMonth = moment(`${year}-${parseInt(month + '', 10)<10?'0':''}${month}-01`);
    const endOfMonth = startOfMonth.clone().endOf('month');
    const weeks = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

    let currentWeek = Array(7).fill(null); // Initialize an array for the week with nulls
    const currentDate = startOfMonth.clone();

    while (currentDate.isBefore(endOfMonth) || currentDate.isSame(endOfMonth, 'day')) {
        const dayIndex = currentDate.day(); // Get the index of the day (0 = Sunday, 1 = Monday, etc.)
        currentWeek[dayIndex] = currentDate.format('YYYY-MM-DD'); // Assign the date to the correct index

        // Move to the next day
        currentDate.add(1, 'days');

        // Check if the current date is the start of a new week (Sunday)
        if (currentDate.day() === 0 || currentDate.isAfter(endOfMonth)) {
            weeks.push(currentWeek); // Push the current week to the weeks array
            currentWeek = Array(7).fill(null); // Reset for the next week
        }
    }

    // Fill in any remaining nulls with empty strings for days without dates
    weeks.forEach(week => {
        for (let i = 0; i < 7; i++) {
            if (week[i] === null) {
                week[i] = ''; // Replace null with an empty string
            }
        }
    });

    return {
        daysOfWeek: daysOfWeek,
        weeks: weeks
    };
}

export function formatDateAsOrdinalDay(date : string) {
    const momentDate = moment(date);

    // Get the day name
    const dayName = momentDate.format('dddd');

    // Calculate which occurrence of this day in the month
    const firstDayOfMonth = moment(momentDate).startOf('month');
    const dayOfWeek = momentDate.day();
    const occurrenceInMonth = Math.ceil((momentDate.date() - dayOfWeek + firstDayOfMonth.day()) / 7);

    // Function to get ordinal word
    const getOrdinalWord = (n: number) => {
        const words = ["1st", "2nd", "3rd", "4th", "5th"];
        return words[n - 1] || `${n}th`;
    };

    return `${getOrdinalWord(occurrenceInMonth)} ${dayName.toLowerCase()}`;
}

export function dateValue({ date, timezone }: {
    date: Date | string | null | undefined;
    timezone?: string | null | undefined;
}) {
    return parseAbsolute(moment(date || '').format('YYYY-MM-DD'), timezone || getLocalTimeZone())
}

export function useDateRangeTemplates() {
    const date = useDate()

    return [
        {
            label: 'This Month',
            start: date.create().startOf('month').format('YYYY-MM-DD'),
            end: date.create().endOf('month').format('YYYY-MM-DD'),
        },
        {
            label: 'Last Month',
            start: date.create().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            end: date.create().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        },
        {
            label: 'Last 30 Day',
            start: date.create().subtract(30, 'day').format('YYYY-MM-DD'),
            end: date.create().format('YYYY-MM-DD'),
        },
        {
            label: 'This Week',
            start: date.create().startOf('week').format('YYYY-MM-DD'),
            end: date.create().endOf('week').format('YYYY-MM-DD'),
        },
        {
            label: 'Last Week',
            start: date.create().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
            end: date.create().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
        },
        {
            label: 'Last 7 Day',
            start: date.create().subtract(7, 'day').format('YYYY-MM-DD'),
            end: date.create().format('YYYY-MM-DD'),
        },
    ]
}