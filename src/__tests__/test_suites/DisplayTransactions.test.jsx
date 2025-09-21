import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const SEED = [
  { id: 1, date: "2024-09-01", description: "Rent", category: "Housing", amount: 1500 },
  { id: 2, date: "2024-09-02", description: "Coffee", category: "Food", amount: 4.5 },
];

function mockGet(data, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => data,
  });
}

describe("Display Transactions", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("renders transactions from the server on startup", async () => {
    mockGet(SEED);

    render(<AccountContainer />);

    expect(await screen.findByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /transactions/i })).toBeInTheDocument();
  });

  it("shows an empty state when none are returned", async () => {
    mockGet([]);

    render(<AccountContainer />);

    expect(await screen.findByText(/No transactions found/i)).toBeInTheDocument();
  });
});
