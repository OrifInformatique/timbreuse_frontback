import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@orif-informatique/react-components-library";

// Récupère les variables nécessaires :
// - id         --> id de l'utilisateur
// - surname    --> nom de l'utilisateur
// - name       --> prénom de l'utilisateur
// - presence   --> si l'utilisateur est présent ou non ('0' pour présent, '1' pour absent)
// - reason     --> La raison si l'utilisateur est absent (utilisé si l'utilisateur est absent et que le champs n'est pas vide)

// Renommer en PresenceTableLine
const TableLigne = ({
    id = 0,
    surname = "nom",
    name = "prénom",
    presence = null,
    reason = ""
}) => {

    let content;
    let edit = <><Icon name="meatballs" size="8"></Icon></>

    if (presence === 0) {
        content = <>
            <Icon color="primary" name="check" size="8"></Icon>
        </>
    } else if (presence === 1 && reason === "") {
        content = <>
            <Icon color="danger" name="cross" size="8"></Icon>
        </>
    } else if (presence === 1 && reason !== "") {
        content = <>
            <Icon color="primary" name="history" size="8"></Icon>
        </>
    }

    return (<>

        <div className="flex flex-row">
            <td className="py-4 font-bold text-lg">
                {content}
            </td>
            <td className="py-4 font-bold text-lg">
                {name} {surname}
            </td>
            <Link to={`/admin-dashboard-student/${id}`} className="p-4 text-right">
                {edit}
            </Link>
        </div>

        {/*
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
        */}
    </>);
}

export default TableLigne;

