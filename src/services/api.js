import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const ticketService = {
  // Get all tickets for current user
  getUserTickets: async () => {
    try {
      const response = await apiClient.get('/support/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  },

  // Create a new ticket
  createTicket: async (ticket) => {
    try {
      const response = await apiClient.post('/support/createTicket', ticket);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Respond to a ticket
  respondToTicket: async (ticketId, responseMessage, status) => {
    try {
      const params = new URLSearchParams();
      params.append('responseMessage', responseMessage);
      if (status) {
        params.append('status', status);
      }

      const response = await apiClient.put(`/support/${ticketId}/respond?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error responding to ticket:', error);
      throw error;
    }
  },

  // Filter tickets for current user
  filterUserTickets: async (filters) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.priority) {
        queryParams.append('priority', filters.priority);
      }

      if (filters.status) {
        queryParams.append('status', filters.status);
      }

      const response = await apiClient.get(`/support/user/filter?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering tickets:', error);
      throw error;
    }
  }
};
