


export function workTime(logs) {
    const duration = [];

    if (logs === null) {
        return "Tableau de de logs null";
    }

    for (let i = 0; i < logs.length - 1; i++) {
        const startTime = logs[i];
        const endTime = logs[i+1];

        if (startTime.log_type === 1 && endTime.log_type === 0) {
            const start = new Date(startTime.time);
            const end = new Date(endTime.time);

            const diff = end-start;
            duration.push(diff);
        }
    }

    return duration.reduce((acc, currentVal) => acc + currentVal, 0);
}

export function formatDuration(time) {
    let isTimeNegative = false;


    if (time === null) {
        return "Durée null";
    } else if (time < 0) {
        time *= -1;
        isTimeNegative = true;
    }

    time /= 3600000;

    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const HH = String(hours).padStart(2, "0");
    const MM = String(minutes).padStart(2, "0");

    if (isTimeNegative)
        return `-${HH}:${MM}`;  
    else
        return `${HH}:${MM}`;
}

export function displayReformatedDateBubble(dateString) {

    if (dateString === null) {
        return "Date nulle";
    }
    const date = new Date(dateString).toLocaleDateString("ch-CH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric" 
    });

    const dayCut = date.slice(0, 2);
    const formatDateNumeric = reformatDate(new Date(date));
    const dateToDisplay = `${dayCut} ${formatDateNumeric}`;

    return dateToDisplay;
}

export function reformatDate(dateToReform) {

    if (dateToReform === null) {
        return "Date is null";
    }
    const month = String(dateToReform.getMonth() + 1).padStart(2, "0");
    const day = String(dateToReform.getDate()).padStart(2, "0");
    const dateFormated = `${day}.${month}`;
  
    return dateFormated;
}