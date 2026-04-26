import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE })

export const getCidades = () => api.get('/cidades').then(r => r.data)
export const getServicos = (multiplicador) => api.get(`/automacao/servicos?multiplicador=${multiplicador}`).then(r => r.data)
export const getPacotes = (multiplicador) => api.get(`/automacao/pacotes?multiplicador=${multiplicador}`).then(r => r.data)
export const calcularAutomacao = (data) => api.post('/automacao/calcular', data).then(r => r.data)

export const getTiposSite = () => api.get('/site/tipos').then(r => r.data)
export const getFuncionalidades = () => api.get('/site/funcionalidades').then(r => r.data)
export const getDesigns = () => api.get('/site/designs').then(r => r.data)
export const getConteudos = () => api.get('/site/conteudos').then(r => r.data)
export const getPrazos = () => api.get('/site/prazos').then(r => r.data)
export const getPlanosMensais = (multiplicador) => api.get(`/site/planos-mensais?multiplicador=${multiplicador}`).then(r => r.data)
export const calcularSite = (data) => api.post('/site/calcular', data).then(r => r.data)

export const calcularCombo = (data) => api.post('/combo/calcular', data).then(r => r.data)
export const gerarProposta = (tipo, dados) => api.post('/gerar-proposta', { tipo, dados }).then(r => r.data)

export default api
