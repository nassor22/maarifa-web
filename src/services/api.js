const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Post endpoints
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/posts?${queryString}`);
  }

  async getPost(id) {
    return await this.request(`/posts/${id}`);
  }

  async createPost(postData) {
    return await this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id, postData) {
    return await this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id) {
    return await this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async upvotePost(id) {
    return await this.request(`/posts/${id}/upvote`, {
      method: 'POST',
    });
  }

  async addReply(id, content) {
    return await this.request(`/posts/${id}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Freelancer endpoints
  async getFreelancers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/freelancers?${queryString}`);
  }

  async getFreelancer(id) {
    return await this.request(`/freelancers/${id}`);
  }

  async createOrUpdateFreelancerProfile(profileData) {
    return await this.request('/freelancers', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async addFreelancerReview(id, reviewData) {
    return await this.request(`/freelancers/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Job endpoints
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/jobs?${queryString}`);
  }

  async getJob(id) {
    return await this.request(`/jobs/${id}`);
  }

  async createJob(jobData) {
    return await this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async applyForJob(id, applicationData) {
    return await this.request(`/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // User endpoints
  async getUser(username) {
    return await this.request(`/users/${username}`);
  }

  async updateProfile(profileData) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Message endpoints
  async getConversations() {
    return await this.request('/messages/conversations');
  }

  async getMessages(conversationId) {
    return await this.request(`/messages/conversations/${conversationId}`);
  }

  async sendMessage(conversationId, content) {
    return await this.request(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async createConversation(participantId) {
    return await this.request('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantId }),
    });
  }

  // Category endpoints
  async getCategories() {
    return await this.request('/categories');
  }
}

const api = new ApiService();
export default api;
