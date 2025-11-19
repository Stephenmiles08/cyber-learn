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
  login: async (username: string, password: string, role: 'student' | 'instructor') => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    return response.json();
  },

  register: async (username: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name }),
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
  createInstructor: async (username: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/instructors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, password, name }),
    });
    return response.json();
  },

  registerInstructor: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/register-instructor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  // Instructor - Get all students
  getStudents: async () => {
    const response = await fetch(`${API_URL}/instructor/students`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Leaderboard with filters
  getLeaderboardFiltered: async (period?: string, metric?: string) => {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (metric) params.append('metric', metric);
    const query = params.toString();
    const response = await fetch(`${API_URL}/leaderboard${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Student details
  getStudent: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getStudentSolved: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}/solved`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getStudentAttempts: async (id: string) => {
    const response = await fetch(`${API_URL}/students/${id}/attempts`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Lab hints
  getLabHint: async (labId: string) => {
    const response = await fetch(`${API_URL}/labs/${labId}/hint`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Lab status
  getLabStatus: async (labId: string) => {
    const response = await fetch(`${API_URL}/labs/${labId}/status`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Lab attempts
  getLabAttempts: async (labId: string, studentId?: string) => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    const query = params.toString();
    const response = await fetch(`${API_URL}/labs/${labId}/attempts${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Admin reset functions
  resetDatabase: async () => {
    const response = await fetch(`${API_URL}/admin/reset-db`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  resetScores: async () => {
    const response = await fetch(`${API_URL}/admin/reset-scores`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  resetLabs: async () => {
    const response = await fetch(`${API_URL}/admin/reset-labs`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
