

export function addOneDay(dateString) {

    if (dateString === null) {
        throw new Error("Date is null");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("Le format doit être AAAA-MM-JJ");
    }

    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    return reformatDate(date);
}

export function removeOneDay(dateString) {

    if (dateString === null) {
        throw new Error("Date is null");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error("Le format doit être AAAA-MM-JJ");
    }

    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);

    return reformatDate(date);
}


// TODO : retourner une erreur au lieu d'une string
export function reformatDate(dateToReform) {

    if (dateToReform === null) {
        throw new Error("Date is null");
    } else if (!(dateToReform instanceof Date)) {
        throw new Error("Le paramètre doit être une instance de Date");
    }
    const year = dateToReform.getFullYear();
    const month = String(dateToReform.getMonth() + 1).padStart(2, "0");
    const day = String(dateToReform.getDate()).padStart(2, "0");
    const dateFormated = `${year}-${month}-${day}`;

    return dateFormated;
}