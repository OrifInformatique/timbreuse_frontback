import React, { useEffect, useState } from "react";

// Récupère les variables nécessaires 
// - studentPresence        --> 0 si présent, 1 si absent
// - studentReason          --> Motif de l'absence
const LabelPresence = ({
    studentPresence = 0,
    studentReason = ""
}) => {

    return (<>
        <div className="flex flex-row md:max-w-1/4 w-1/2 md:min-w-1/8 h-30 mx-5 justify-center md:p-3 border border-black-400">
                <div className={
                    studentPresence === 0 ? "flex text-green-500 text-2xl font-bold items-center" : 
                        studentPresence === 1 && studentReason === "" ? "flex text-red-500 text-2xl font-bold items-center" :
                            studentPresence === 1 && studentReason !== "" ? "flex text-orange-500 text-2xl font-bold items-center" : ""}>
                    
                    {studentPresence === 0 ? "✅ Présent" : 
                        studentPresence === 1 && studentReason === "" ? "‼️ Absent" :
                            studentPresence === 1 && studentReason !== "" ? "👍 Excusé" : ""}
                </div>
            </div>
    </>);
}

export default LabelPresence;

