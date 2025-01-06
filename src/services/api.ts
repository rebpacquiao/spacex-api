import axios from "axios";

const API_URL = "https://api.spacexdata.com/v3/launches";

export const fetchInitialData = async (searchQuery = "", limit: number) => {
  const response = await axios.get(API_URL, {
    params: { query: searchQuery, limit },
  });
  return response.data;
};

export const fetchMoreData = async (
  page: number,
  searchQuery = "",
  limit: number
) => {
  const response = await axios.get(API_URL, {
    params: { page, query: searchQuery, limit },
  });
  return response.data;
};
