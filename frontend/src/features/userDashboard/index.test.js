import { workTime, formatDuration, reformatDate, displayReformatedDateBubble } from "./utils";


// Tests for the function workTime
describe("workTime", () => {

    const logs1 = [
        { id: 1, log_type: 1, time: '2026-01-21T08:00:00' },
        { id: 2, log_type: 0, time: '2026-01-21T09:45:00' },
        { id: 3, log_type: 1, time: '2026-01-21T10:00:00' },
        { id: 4, log_type: 0, time: '2026-01-21T12:00:00' }
    ];
    const logs2 = [
        { id: 1, log_type: 1, time: '2026-01-21T08:00:00' },
        { id: 2, log_type: 0, time: '2026-01-21T09:45:00' },
        { id: 3, log_type: 1, time: '2026-01-21T10:00:00' }
    ];
    const logs3 = [
        { id: 1, log_type: 1, time: '2026-01-21T08:00:00' },
        { id: 2, log_type: 0, time: '2026-01-21T09:45:00' }
    ];
    const logs4 = [];
    const logs5 = null;

    test("Work time with 4 logs", () => {
        expect(workTime(logs1)).toBe(13500000);
    });
    test("Work time with 3 logs", () => {
        expect(workTime(logs2)).toBe(6300000);
    });
    test("Work time with 2 logs", () => {
        expect(workTime(logs3)).toBe(6300000);
    });
    test("Work time with no logs", () => {
        expect(workTime(logs4)).toBe(0);
    });
    test("Work time with logs null", () => {
        expect(() => workTime(logs5)).toThrow("Table of log is null");
    });
});


// Tests for the function formatDuration
describe("Changing the format of a date", () => {

    test("Changing positive millisecondes time into new format", () => {
        expect(formatDuration(6300000)).toBe("01:45");
    });
    test("Changing negative millisecondes time into new format", () => {
        expect(formatDuration(-6300000)).toBe("-01:45");
    });
    test("Changing 0 milliseconde time into new format", () => {
        expect(formatDuration(0)).toBe("00:00");
    });
    test("Changing time format null", () => {
        expect(() => formatDuration(null)).toThrow("Parameter is null");
    });
});


// Tests for the function displayReformatedDateBubble
describe("Display the info in bubble", () => {

    test("Display correct date into bubble", () => {
        expect(displayReformatedDateBubble("2026-01-19")).toBe("lu 19.01");
    });
    test("Display different correct date into bubble", () => {
        expect(displayReformatedDateBubble("2026-01-21")).toBe("me 21.01");
    });
    test("Display incorrect date into bubble", () => {
        expect(() => displayReformatedDateBubble("19-01-2026")).toThrow("The format need to be like YYYY-MM-DD");
    });
    test("Display null date into bubble", () => {
        expect(() => displayReformatedDateBubble(null)).toThrow("Date is null");
    });
});


// Tests for the function reformatDate
describe("Changing the format of a date", () => {

    test("Changing a correct date", () => {
        expect(reformatDate(new Date("2026-01-19"))).toBe("19.01");
    });
    test("Changing a correct date", () => {
        expect(reformatDate(new Date("2026-01-21"))).toBe("21.01");
    });
    test("Changing a correct date", () => {
        expect(() => reformatDate("19-01-2026")).toThrow("The parameter need to be a instance of Date");
    });
    test("Changing a correct date", () => {
        expect(() => reformatDate(null)).toThrow("Date is null");
    });
});