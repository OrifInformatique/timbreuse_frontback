import React, { useEffect, useState } from "react";

// Récupère les variables nécessaires 
// - titre      --> text à afficher
const Subtitle = ({
    sousTitre = "sous-titre"
}) => {

    return (<>
        <p className="font-bold text-2xl">{sousTitre}</p>
    </>);
}

export default Subtitle;

