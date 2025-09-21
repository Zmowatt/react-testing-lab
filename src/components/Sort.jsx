import React from "react";

function Sort({ onSort }) {
  return (
    <div className="ui form">
      <label htmlFor="sort-select">Sort</label>
      <select
        id="sort-select"
        onChange={(e) => {
          onSort(e.target.value);
        }}
      >
        <option value={"description"}>Description</option>
        <option value={"category"}>Category</option>
      </select>
    </div>
  );
}
export default Sort;
