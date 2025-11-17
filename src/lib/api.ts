const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  login: async (email: string, password: string, role: 'student' | 'instructor') => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    return response.json();
  },

  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },

  // Labs
  getLabs: async () => {
    const response = await fetch(`${API_URL}/labs`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getLab: async (id: string) => {
    const response = await fetch(`${API_URL}/labs/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  createLab: async (lab: { title: string; description: string; flag: string; score: number }) => {
    const response = await fetch(`${API_URL}/labs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(lab),
    });
    return response.json();
  },

  updateLab: async (id: string, lab: { title: string; description: string; flag: string; score: number }) => {
    const response = await fetch(`${API_URL}/labs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(lab),
    });
    return response.json();
  },

  deleteLab: async (id: string) => {
    const response = await fetch(`${API_URL}/labs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Submissions
  submitFlag: async (labId: string, flag: string) => {
    const response = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ labId, flag }),
    });
    return response.json();
  },

  getLabSubmissions: async (labId: string) => {
    const response = await fetch(`${API_URL}/labs/${labId}/submissions`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Leaderboard
  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/leaderboard`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Profile
  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Instructor - Create instructor account
  createInstructor: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/instructors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },
};
