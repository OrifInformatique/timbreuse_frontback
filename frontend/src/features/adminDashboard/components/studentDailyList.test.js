/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import StudentDailyList from "./studentDailyList";
import React from "react";
import "@testing-library/jest-dom";

jest.mock("./tableLigne", () => ({
    __esModule: true,
    default: ({ surname, name }) => (
        <td data-testid="table-line">
            {surname} {name}
        </td>
    )
}));

describe("studentDailyList component", () => {
    test("renders correctly the title of the list", () => {
        render(<StudentDailyList titleList="Présent" listStudent={[]} typeList={0}/>);

        const titleListElement = screen.getByText("Présent");

        expect(titleListElement).toBeInTheDocument();
    });

    test("renders only student present (typeList = 0)", () => {
        const listStudent = [
            {id: 1, surname: "Dupont", name: "Jean", presence: 0, reason: ""},
            {id: 2, surname: "Ummel", name: "Ethan", presence: 1, reason: ""},
            {id: 3, surname: "Viret", name: "Didier", presence: 1, reason: "RDV"}
        ];

        render(<StudentDailyList listStudent={listStudent} typeList={0}/>);

        const rows = screen.getAllByTestId("table-line");
        
        expect(rows).toHaveLength(1);
        expect(screen.getByText(/Dupont/)).toBeInTheDocument();
    });

    test("renders only student absent (typeList = 1)", () => {
        const listStudent = [
            {id: 1, surname: "Dupont", name: "Jean", presence: 0, reason: ""},
            {id: 2, surname: "Ummel", name: "Ethan", presence: 1, reason: ""},
            {id: 3, surname: "Viret", name: "Didier", presence: 1, reason: "RDV"}
        ];

        render(<StudentDailyList listStudent={listStudent} typeList={1}/>);

        const rows = screen.getAllByTestId("table-line");
        
        expect(rows).toHaveLength(1);
        expect(screen.getByText(/Ummel/)).toBeInTheDocument();
    });

    test("renders only student excused (typeList = 1 with a reason)", () => {
        const listStudent = [
            {id: 1, surname: "Dupont", name: "Jean", presence: 0, reason: ""},
            {id: 2, surname: "Ummel", name: "Ethan", presence: 1, reason: ""},
            {id: 3, surname: "Viret", name: "Didier", presence: 1, reason: "RDV"}
        ];

        render(<StudentDailyList listStudent={listStudent} typeList={2}/>);

        const rows = screen.getAllByTestId("table-line");
        
        expect(rows).toHaveLength(1);
        expect(screen.getByText(/Viret/)).toBeInTheDocument();
    });

    test("renders a empty list", () => {

    render(<StudentDailyList listStudent={[]} typeList={0} />);

    const listElement = screen.getByText("Name of the list");
    expect(listElement).toBeInTheDocument();

});
});
