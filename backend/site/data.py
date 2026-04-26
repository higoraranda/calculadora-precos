TIPOS_PROJETO = [
    {"id": "landing_page", "nome": "Landing Page", "descricao": "1 página de conversão", "preco_base": 800, "paginas_inclusas": 1, "preco_pagina_extra": 400},
    {"id": "site_institucional", "nome": "Site Institucional", "descricao": "Site completo para empresas", "preco_base": 1500, "paginas_inclusas": 5, "preco_pagina_extra": 250},
    {"id": "blog_portal", "nome": "Blog / Portal de Conteúdo", "descricao": "Blog ou portal de notícias", "preco_base": 2000, "paginas_inclusas": 6, "preco_pagina_extra": 200},
    {"id": "ecommerce", "nome": "E-commerce / Loja Virtual", "descricao": "Loja virtual completa", "preco_base": 3500, "paginas_inclusas": 7, "preco_pagina_extra": 250},
    {"id": "sistema_web", "nome": "Sistema Web / SaaS", "descricao": "Sistema ou aplicação web", "preco_base": 5000, "paginas_inclusas": 8, "preco_pagina_extra": 350},
    {"id": "portfolio", "nome": "Portfólio", "descricao": "Portfólio profissional", "preco_base": 1000, "paginas_inclusas": 4, "preco_pagina_extra": 200},
    {"id": "site_evento", "nome": "Site para Evento", "descricao": "Página para evento ou lançamento", "preco_base": 1200, "paginas_inclusas": 3, "preco_pagina_extra": 250},
]

COMPLEXIDADES_DESIGN = [
    {"id": "simples", "nome": "Simples", "descricao": "Template adaptado", "multiplicador": 1.0},
    {"id": "intermediario", "nome": "Intermediário", "descricao": "Design customizado, identidade visual", "multiplicador": 1.3},
    {"id": "avancado", "nome": "Avançado", "descricao": "Design único, animações, micro-interações", "multiplicador": 1.6},
    {"id": "premium", "nome": "Premium", "descricao": "Exclusivo, motion design, ilustrações", "multiplicador": 2.0},
]

FUNCIONALIDADES = [
    {"id": "blog_integrado", "nome": "Blog integrado", "preco_base": 400},
    {"id": "area_restrita", "nome": "Área restrita / login de usuário", "preco_base": 800},
    {"id": "painel_admin", "nome": "Painel administrativo customizado", "preco_base": 1500},
    {"id": "integracao_whatsapp", "nome": "Integração com WhatsApp", "preco_base": 300},
    {"id": "formulario_avancado", "nome": "Formulário avançado (multi-step, validações)", "preco_base": 400},
    {"id": "analytics_pixel", "nome": "Google Analytics + Pixel Meta", "preco_base": 300},
    {"id": "seo_avancado", "nome": "SEO técnico avançado", "preco_base": 700},
    {"id": "multilingue", "nome": "Multilíngue (por idioma extra)", "preco_base": 600},
    {"id": "agendamento_online", "nome": "Agendamento online", "preco_base": 1000},
    {"id": "integracao_api", "nome": "Integração com sistema externo (API)", "preco_base": 1000},
    {"id": "chatbot_basico", "nome": "Chatbot básico (sem IA)", "preco_base": 500},
    {"id": "chatbot_ia", "nome": "Chatbot com IA", "preco_base": 1200},
    {"id": "newsletter", "nome": "Newsletter / captura de e-mail", "preco_base": 400},
    {"id": "galeria_avancada", "nome": "Galeria de fotos avançada", "preco_base": 300},
    {"id": "video_animacoes", "nome": "Vídeo de fundo / animações", "preco_base": 400},
    {"id": "gateway_pagamento", "nome": "Integração com gateway de pagamento", "preco_base": 800},
    {"id": "comentarios", "nome": "Sistema de comentários", "preco_base": 400},
    {"id": "mapa_customizado", "nome": "Mapa interativo customizado", "preco_base": 500},
    {"id": "calculadora_online", "nome": "Calculadora online customizada", "preco_base": 800},
    {"id": "catalogo_sem_checkout", "nome": "Catálogo de produtos sem checkout", "preco_base": 700},
    {"id": "filtros_busca", "nome": "Filtros e busca avançada", "preco_base": 600},
    {"id": "feed_redes_sociais", "nome": "Integração com redes sociais (feed automático)", "preco_base": 400},
    {"id": "lgpd", "nome": "LGPD (banner de cookies + política gerada)", "preco_base": 250},
]

OPCOES_CONTEUDO = [
    {"id": "cliente_fornece", "nome": "Cliente fornece todo o conteúdo", "preco_base": 0, "por_pagina": False},
    {"id": "adapto_conteudo", "nome": "Eu adapto/melhoro o conteúdo do cliente", "preco_base": 400, "por_pagina": False},
    {"id": "produzo_conteudo", "nome": "Eu produzo o conteúdo do zero (R$ 150/página)", "preco_base": 150, "por_pagina": True},
]

PRAZOS = [
    {"id": "padrao", "nome": "Padrão", "descricao": "30 dias úteis", "multiplicador": 1.0, "texto": "30 dias úteis"},
    {"id": "acelerado", "nome": "Acelerado", "descricao": "15-20 dias úteis", "multiplicador": 1.2, "texto": "15-20 dias úteis"},
    {"id": "urgente", "nome": "Urgente", "descricao": "até 10 dias úteis", "multiplicador": 1.5, "texto": "até 10 dias úteis"},
]

PLANOS_MENSAIS = [
    {
        "id": "essencial",
        "nome": "Essencial",
        "preco_base": 100,
        "descricao": "Hospedagem + domínio + SSL + backup mensal + atualizações de segurança + suporte por e-mail",
    },
    {
        "id": "plus",
        "nome": "Plus",
        "preco_base": 250,
        "descricao": "Tudo do Essencial + 2h/mês de alterações + backup semanal + suporte WhatsApp + relatório mensal",
    },
    {
        "id": "premium",
        "nome": "Premium",
        "preco_base": 500,
        "descricao": "Tudo do Plus + alterações ilimitadas + 1 post de blog/mês + SEO contínuo + suporte prioritário",
    },
]
