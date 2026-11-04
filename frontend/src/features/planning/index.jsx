import React, { useEffect, useState } from "react";
import { Button } from "@orif-informatique/react-components-library";
import PlanningComponent from "./components/planning";
import { getPlanningData, getPlanningDefaultData } from "./dataService";

const Planning = () => {

  const [planningData, setPlanningData] = useState(null);

  useEffect(() => {
    async function loadPlanningData() {
      try {
        // getPlanningData() si c'est une modification d'un planning, getPlanningDefaultData() si c'est un nouveau planning
        
        // const data = await getPlanningDefaultData(); 
        const data = await getPlanningData();

        setPlanningData(data);
        console.log("Planning data loaded:", data);
      } catch (error) {
        console.error("Error loading planning data:", error);
      }
    }

    loadPlanningData();
  }, []);

  return (<>
    <div className="justify-items-center md:justify-center md:min-w-4xl my-10 items-center">
      <PlanningComponent 
        id={planningData?.id_planning || 1} 
        name={planningData?.userName || ""} 
        surname={planningData?.userSurname || ""}
        titlePlanning={planningData?.planningName || ""}
        startingDatePlanning={planningData?.planningDateStart || ""}
        endingDatePlanning={planningData?.planningDateEnd || ""}
        dataPlanning={planningData} />
    </div>
  </>);
}

export default Planning;
