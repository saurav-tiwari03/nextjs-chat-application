import axios, { AxiosResponse } from "axios";

type Data = Record<string, any>;
type Query = Record<string, any>;

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Send a POST request
 */
export const sendPostRequest = async <T = any>(
  endPoint: string,
  data: Data
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(`${BaseUrl}${endPoint}`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending POST request:", error);
    throw error;
  }
};

/**
 * Send a GET request with query params
 */
export const sendGetRequest = async <T = any>(
  endPoint: string,
  query?: Query
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(`${BaseUrl}${endPoint}`, {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending GET request:", error);
    throw error;
  }
};

/**
 * Send a protected POST request with Bearer token
 */
export const sendProtectedPostRequest = async <T = any>(
  endPoint: string,
  data: Data,
  token: string
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(`${BaseUrl}${endPoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending protected POST request:", error);
    throw error;
  }
};

/**
 * Send a protected GET request with Bearer token
 */
export const sendProtectedGetRequest = async <T = any>(
  endPoint: string,
  token: string
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(`${BaseUrl}${endPoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending protected GET request:", error);
    throw error;
  }
};
