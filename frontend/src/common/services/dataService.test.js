import { getAdminData, getUserData, getUserAdminData } from "./dataService";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
    jest.clearAllMocks();
});

const dateValide = "2026-01-19";
const dateInvalide = "19-01-2026";
const idValide =  1;
const idInvalide = -1;   

// Tests for the function getAdminData
describe("getAdminData", () => {

    test("Get admin data with correct date and id", () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    id_admin: 1,
                    name: "Didier"
                }
            ]
    });

        expect(getAdminData(dateValide, idValide)).toBeInstanceOf(Promise);
    });

    test("Get admin data with incorrect date and/or incorrect id", async () => {
        axios.get.mockResolvedValue({
            data: []
        });

        await expect(getAdminData(dateInvalide, idInvalide)).rejects.toThrow("Admin not found");
    });
});

// Tests for the function getUserAdminData
describe("getUserAdminData", () => {

    test("Get user admin with correct id", () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    id_admin: 1,
                    surname: "Ummel",
                    name: "Ethan"
                }   
            ]
        });
        
        expect(getUserAdminData(idValide)).toBeInstanceOf(Promise);
    });

    test("Get user admin with wrong id", async () => {
        axios.get.mockResolvedValue({
            data: []
        });

        await expect(getUserAdminData(idInvalide)).rejects.toThrow("User admin not found");
    });
});

// Tests for the function getUserData
describe("getUserData", () => {

    test("Get user data with correct date and id", () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    id_user: 1,
                    surname: "Ummel",
                    name: "Ethan"
                }
            ]
    });

        expect(getUserData(idValide, dateValide)).toBeInstanceOf(Promise);
    });

    test("Get user data with incorrect date and/or incorrect id", async () => {
        axios.get.mockResolvedValue({
            data: []
        });

        await expect(getUserData(idValide, dateValide)).rejects.toThrow("User not found");
    });
});