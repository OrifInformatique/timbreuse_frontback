
// Add a day in the variable in parameter ("YYYY-MM-DD" format)
export function addOneDay(dateString) {

    if (dateString === null) {
        throw new Error("Date is null");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("The format need to be like YYYY-MM-DD");
    }

    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    return reformatDate(date);
}

// Remove a day in the variable in parameter ("YYYY-MM-DD" format)
export function removeOneDay(dateString) {

    if (dateString === null) {
        throw new Error("Date is null");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("The format need to be like YYYY-MM-DD");
    }

    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);

    return reformatDate(date);
}


// Reformate a Date variable (dateToReform) into a format YYYY-MM-DD
export function reformatDate(dateToReform) {

    if (dateToReform === null) {
        throw new Error("Date is null");
    } else if (!(dateToReform instanceof Date)) {
        throw new Error("The parameter need to be a instance of Date");
    }
    const year = dateToReform.getFullYear();
    const month = String(dateToReform.getMonth() + 1).padStart(2, "0");
    const day = String(dateToReform.getDate()).padStart(2, "0");
    const dateFormated = `${year}-${month}-${day}`;

    return dateFormated;
}