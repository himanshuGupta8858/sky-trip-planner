import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Budget from "@/app/create-new-trip/_component/Budget";
import GroupSize from "@/app/create-new-trip/_component/GroupSize";
import Duration from "@/app/create-new-trip/_component/Duration";
import PackingList from "@/app/create-new-trip/_component/PackingList";

describe("Trip planning UI components & accessibility", () => {
  it("Budget renders accessible pressed buttons and invokes callback", () => {
    const onSelect = vi.fn();
    render(<Budget onSelectOption={onSelect} />);

    const lowBtn = screen.getByRole("button", { name: /Low/i });
    expect(lowBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(lowBtn);
    expect(lowBtn).toHaveAttribute("aria-pressed", "true");
    expect(onSelect).toHaveBeenCalledWith("Low-Stay conscious of costs");
  });

  it("GroupSize renders all 4 accessible traveler options", () => {
    const onSelect = vi.fn();
    render(<GroupSize onSelectOption={onSelect} />);

    const coupleBtn = screen.getByRole("button", { name: /A Couple/i });
    fireEvent.click(coupleBtn);
    expect(coupleBtn).toHaveAttribute("aria-pressed", "true");
    expect(onSelect).toHaveBeenCalledWith("A Couple");
  });

  it("Duration increments/decrements days via accessible buttons and confirms", () => {
    const onSelect = vi.fn();
    render(<Duration onSelectOption={onSelect} />);

    const incBtn = screen.getByRole("button", { name: /Increase trip duration/i });
    const decBtn = screen.getByRole("button", { name: /Decrease trip duration/i });
    expect(decBtn).toBeDisabled();

    fireEvent.click(incBtn);
    expect(decBtn).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
    expect(onSelect).toHaveBeenCalledWith("2 Days");
  });

  it("PackingList adapts gear recommendations based on destination", () => {
    render(
      <PackingList
        trip={{
          origin: "Delhi",
          destination: "Manali Mountain Retreat",
          duration: "4 Days",
          budget: "Medium",
          hotels: [],
          itinerary: [],
        }}
      />
    );
    expect(screen.getByText(/Warm Jacket \/ Thermal/i)).toBeInTheDocument();
  });
});
