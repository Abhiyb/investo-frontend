import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL, // ✅ dynamic backend URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token to every request
axiosInstance.interceptors.request.use(config => {
  console.log('Request made with', import.meta.env.VITE_BACKEND_SERVER_URL)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
