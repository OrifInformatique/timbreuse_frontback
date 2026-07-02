import React, { useEffect, useState } from "react";

// Obtain the variables from the props of the component:
// - textDate     --> date in text format
// - state        --> state of the bubble (1 for gray, 2 for orange, 3 for red)
// - textTime     --> time in text format
const infoBubble = ({
    textDate,
    state = 1,
    textTime
}) => {

    if (state === 1) {
        return (<>
            <li className="py-3 px-5 m-3 border-2 border-gray-400 bg-gray-300 rounded-4xl"><div>{textDate}<br/>{textTime}</div></li>
        </>);

    } else if (state === 2) {
        return (<>
            <li className="py-3 px-5 m-3 border-2 border-orange-400 bg-orange-300 rounded-4xl"><div>{textDate}<br/>{textTime}</div></li>
        </>);

    } else  {
        return (<>
            <li className="py-3 px-5 m-3 border-2 border-gray-400 bg-gray-300 rounded-4xl"><div>{textDate}<br/>{textTime}</div></li>
        </>);
    }    
}

export default infoBubble;
