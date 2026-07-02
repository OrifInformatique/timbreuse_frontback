import React, { useEffect, useState } from "react";

// Obtain the variables from the props of the component:
// - dailyHourNeeded --> hour of work requested for the day (format hh:mm)
// - dailyLogs --> List of the user's logs (used to calculate the hours of work already done)
const TableDailyHour = ({
    dailyHourNeeded = "08:12",
    dailyLogs = []
}) => {

    const calculWorkTime = (dailyLogs) => {
        // Convert the string "HH:mm" to a number (minutes)
        const toMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        // Create a date to get the current time
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let totalMinutes = 0;

        // Check the entries/exits of the log list to determine if the user is on break or not
        // --> This allows to choose whether to calculate only with the log hours or with the current time
        for (let i = 0; i < dailyLogs.length; i++) {
            const current = dailyLogs[i];
            const next = dailyLogs[i + 1];

            if (current.typeLog === 1) {
                const start = toMinutes(current.hour);

                if (next && next.typeLog === 0) {
                    const end = toMinutes(next.hour);
                    totalMinutes += end - start;
                    i++;
                } else {
                    totalMinutes += currentMinutes - start;
                }
            }
        }

        // Convert the numbers to minutes and hours
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Return the hour of work done as a string
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    return(<>
        <table className="w-full">
            <tbody className="divide-y-1 divide-black-400">
                <tr>
                    <th scope="row" className="text-left px-3 py-2">Temps exigé du jour</th>
                    <td className="text-right px-3">{dailyHourNeeded}</td>
                </tr>
                <tr>
                    <th scope="row" className="text-left px-3 py-2">Temps de travail</th>
                    <td className="text-right px-3">{calculWorkTime(dailyLogs)}</td>
                </tr>
            </tbody>
        </table>    
    </>);
}

export default TableDailyHour;