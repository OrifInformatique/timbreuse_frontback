import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Récupère les variables nécessaires :
// - id         --> id de l'utilisateur
// - surname    --> nom de l'utilisateur
// - name       --> prénom de l'utilisateur
// - errorFound --> Si une erreur à été détectée sur le profil de l'utilisateur ('0' pour aucune erreur, '1' pour une erreur) --> Fournie par le backend
// - workTime   --> La balance de l'utilisateur
const TableLigneResumeLog = ({
    id = 0,
    surname = "nom",
    name = "prénom",
    errorFound = 0,
    workTime = ""
}) => {

    return (<>
        <td className="p-2">
            {errorFound === 0 ? "✅" : "⚠️"}
        </td>
        <td className="p-2 font-bold text-center">
            {name} {surname}
        </td>
        <td className={workTime.startsWith("+") ? "p-2 text-green-500" : "p-2 text-red-500"}>
            {workTime}
        </td>
        <td>
            <Link to={`/admin-dashboard-student-error/${id}`}>
                ✏️
            </Link>
        </td>
    </>);
}

export default TableLigneResumeLog;

