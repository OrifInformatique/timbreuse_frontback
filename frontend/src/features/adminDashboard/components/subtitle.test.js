/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Subtitle from "./subtitle";
import React from "react";
import "@testing-library/jest-dom";

describe("Title component", () => {
    test("Render the component title correctly", () => {
        render(<Subtitle sousTitre="My subtitle"/>);

        const subtitleElement = screen.getByText("My subtitle");

        expect(subtitleElement).toBeInTheDocument();
    });
    
    test("Render the component title correctly", () => {
        render(<Subtitle/>);

        const subtitleElement = screen.getByText("sous-titre");

        expect(subtitleElement).toBeInTheDocument();
    });

});