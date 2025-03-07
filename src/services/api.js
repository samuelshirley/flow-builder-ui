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

export const saveConsultation = async (flowData) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/consultations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(flowData)
    });

    if (!response.ok) {
      throw new Error('Failed to save flow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving flow:', error);
    throw error;
  }
};

export const getUserConsultations = async () => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/consultations`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch flows');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching flows:', error);
    throw error;
  }
};

export const updateConsultation = async (consultationId, flowData) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/consultations/${consultationId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(flowData)
    });

    if (!response.ok) {
      throw new Error('Failed to update flow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating flow:', error);
    throw error;
  }
};

export const deleteConsultation = async (consultationId) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/consultations/${consultationId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      throw new Error('Failed to delete flow');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting flow:', error);
    throw error;
  }
}; 