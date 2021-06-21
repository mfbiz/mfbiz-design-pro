
import { axios } from '@/app.utils.js'

export const login = params => axios.post(`/api/matrix/auth/ccs/login`, params)
 
