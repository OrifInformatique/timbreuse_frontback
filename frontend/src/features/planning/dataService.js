import axios from 'axios';

let pathJSON = "/data/mock-data-planning.json";
let pathJSONdefault = "/data/mock-data-planning-default.json";


export const getPlanningData = async () => {
    try {
        const response = await axios.get(pathJSON);
        return response.data;
    } catch (error) {
        console.error("Error fetching planning data:", error);
        throw error;
    }
};

export const getPlanningDefaultData = async () => {
    try {
        const response = await axios.get(pathJSONdefault);
        return response.data;
    } catch (error) {
        console.error("Error fetching planning data:", error);
        throw error;
    }
};