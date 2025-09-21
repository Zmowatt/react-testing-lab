import React from "react";
import Transaction from "./Transaction";

function TransactionsList({ transactions = [] }) {
  const rows = transactions.map((transaction) => (
    <Transaction key={transaction.id ?? `${transaction.description}-${transaction.date}`} transaction={transaction} />
  ));

  return (
    <table className="ui celled striped padded table" aria-label="transactions">
      <tbody>
        <tr>
          <th>
            <h3 className="ui center aligned header">Date</h3>
          </th>
          <th>
            <h3 className="ui center aligned header">Description</h3>
          </th>
          <th>
            <h3 className="ui center aligned header">Category</h3>
          </th>
          <th>
            <h3 className="ui center aligned header">Amount</h3>
          </th>
          <th>
            <h3 className="ui center aligned header">DELETE</h3>
          </th>
        </tr>

        {rows.length > 0 ? (
          rows
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
              No transactions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TransactionsList;
