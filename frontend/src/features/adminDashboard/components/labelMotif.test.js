/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import LabelMotif from "./labelMotif";
import React from "react";
import "@testing-library/jest-dom";


describe("LabelMotif component", () => {
    test("Render the component labelMotif correctly", () => {
        render(<LabelMotif />);

        const labelMotifElement = screen.getByText("Motif");

        expect(labelMotifElement).toBeInTheDocument();
    });

    test("Display the reason when the student is absent and have an reason", () => {
        render(<LabelMotif studentPresence={1} studentReason="Sick"/>);

        const labelMotifElement = screen.getByText("Sick");

        expect(labelMotifElement).toBeInTheDocument();
    });

    test("Do not display the reason if the student is absent and have no reason", () => {
        render(<LabelMotif studentPresence={1} />);

        const labelMotifElement = screen.queryByText("Sick");

        expect(labelMotifElement).not.toBeInTheDocument();
    });
});



