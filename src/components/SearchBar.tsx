import React from "react";
import { TextField, Button } from "@mui/material";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
}) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <TextField
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </Button>
    </div>
  );
};

export default SearchBar;
