import React from "react";

function Search({ setSearch }) {
  return (
    <div className="ui large fluid icon input">
      {/* hidden label so tests can use getByLabelText(/search/i) if needed */}
      <label htmlFor="search-input" style={{ display: "none" }}>
        Search
      </label>
      <input
        id="search-input"
        type="text"
        placeholder="Search your Recent Transactions"
        onChange={(e) => setSearch(e.target.value)}
      />
      <i className="circular search link icon"></i>
    </div>
  );
}

export default Search;
