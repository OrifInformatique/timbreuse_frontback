import React, { useEffect, useState } from "react";

// Récupère la variable nécessaire
// - stringDate     --> date sous format texte (Exemple : Lundi 1 janvier 2026)
const SelectDate = ({
    stringDate = "date du jour",
    decrementDate,
    incrementDate
}) => {

    return (<>
        <div className="flex flex-row items-start my-5 md:my-0">
            {/* L'intéraction pour changer de jour fonctionne de la manière suivante :
                Même si dans la vue, la date ne change pas, l'interaction effectue bien l'ajout ou l'enlèvement d'un jour de la date
                Car il n'est pas possible de modifier uniquement depuis une vue un JSON pour mettre à jour des données
                l'intéraction est faite dans le fichier dataService.js
            */}
            <button className="text-2xl pl-3 pr-3 mr-1 bg-gray-300" onClick={decrementDate}>◁</button>
            <div className="text-2xl pl-3 pr-3 bg-gray-300">{stringDate}</div>
            <button className="text-2xl pl-3 pr-3 ml-1 bg-gray-300" onClick={incrementDate}>▷</button>
        </div>
    </>);
}

export default SelectDate;

