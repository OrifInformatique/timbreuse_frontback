import React, { useEffect, useState } from "react";

// Obtain the variables from the props of the component:
// - titre      --> text to display
const Title = ({
    titre = "titre"
}) => {

    return (<>
        <p className="font-bold text-3xl md:mb-0 md:mr-10">{titre}</p>
    </>);
}

export default Title;

