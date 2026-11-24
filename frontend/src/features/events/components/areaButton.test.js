/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AreaButton from "./areaButton";
import "@testing-library/jest-dom";

// Mock of the Button
jest.mock("@orif-informatique/react-components-library", () => ({
    Button: ({ label, onClick }) => (
        <button onClick={onClick}>{label}</button>
    ),
}));


describe("AreaButton component", () => {

    test("renders correctly", () => {
        render(<AreaButton />);

        expect(screen.getByText("Jour")).toBeInTheDocument();
        expect(screen.getByText("Semaine")).toBeInTheDocument();
        expect(screen.getByText("Mois")).toBeInTheDocument();
        expect(screen.getByText("Année")).toBeInTheDocument();
    });

    test("displays the four filter buttons", () => {
        render(<AreaButton />);

        const buttons = screen.getAllByRole("button");

        expect(buttons).toHaveLength(4);
    });

    test("calls funcFilterDay when clicking on Jour", () => {
        const funcFilterDay = jest.fn();

        render(<AreaButton funcFilterDay={funcFilterDay} />);

        fireEvent.click(screen.getByRole("button", { name: "Jour" }));

        expect(funcFilterDay).toHaveBeenCalledTimes(1);
    });

    test("calls funcFilterWeek when clicking on Semaine", () => {
        const funcFilterWeek = jest.fn();

        render(<AreaButton funcFilterWeek={funcFilterWeek} />);

        fireEvent.click(screen.getByRole("button", { name: "Semaine" }));

        expect(funcFilterWeek).toHaveBeenCalledTimes(1);
    });

    test("calls funcFilterMonth when clicking on Mois", () => {
        const funcFilterMonth = jest.fn();

        render(<AreaButton funcFilterMonth={funcFilterMonth} />);

        fireEvent.click(screen.getByRole("button", { name: "Mois" }));

        expect(funcFilterMonth).toHaveBeenCalledTimes(1);
    });

    test("calls funcFilterYear when clicking on Année", () => {
        const funcFilterYear = jest.fn();

        render(<AreaButton funcFilterYear={funcFilterYear} />);

        fireEvent.click(screen.getByRole("button", { name: "Année" }));

        expect(funcFilterYear).toHaveBeenCalledTimes(1);
    });

    test("works when no callback is provided", () => {
        render(<AreaButton />);

        expect(() => {
            fireEvent.click(screen.getByRole("button", { name: "Jour" }));
            fireEvent.click(screen.getByRole("button", { name: "Semaine" }));
            fireEvent.click(screen.getByRole("button", { name: "Mois" }));
            fireEvent.click(screen.getByRole("button", { name: "Année" }));
        }).not.toThrow();
    });

});



