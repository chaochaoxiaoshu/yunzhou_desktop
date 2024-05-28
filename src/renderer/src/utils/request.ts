import axios from 'axios'

export const httpInstance = axios.create({
  baseURL: 'http://123.254.107.244:7005',
  timeout: 10000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

export const xtBaseHttpInstance = axios.create({
  baseURL: 'http://123.254.107.244:7000',
  timeout: 10000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
})
