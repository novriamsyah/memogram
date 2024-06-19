import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const requestProcessor = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data: any = null, token?: string, isFormData: boolean = false) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
  };

  if (isFormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await axiosInstance(config);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      throw new Error(error.response?.data.message || 'Something went wrong');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export default requestProcessor;


