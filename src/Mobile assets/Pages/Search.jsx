import React from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        boxSizing: "border-box",
        backgroundColor: "#121212",
      }}
    >
      <div style={{ marginTop: "40px" }}>
        <label htmlFor="input" style={{ color: "white", fontSize: "25px" }}>
          Search
        </label>
        <input
          onClick={() => {
            navigate("/search/result/%20");
          }}
          name="input"
          className="search-input"
          placeholder="What do you want to listen to?"
          type="text"
        />
      </div>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <h3 style={{ color: "gray", fontSize: "15px" }}>
          No any recent search found.
        </h3>
      </div>
    </div>
  );
}

export default Search;
