import axios from 'axios'

export const TOKEN_KEY = 'workmind.accessToken'

const client = axios.create({
  baseURL: 'http://localhost:8080/workmind',
  timeout: 10000,
})

client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client