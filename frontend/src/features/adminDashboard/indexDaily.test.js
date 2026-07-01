import { addOneDay, removeOneDay, reformatDate } from './utils';

//Tests for the function addOneDay
describe("addOneDay", () => {
    
    test("Add a day correctly", () => {
        expect(addOneDay("2026-01-19")).toBe("2026-01-20");
    });
    test("Add a day incorrectly", () => {
        expect(() => addOneDay("19-01-2026")).toThrow("The format need to be like YYYY-MM-DD");
    });
    test("Add a day but it's null", () => {
        expect(() => addOneDay(null)).toThrow("Date is null");
    });
});

//Tests for the function removeOneDay
describe("removeOneDay", () => {
    
    test("Remove a day correctly", () => {
        expect(removeOneDay("2026-01-19")).toBe("2026-01-18");
    });
    test("Remove a day incorrectly", () => {
        expect(() => removeOneDay("19-01-2026")).toThrow("The format need to be like YYYY-MM-DD");
    });
    test("Remove a day but it's null", () => {
        expect(() => removeOneDay(null)).toThrow("Date is null");
    });
});

//Tests for the function reformatDate
describe("reformatDate", () => {
    
    test("Reformate a date correctly", () => {
        expect(reformatDate(new Date("2026-01-19"))).toBe("2026-01-19");
    });
    test("Reformate a date but it's a number", () => {
        expect(() => reformatDate(10)).toThrow("The parameter need to be a instance of Date");
    });
    test("Reformate a date but it's a string", () => {
        expect(() => reformatDate("Hello")).toThrow("The parameter need to be a instance of Date");
    });
    test("Reformate a date but it's null", () => {
        expect(() => reformatDate(null)).toThrow("Date is null");
    });
});
