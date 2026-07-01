/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import ListAllStudent from "./listAllStudent";
import React from "react";
import "@testing-library/jest-dom";

jest.mock("./tableLigneResumeLog", () => ({
    __esModule: true,
    default: ({ id, name, surname }) => (
        <td data-testid="student-row">
            {id} - {surname} {name}
        </td>
    )
}));

describe("listAllStudent component", () => {
    test("renders the container table correctly", () => {
        render(<ListAllStudent />)

        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    test("renders the container table correctly even if the list is empty", () => {
        render(<ListAllStudent listStudent={[]}/>)

        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    test("renders one student", () => {
        const student = [
            {
                id: 1,
                surname: "Dupont",
                name: "Jean",
                errorFound: 0,
                workTime: "+08:00"
            }
        ];

        render(<ListAllStudent listStudent={student}/>);

        const studentNameElement = screen.getByText(/Dupont/);
        const studentSurnameElement = screen.getByText(/Jean/);

        expect(studentNameElement).toBeInTheDocument();
        expect(studentSurnameElement).toBeInTheDocument();
    });

    test("renders multiple students", () => {
        const students = [
            {
                id: 1,
                surname: "Dupont",
                name: "Jean"
            },
            {
                id: 2,
                surname: "Ummel",
                name: "Ethan"
            }
        ];

        render(<ListAllStudent listStudent={students}/>);

        const rows = screen.getAllByTestId("student-row");

        expect(rows).toHaveLength(2);
    });


});

