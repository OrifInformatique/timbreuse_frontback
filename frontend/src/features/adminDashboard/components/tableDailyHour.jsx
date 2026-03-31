import React, { useEffect, useState } from "react";

// Récupère les variables nécessaires :
// - dailyHourNeeded --> heure de travail demandé dans la journée (format hh:mm)
// - dailyLogs --> Liste des logs de l'utilisateur (permet de calculer les heures de travail déjà réalisée)
const TableDailyHour = ({
    dailyHourNeeded = "08:12",
    dailyLogs = []
}) => {

    const calculWorkTime = (dailyLogs) => {
        // Permet de convertir le string "HH:mm" en nombre (minutes)
        const toMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        // Créer une date pour avoir l'heure actuelle
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let totalMinutes = 0;

        // Vérifie les entrées/sorties de la liste des logs afin de déterminer si l'utilisateur est en pause ou non 
        // --> Cela permet de choisir s'il doit calculer seulement avec les heures des logs ou avec l'heure actuelle
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

        // Convertit les nombres en minutes et heures
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        // Retourne l'heure de travail réalisée en chaîne de charactères 
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