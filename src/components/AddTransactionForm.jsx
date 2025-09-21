import React from "react";

function AddTransactionForm({ postTransaction }) {
  function submitForm(e) {
    e.preventDefault();
    const form = e.currentTarget;

    const fd = new FormData(form);
    const newTransaction = {
      date: fd.get("date") || "",
      description: fd.get("description") || "",
      category: fd.get("category") || "",
      amount: Number(fd.get("amount") || 0),
    };

    postTransaction(newTransaction);
    form.reset();
  }

  return (
    <div className="ui segment">
      <form className="ui form" aria-label="add-transaction-form" onSubmit={submitForm}>
        <div className="inline fields">
          <input type="date" name="date" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="category" placeholder="Category" />
          <input type="number" name="amount" placeholder="Amount" step="0.01" />
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
