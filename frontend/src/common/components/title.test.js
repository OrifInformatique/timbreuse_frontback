/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import Title from "./title";
import React from "react";
import "@testing-library/jest-dom";

describe("Title component", () => {
    test("Render the component title correctly", () => {
        render(<Title titre="My title"/>);

        const titleElement = screen.getByText("My title");

        expect(titleElement).toBeInTheDocument();
    });
    
    test("Render the component title correctly", () => {
        render(<Title/>);

        const titleElement = screen.getByText("titre");

        expect(titleElement).toBeInTheDocument();
    });

});


