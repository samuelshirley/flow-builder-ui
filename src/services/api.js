import { auth } from '../firebase';

const API_URL = 'http://localhost:3001';

const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const saveSurvey = async (surveyData) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/surveys`, {
      method: 'POST',
      headers,
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      throw new Error('Failed to save survey');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving survey:', error);
    throw error;
  }
};

export const getUserSurveys = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/surveys`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch surveys');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }
};

export const updateSurvey = async (surveyId, surveyData) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/surveys/${surveyId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      throw new Error('Failed to update survey');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating survey:', error);
    throw error;
  }
};

export const deleteSurvey = async (surveyId) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/surveys/${surveyId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to delete survey');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting survey:', error);
    throw error;
  }
}; 