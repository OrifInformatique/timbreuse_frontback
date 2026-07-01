/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import LabelPresence from "./labelPresence";
import React from "react";
import "@testing-library/jest-dom";

jest.mock("@orif-informatique/react-components-library", () => ({
    Icon: ({ name }) => (
        <div data-testid="icon">
            {name}
        </div>
    )
}));

describe("labelPresence component", () => {
    test("renders present state correctly", () => {
        render(<LabelPresence studentPresence={0} />)

        const labelElement = screen.getByText("Présent");
        const labelIconElement = screen.getByText("check");

        expect(labelElement).toBeInTheDocument();
        expect(labelIconElement).toBeInTheDocument();
    });

    test("Render green style for present state", () => {
        const { container } = render(<LabelPresence studentPresence={0}/>)

        const labelElement = container.querySelector(".text-green-500")

        expect(labelElement).toBeInTheDocument();
    });

    test("renders absent state correctly", () => {
        render(<LabelPresence studentPresence={1} />)

        const labelElement = screen.getByText("Absent");
        const labelIconElement = screen.getByText("cross");

        expect(labelElement).toBeInTheDocument();
        expect(labelIconElement).toBeInTheDocument();
    });

    test("Render red style for absent state", () => {
        const { container } = render(<LabelPresence studentPresence={1}/>)

        const labelElement = container.querySelector(".text-red-500")

        expect(labelElement).toBeInTheDocument();
    });

    test("renders excused state correctly", () => {
        render(<LabelPresence studentPresence={1} studentReason="Sick" />)

        const labelElement1 = screen.getByText("Excusé");
        const labelIconElement = screen.getByText("history");
        const labelElement2 = screen.getByText("Sick");

        expect(labelElement1).toBeInTheDocument();
        expect(labelIconElement).toBeInTheDocument();
        expect(labelElement2).toBeInTheDocument();
    });

    test("Render orange style for excused state", () => {
        const { container } = render(<LabelPresence studentPresence={1} studentReason="Sick"/>)

        const labelElement = container.querySelector(".text-orange-500")

        expect(labelElement).toBeInTheDocument();
    });    

    test("Do not display the reason if empty", () => {
        render(<LabelPresence studentPresence={1} />)

        const labelElement = screen.queryByText("Sick");

        expect(labelElement).not.toBeInTheDocument();
    });
});



