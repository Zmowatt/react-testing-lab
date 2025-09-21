import React, { useState, useEffect, useMemo } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(""); // "", "description", "category"
  const BASE_URL = "http://localhost:6001/transactions";

  // Load on mount
  useEffect(() => {
    fetch(BASE_URL)
      .then((r) => r.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
      .catch(() => setTransactions([]));
  }, []);

  // Create
  function postTransaction(newTransaction) {
    const payload = { ...newTransaction, amount: Number(newTransaction.amount) };
    return fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error("POST failed");
        return r.json();
      })
      .then((created) => {
        setTransactions((xs) => [...xs, created]); // single correct update
        return created;
      })
      .catch((e) => console.error(e));
  }

  // Sort selection handler
  function onSort(nextSort) {
    setSortBy(nextSort);
  }

  // Filter + sort (memoized)
  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = transactions.filter((t) =>
      `${t.description ?? ""} ${t.category ?? ""}`.toLowerCase().includes(needle)
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "description":
          return (a.description ?? "").localeCompare(b.description ?? "");
        case "category":
          return (a.category ?? "").localeCompare(b.category ?? "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [transactions, search, sortBy]);

  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      <TransactionsList transactions={visible} />
    </div>
  );
}

export default AccountContainer;
