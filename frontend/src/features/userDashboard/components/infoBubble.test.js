/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import InfoBubble from "./infoBubble";
import React from "react";
import "@testing-library/jest-dom";

describe("InfoBubble component", () => {
    test("Render the component InfoBubble correctly", () => {
        render(<InfoBubble textDate="Lu 19.01" textTime="Today" />);

        const infoBubbleElement1 = screen.getByText(/Lu 19\.01/i);
        const infoBubbleElement2 = screen.getByText(/Today/i);

        expect(infoBubbleElement1).toBeInTheDocument();
        expect(infoBubbleElement2).toBeInTheDocument();
    });
    
    test("Render the infoBubble gray if state is 1", () => {
        const { container } = render(<InfoBubble textDate="Lu 19.01" state={1} textTime="Today" />);
        const liElement = container.querySelector("li");

        expect(liElement).toHaveClass("bg-gray-300");
        expect(liElement).toHaveClass("border-gray-400");

    });

    test("Render the infoBubble orange if state is 2", () => {
        const { container } = render(<InfoBubble textDate="Lu 19.01" state={2} textTime="Today" />);
        const liElement = container.querySelector("li");

        expect(liElement).toHaveClass("bg-orange-300");
        expect(liElement).toHaveClass("border-orange-400");

    }); 
});