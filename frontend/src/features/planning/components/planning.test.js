/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Planning from "./planning";
import "@testing-library/jest-dom";

describe("Planning component", () => {
    test("renders correctly", () => {
        render(<Planning name="Ethan" surname="Ummel" />);
        expect(screen.getByText("Planning hebdomadaire Ethan Ummel")).toBeInTheDocument();
    });

    test("formats dates correctly", () => {
        render(
            <Planning startingDatePlanning="19.01.2026" endingDatePlanning="23.01.2026" />
        );

        const dates = screen.getAllByDisplayValue(/2026-01/);

        expect(dates[0]).toHaveValue("2026-01-19");
        expect(dates[1]).toHaveValue("2026-01-23");
    });

    test("renders planning title", () => {
        render(<Planning titlePlanning="Planning semaine"/>);  

        expect(screen.getByDisplayValue("Planning semaine")).toBeInTheDocument();
    });

    test("calculates presence rate", () => {

        const planning = {
            days: [
                { workTime: "08:12" },
                { workTime: "08:12" },
                { workTime: "08:12" },
                { workTime: "08:12" },
                { workTime: "08:12" }
            ]
        };

        render(<Planning dataPlanning={planning} />);
        expect(screen.getByDisplayValue("100 %")).toBeInTheDocument();
    });

    test("updates planning title", () => {
        render(<Planning titlePlanning="Ancien"/>);

        const input = screen.getByDisplayValue("Ancien");

        fireEvent.change(input, {
            target: {
                value: "Nouveau"
            }
        });

        expect(input).toHaveValue("Nouveau");
    });

    test("renders action buttons", () => {
        render(<Planning />);

        expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
    });

    test("updates values when props change", () => {
        const { rerender } = render(<Planning titlePlanning="Planning A"/>);

        rerender(<Planning titlePlanning="Planning B"/>);

        expect(screen.getByDisplayValue("Planning B")).toBeInTheDocument();
    });
});