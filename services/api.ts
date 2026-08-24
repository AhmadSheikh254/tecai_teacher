export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.schoolteacher.app';

export const fetchAPI = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
