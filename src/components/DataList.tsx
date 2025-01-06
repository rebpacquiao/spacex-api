import React, { useEffect, useState, useCallback } from "react";
import { fetchInitialData, fetchMoreData } from "../services/api";
import {
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchBar from "./SearchBar"; // Import the new SearchBar component

interface DataItem {
  mission_name: string;
  details: string;
}

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const DataList = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const loadData = useCallback(
    async (reset = false) => {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const fetchFunction = reset ? fetchInitialData : fetchMoreData;
      const newData = await fetchFunction(currentPage, searchQuery, 5);

      if (newData.length === 0) {
        setHasMore(false);
        setSnackbarOpen(true);
      } else {
        setData((prevData) => (reset ? newData : [...prevData, ...newData]));
        if (!reset) setPage(currentPage + 1);
      }
      setLoading(false);
    },
    [page, searchQuery]
  );

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.mission_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchQuery]);

  const handleSearch = () => {
    setHasMore(true);
    setPage(1);
    loadData(true);
  };

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        loadData();
      }
    }, 200),
    [hasMore, loading, loadData]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleDetails = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        loading={loading}
      />

      {filteredData.map((item, index) => (
        <Card key={index} style={{ marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h6">{item.mission_name}</Typography>
            {item.details && (
              <Button variant="contained" onClick={() => toggleDetails(index)}>
                {expanded === index ? "Hide" : "View"}
              </Button>
            )}
            {expanded === index && <Typography>{item.details}</Typography>}
          </CardContent>
        </Card>
      ))}
      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && !loading && filteredData.length > 0 && (
        <Typography align="center" mt={2}>
          No more data
        </Typography>
      )}
      {filteredData.length === 0 && !loading && (
        <Typography align="center" mt={2}>
          No results found
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          No more data available
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DataList;