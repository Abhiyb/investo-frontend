import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token to every request
axiosInstance.interceptors.request.use(config => {
  console.log('Request made with ', 'http://localhost:8080')
  const token = localStorage.getItem('token')
  if (token) {

    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
