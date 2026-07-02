import React, { useEffect, useState } from "react";

// Obtain the variables from the props of the component:
// - titre      --> text to display
const Subtitle = ({
    sousTitre = "sous-titre"
}) => {

    return (<>
        <p className="font-bold text-2xl">{sousTitre}</p>
    </>);
}

export default Subtitle;

