# 🧮 Calculadora de Preços — Serviços Digitais

Calculadora unificada para precificação de **Automação com IA** (clínicas via N8N) e **Criação de Site** (qualquer nicho), com modo **Combo** que aplica 10% de desconto no setup total.

---

## 📁 Estrutura do Projeto

```
.
├── backend/          # API FastAPI (Python)
└── frontend/         # Interface React + Tailwind CSS
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Python 3.10+
- Node.js 18+
- npm 9+

---

### ▶️ Backend (FastAPI)

```bash
# 1. Entrar na pasta raiz do projeto
cd "calculadora automação + site"

# 2. Criar e ativar ambiente virtual (recomendado)
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependências
pip install -r backend/requirements.txt

# 4. Iniciar o servidor
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

API rodando em: **http://localhost:8000**
Documentação interativa: **http://localhost:8000/docs**

---

### ▶️ Frontend (React + Vite)

```bash
# 1. Entrar na pasta frontend
cd frontend

# 2. Instalar dependências
npm install

# 3. Iniciar em modo desenvolvimento
npm run dev
```

Frontend rodando em: **http://localhost:3000**

> O Vite já está configurado com proxy: chamadas para `/api/*` são redirecionadas para `http://localhost:8000`.

---

## 🛠️ Variáveis de Ambiente

### Frontend

Crie um arquivo `frontend/.env` (opcional — o proxy do Vite já funciona em dev):

```env
VITE_API_URL=http://localhost:8000
```

Em produção (Vercel), configure essa variável com a URL pública do backend no Render.

### Backend

Nenhuma variável obrigatória. CORS está configurado para `*` (aberto) — em produção, restrinja para o domínio do frontend.

---

## 📦 Build para produção

### Backend

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
# Gera a pasta frontend/dist/ pronta para deploy
```

---

## ☁️ Deploy gratuito (recomendado)

### Backend → [Render](https://render.com)

1. Criar conta em render.com
2. **New → Web Service** → conectar repositório
3. Configurar:
   - **Root directory:** `(deixar vazio, raiz do repo)`
   - **Build command:** `pip install -r backend/requirements.txt`
   - **Start command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
4. Aguardar o deploy. URL gerada ex: `https://calculadora-api.onrender.com`

> ⚠️ No plano gratuito do Render, o serviço "dorme" após 15 min de inatividade. A primeira requisição pode demorar ~30s para acordar.

---

### Frontend → [Vercel](https://vercel.com)

1. Criar conta em vercel.com
2. **New Project** → importar repositório
3. Configurar:
   - **Framework Preset:** Vite
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL` = `https://sua-api.onrender.com` (URL do Render)
5. Deploy automático a cada push!

---

## 🗂️ Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/cidades` | Lista cidades e presets |
| GET | `/automacao/servicos?multiplicador=1.0` | Serviços com preços calculados |
| GET | `/automacao/pacotes?multiplicador=1.0` | Pacotes com preços e economia |
| POST | `/automacao/calcular` | Calcula automação (pacote ou personalizado) |
| GET | `/site/tipos` | Tipos de projeto |
| GET | `/site/funcionalidades` | Lista de funcionalidades extras |
| GET | `/site/designs` | Níveis de design |
| GET | `/site/conteudos` | Opções de conteúdo |
| GET | `/site/prazos` | Prazos disponíveis |
| GET | `/site/planos-mensais?multiplicador=1.0` | Planos com preços calculados |
| POST | `/site/calcular` | Calcula site completo |
| POST | `/combo/calcular` | Calcula combo (automação + site + 10% off) |
| POST | `/gerar-proposta` | Gera texto formatado da proposta |

---

## ✏️ Como atualizar preços

Todos os preços e dados estão centralizados em arquivos de dados — sem necessidade de mexer na lógica:

| O que atualizar | Arquivo |
|-----------------|---------|
| Serviços e pacotes de automação | `backend/automacao/data.py` |
| Tipos de site, funcionalidades, designs, prazos, planos | `backend/site/data.py` |
| Cidades e multiplicadores | `backend/shared/cidades.py` |
| Templates das propostas | `backend/shared/proposta.py` |

---

## 🧩 Funcionalidades

- ✅ 3 modos: Automação, Site, Combo
- ✅ Wizard de site em 8 etapas (com progresso visual)
- ✅ Painel lateral com preview de preço em tempo real
- ✅ Resumo editável antes de calcular
- ✅ Detalhamento completo do cálculo
- ✅ Gerador de proposta formatada para WhatsApp
- ✅ Suporte a "outras cidades" com presets e multiplicador personalizado
- ✅ Cidades frequentes salvas em localStorage
- ✅ Responsivo (mobile e desktop)
- ✅ Arredondamento automático para a dezena mais próxima
