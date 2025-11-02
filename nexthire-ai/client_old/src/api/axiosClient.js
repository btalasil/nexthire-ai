import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const instance = axios.create({
  baseURL: API_BASE
})

export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => t ? localStorage.setItem('token', t) : localStorage.removeItem('token')

instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const api = instance

// include cookies for refresh endpoint
instance.defaults.withCredentials = true

let isRefreshing = false
let queue = []

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {}
    if (error.response && error.response.status === 401 && !original.__isRetry) {
      if (isRefreshing) {
        return new Promise(resolve => queue.push(resolve)).then(() => {
          original.headers = original.headers || {}
          const t = getToken()
          if (t) original.headers['Authorization'] = `Bearer ${t}`
          original.__isRetry = true
          return instance(original)
        })
      }
      try {
        isRefreshing = true
        const { data } = await instance.post('/api/auth/refresh')
        setToken(data.token)
        queue.forEach(fn => fn())
        queue = []
        original.headers = original.headers || {}
        original.headers['Authorization'] = `Bearer ${data.token}`
        original.__isRetry = true
        return instance(original)
      } catch (e) {
        setToken(null)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
