import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const TableLigne = ({
    id = 0,
    surname = "nom",
    name = "prénom",
    presence = null,
    reason = ""
}) => {

    return (<>
        <div className="flex flex-row">
            <td className="py-4 font-bold text-lg">
                {presence === 0 ? "✅" + name + " " + surname : 
                    presence === 1 && reason === "" ? "‼️" + name + " " + surname : 
                        presence === 1 && reason !== "" ? "⚠️" + name + " " + surname : ""}
            </td>
            <Link to={`/admin-dashboard-student/${id}`} className="p-4 text-right">
                <a>🪪</a>
            </Link>
        </div>
    </>);
}

export default TableLigne;

