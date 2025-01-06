import axios from "axios";

const API_URL = "https://api.spacexdata.com/v3/launches";

export const fetchInitialData = async (limit: number) => {
  const response = await axios.get(API_URL, {
    params: { limit },
  });
  return response.data;
};

export const fetchMoreData = async (limit: number) => {
  const response = await axios.get(API_URL, {
    params: { limit },
  });
  return response.data;
};
