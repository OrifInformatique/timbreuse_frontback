import React, { useEffect, useState } from "react";

// Récupère la variable nécessaire
// - stringDate     --> date sous format texte (Exemple : Lundi 1 janvier 2026)
const SelectDate = ({
    stringDate = "date du jour"
}) => {

    return (<>
        <div className="flex flex-row items-start my-5 md:my-0">
            <div className="text-2xl pl-3 pr-3 mr-1 bg-gray-300">◁</div>
            <div className="text-2xl pl-3 pr-3 bg-gray-300">{stringDate}</div>
            <div className="text-2xl pl-3 pr-3 ml-1 bg-gray-300">▷</div>
        </div>
    </>);
}

export default SelectDate;

