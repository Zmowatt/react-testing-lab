import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const SEED = [
  { id: 1, date: "2024-09-01", description: "Rent", category: "Housing", amount: 1500 },
  { id: 2, date: "2024-09-02", description: "Coffee", category: "Food", amount: 4.5 },
  { id: 3, date: "2024-09-03", description: "Groceries", category: "Food", amount: 120.25 },
  { id: 4, date: "2024-09-04", description: "Gym", category: "Health", amount: 45 },
];

function mockGet(data) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

function dataRowTexts() {
  const table = screen.getByRole("table", { name: /transactions/i });
  const rows = table.querySelectorAll("tbody tr");
  // slice(1) to skip the header row
  return Array.from(rows)
    .slice(1)
    .map((tr) => tr.textContent || "");
}

describe("Search & Sort", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("filters as the user types into the search input", async () => {
    mockGet(SEED);
    render(<AccountContainer />);

    expect(await screen.findByText("Rent")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Search your Recent Transactions");
    await userEvent.clear(input);
    await userEvent.type(input, "food");

    const joined = dataRowTexts().join(" ");
    expect(joined).toMatch(/Coffee/);
    expect(joined).toMatch(/Groceries/);
    expect(joined).not.toMatch(/Rent/);
    expect(joined).not.toMatch(/Gym/);
  });

  it("sorts by description (A→Z)", async () => {
    mockGet(SEED);
    render(<AccountContainer />);

    expect(await screen.findByText("Rent")).toBeInTheDocument();

    const select = screen.getByLabelText(/sort/i);
    await userEvent.selectOptions(select, "description");

    const rows = dataRowTexts();
    expect(rows[0]).toMatch(/Coffee/);
    expect(rows[1]).toMatch(/Groceries/);
    expect(rows[2]).toMatch(/Gym/);
    expect(rows[3]).toMatch(/Rent/);
  });

  it("sorts by category (A→Z)", async () => {
    mockGet(SEED);
    render(<AccountContainer />);

    expect(await screen.findByText("Rent")).toBeInTheDocument();

    const select = screen.getByLabelText(/sort/i);
    await userEvent.selectOptions(select, "category");

    const rows = dataRowTexts();
    // Category order: Food, Food, Health, Housing
    expect(rows[0]).toMatch(/Coffee/);
    expect(rows[1]).toMatch(/Groceries/);
    expect(rows[2]).toMatch(/Gym/);
    expect(rows[3]).toMatch(/Rent/);
  });
});
