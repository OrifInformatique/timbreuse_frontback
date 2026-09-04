import React, { useEffect, useState } from "react";
import { Icon } from "@orif-informatique/react-components-library";

// Récupère les variables nécessaires 
// - studentPresence        --> 0 si présent, 1 si absent
// - studentReason          --> Motif de l'absence
const LabelPresence = ({
    studentPresence = 0,
    studentReason = ""
}) => {

    let icon;
    let state;
    
    if (studentPresence === 0) {
        state = 1
        icon = <>
            <Icon color="primary" name="check" size="8"></Icon>
            <div>Présent</div>
        </>
    } else if (studentPresence === 1 && studentReason === "") {
        state = 1
        icon = <>
            <Icon color="danger" name="cross" size="8"></Icon>
            <div>Absent</div>
        </>
    } else if (studentPresence === 1 && studentReason !== "") {
        state = 2
        icon = <>
            <Icon color="primary" name="history" size="8"></Icon>
            <div>Excusé</div>
        </>
    }

    return (<>

        <div className={state === 1 ? "flex flex-row md:max-w-1/4 w-1/2 md:min-w-1/8 h-35 mx-5 justify-center md:p-3 border border-black-400" : state === 2 ? "flex flex-col md:max-w-1/4 w-1/2 md:min-w-1/8 h-35 mx-5 items-center md:p-3 border border-black-400" : ""}>
            <div className={
                    studentPresence === 0 ? "flex text-green-500 text-2xl my-2 font-bold items-center" : 
                        studentPresence === 1 && studentReason === "" ? "flex text-red-500 text-2xl my-2 font-bold items-center" :
                            studentPresence === 1 && studentReason !== "" ? "flex text-orange-500 text-2xl my-2 font-bold items-center" : ""}
            >
                {icon}
            </div>
            
            {studentReason !== "" ? 
                <div className="h-full max-h-30 p-2 flex text-center items-center">
                    {studentReason}
                </div>
            : ""}
        </div>
    </>);
}

export default LabelPresence;

