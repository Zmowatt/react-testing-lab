import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AccountContainer from "../../components/AccountContainer";

const SEED = [
  { id: 1, date: "2024-09-01", description: "Rent", category: "Housing", amount: 1500 },
];

const CREATED = {
  id: 2,
  date: "2024-09-05",
  description: "Internet",
  category: "Utilities",
  amount: 60,
};

function mockFetchSequence() {
  const fetchMock = vi.fn();
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => SEED });    // GET
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => CREATED }); // POST
  global.fetch = fetchMock;
  return fetchMock;
}

describe("Add Transaction", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("calls POST and displays the new transaction", async () => {
    const fetchMock = mockFetchSequence();

    render(<AccountContainer />);

    expect(await screen.findByText("Rent")).toBeInTheDocument();

    const form = screen.getByLabelText("add-transaction-form");
    const dateInput = form.querySelector('input[name="date"]');
    fireEvent.change(dateInput, { target: { value: "2024-09-05" } });
    await userEvent.type(screen.getByPlaceholderText("Description"), "Internet");
    await userEvent.type(screen.getByPlaceholderText("Category"), "Utilities");
    await userEvent.clear(screen.getByPlaceholderText("Amount"));
    await userEvent.type(screen.getByPlaceholderText("Amount"), "60");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    const [, postCall] = fetchMock.mock.calls;
    expect(postCall[0]).toMatch(/http:\/\/localhost:6001\/transactions/);
    expect(postCall[1].method).toBe("POST");
    const body = JSON.parse(postCall[1].body);
    expect(body).toMatchObject({
      date: "2024-09-05",
      description: "Internet",
      category: "Utilities",
      amount: 60,
    });

    expect(await screen.findByText("Internet")).toBeInTheDocument();
    expect(screen.getByText("Utilities")).toBeInTheDocument();
  });
});
