import React, { useState, useEffect } from "react";
import { Icon } from "@orif-informatique/react-components-library"
// - dateMode     --> le mode d'affichage de la date (jour, semaine, mois, année)

const SelectDate = ({ 
    dateString, 
    funcArrowLeft, 
    funcArrowRight,
    dateMode, 
}) => {

    function formatDate(date, type) {

        const [year, month, day] = date.split("-").map(Number);
        const currentDate = new Date(year, month-1, day);
        const pad = (number) => String(number).padStart(2, "0");
        const formatFullDate = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
        const formatShortDate = (date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${String(date.getFullYear()).slice(-2)}`;

        switch(type) {
            case "day":
                return formatFullDate(currentDate);

            case "week": {
                const dayOfWeek = currentDate.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

                const monday = new Date(currentDate);
                monday.setDate(currentDate.getDate() + diff);

                const friday = new Date(monday);
                friday.setDate(monday.getDate() + 4);

                return `${formatShortDate(monday)} - ${formatShortDate(friday)}`;
            }

            case "month": {
                const monthLabel = currentDate.toLocaleDateString("fr-CH", {
                    month: "long",
                    year: "numeric",
                });

                return monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
            }

            case "year":
                return String(currentDate.getFullYear());

            default:
                return formatFullDate(currentDate);
        }
    }

    return (<>

        <div className="flex flex-row p-2">
            <button 
                type="button"
                className="border-1 border-color-black h-lg p-4" 
                onClick={funcArrowLeft}
                aria-label="Période précédente"
            >
                <Icon name="chevron-double-left" size="10"/>
            </button>
            
            <div className="border-1 border-color-black basis-1/4 p-4 h-lg text-center text-xl">
                {formatDate(dateString, dateMode)}
            </div>
                
            <button 
                type="button"
                className="border-1 border-color-black h-lg p-4" 
                onClick={funcArrowRight}
                aria-label="Période suivante"
            >
                <Icon name="chevron-double-right" size="10"/>
            </button>
        </div>
    </>);
}

export default SelectDate;