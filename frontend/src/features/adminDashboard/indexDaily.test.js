import { addOneDay, removeOneDay, reformatDate } from './utils';


test('Fonction ajoute un jour', () => {

    expect(addOneDay("2026-01-19")).toBe("2026-01-20");
    expect(() => addOneDay("19-01-2026")).toThrow("Le format doit être AAAA-MM-JJ");
    expect(() => addOneDay(null)).toThrow("Date is null");

});

test('Fonction retire un jour', () => {

    expect(removeOneDay("2026-01-19")).toBe("2026-01-18");
    expect(() => removeOneDay("19-01-2026")).toThrow("Le format doit être AAAA-MM-JJ");
    expect(() => removeOneDay(null)).toThrow("Date is null");

});

test('Fonction change le format d\'une date', () => {

    expect(reformatDate(new Date("2026-01-19"))).toBe("2026-01-19");
    expect(() => reformatDate(null)).toThrow("Date is null");
    expect(() => reformatDate(10)).toThrow("Le paramètre doit être une instance de Date");
    expect(() => reformatDate("Salut")).toThrow("Le paramètre doit être une instance de Date");

});
