import React, { useState, useEffect } from "react";
import { Icon } from "@orif-informatique/react-components-library"
// - dateMode     --> le mode d'affichage de la date (jour, semaine, mois, année)

const SelectDate = ({ 
    dateString, 
    funcArrowLeft, 
    funcArrowRight,
    dateMode, 
}) => {



    return (<>

        <div className="flex flex-row p-2">
            <button className="border-1 border-color-black h-lg p-4" onClick={funcArrowLeft}>
                <Icon name="chevron-double-left" size="10"/>
            </button>
            
            <div className="border-1 border-color-black basis-1/4 p-4 h-lg text-center text-xl">{dateString}</div>
                
            <button className="border-1 border-color-black h-lg p-4" onClick={funcArrowRight}>
                <Icon name="chevron-double-right" size="10"/>
            </button>
        </div>

    
    
    </>);
}

export default SelectDate;