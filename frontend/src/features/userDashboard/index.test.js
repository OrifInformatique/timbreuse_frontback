import { workTime, formatDuration, reformatDate, displayReformatedDateBubble } from "./utils/index.utils";

test('Temps de travail réalisé', () => {
    const logs1 = [
        { id: 1, log_type: 1, time: '2026-01-21T08:00:00' },
        { id: 2, log_type: 0, time: '2026-01-21T09:45:00' },
        { id: 3, log_type: 1, time: '2026-01-21T10:00:00' },
        { id: 4, log_type: 0, time: '2026-01-21T12:00:00' },
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

    const result1 = workTime(logs1);
    const result2 = workTime(logs2);
    const result3 = workTime(logs3);
    const result4 = workTime(logs4);
    const result5 = workTime(logs5);

    expect(result1).toBe(13500000); // 3 hours and 45 minutes in milliseconds
    expect(result2).toBe(6300000); // 1 hour and 45 minutes in milliseconds
    expect(result3).toBe(6300000); // 1 hour and 45 minutes in milliseconds
    expect(result4).toBe(0); // No logs
    expect(result5).toBe("Tableau de de logs null");
});

test('Changement de format de date', () => {
    const dateString1 = 6300000;
    const dateString2 = -6300000;
    const dateString3 = 0;
    const dateString4 = null;

    const result1 = formatDuration(dateString1);
    const result2 = formatDuration(dateString2);
    const result3 = formatDuration(dateString3);
    const result4 = formatDuration(dateString4);

    expect(result1).toBe("01:45");
    expect(result2).toBe("-01:45");
    expect(result3).toBe("00:00");
    expect(result4).toBe("Durée null");
});

test('Affichage des informations dans une bulle', () => {
    const dateString1 = "2026-01-19";
    const dateString2 = "2026-01-21";
    const dateString3 = "19-01-2026";
    const dateString4 = null;

    const result1 = displayReformatedDateBubble(dateString1);
    const result2 = displayReformatedDateBubble(dateString2);
    const result3 = displayReformatedDateBubble(dateString3);
    const result4 = displayReformatedDateBubble(dateString4);

    expect(result1).toBe("lu 19.01");
    expect(result2).toBe("me 21.01");
    expect(result3).toBe("In NaN.NaN");
    expect(result4).toBe("Date nulle");
});

test('Changement de format d\'une date', () => {
    const dateToReform1 = new Date("2026-01-19");
    const dateToReform2 = new Date("2026-01-21");
    const dateToReform3 = new Date("19-01-2026");
    const dateToReform4 = null;

    const result1 = reformatDate(dateToReform1);
    const result2 = reformatDate(dateToReform2);
    const result3 = reformatDate(dateToReform3);
    const result4 = reformatDate(dateToReform4);

    expect(result1).toBe("19.01");
    expect(result2).toBe("21.01");
    expect(result3).toBe("NaN.NaN");
    expect(result4).toBe("Date is null");
});