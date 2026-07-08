import React, { useEffect, useState } from "react";
import { Button } from "@orif-informatique/react-components-library";
import PlanningComponent from "./components/planning";
import { getPlanningData } from "./dataService";

const Planning = () => {

  const [planningData, setPlanningData] = useState(null);

  useEffect(() => {
    async function loadPlanningData() {
      try {
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
      <PlanningComponent id={1} name="Ethan" surname="Ummel" dataPlanning={planningData} />
    </div>
  </>);
}

export default Planning;
