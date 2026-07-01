
// Get the work time already done by taking the logs from the table in parameter and extract the time of the logs
export function workTime(logs) {
    const duration = [];

    if (logs === null) {
        throw new Error("Table of log is null");
    }

    // Take the two first logs and stock them
    for (let i = 0; i < logs.length - 1; i++) {
        const startTime = logs[i];
        const endTime = logs[i+1];

        // If there're 1 entry log (1) and 1 exit log (0), them substract them to obtain the time of work done
        if (startTime.log_type === 1 && endTime.log_type === 0) {
            const start = new Date(startTime.time);
            const end = new Date(endTime.time);

            const diff = end-start;
            duration.push(diff);
        }
    }

    // Add all the time stock in duration
    return duration.reduce((acc, currentVal) => acc + currentVal, 0);
}

// Convert the time in parameter (assumed to be in millisecondes) and convert it in format "HH:MM"
export function formatDuration(time) {
    let isTimeNegative = false;

    if (time === null) {
        throw new Error("Parameter is null");
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

// transform the variable in parameter (assumed to be "YYYY-MM-DD") into a new format. Example : 2026-01-19 ---> lu 19.01
export function displayReformatedDateBubble(dateString) {

    if (dateString === null) {
        throw new Error("date is null");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("The format need to be like YYYY-MM-DD");
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

// Transform the variable in parameter (assumed to be a varaible the type Date) into a format "DD.MM" in numeric
export function reformatDate(dateToReform) {

    if (dateToReform === null) {
        throw new Error("Date is null");
    } else if (!(dateToReform instanceof Date)) {
        throw new Error("The parameter need to be a instance of Date");
    }
    const month = String(dateToReform.getMonth() + 1).padStart(2, "0");
    const day = String(dateToReform.getDate()).padStart(2, "0");
    const dateFormated = `${day}.${month}`;
  
    return dateFormated;
}