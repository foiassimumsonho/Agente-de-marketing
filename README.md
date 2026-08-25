# FLUX — Gestor de Marketing Digital
### Guia Completo de Deploy no Railway

---

## 🗂️ Estrutura do Projeto

```
flux-marketing/
├── backend/
│   ├── main.py                  # FastAPI principal
│   ├── requirements.txt
│   └── routers/
│       ├── instagram.py         # Meta Graph API
│       ├── google_auth.py       # OAuth Google
│       ├── analytics.py         # Google Analytics 4
│       ├── ads.py               # Google Ads
│       ├── merchant.py          # Merchant Center
│       └── chat.py              # Agente FLUX (Anthropic)
├── frontend/
│   └── index.html               # UI completa
├── .env.example                 # Modelo de variáveis
├── Procfile
├── railway.json
└── README.md
```

---

## ✅ PASSO 1 — Criar as Credenciais (APIs)

### 🔑 Anthropic (Claude AI)
1. Acesse https://console.anthropic.com
2. Vá em **API Keys** → **Create Key**
3. Copie a chave `sk-ant-...`

---

### 📱 Meta / Instagram
> Necessário para integrar o Instagram Business

1. Acesse https://developers.facebook.com/apps
2. Clique **Create App** → escolha **Business**
3. Em **Products**, adicione **Instagram Graph API**
4. Vá em **Settings > Basic** e copie:
   - `App ID` → será seu `META_APP_ID`
   - `App Secret` → será seu `META_APP_SECRET`
5. Em **Instagram > Basic Display**, adicione as permissões:
   - `instagram_basic`
   - `instagram_manage_insights`
   - `pages_show_list`
   - `pages_read_engagement`
6. Em **Valid OAuth Redirect URIs**, adicione:
   ```
   https://SEU-APP.railway.app/api/instagram/callback
   ```
> ⚠️ O Instagram precisa ser conta **Business ou Creator** vinculada a uma Página do Facebook

---

### 📊 Google (Analytics + Ads + Merchant)
> Uma única credencial OAuth serve para os três

1. Acesse https://console.cloud.google.com
2. Crie um projeto novo (ou use um existente)
3. Ative as APIs:
   - **Google Analytics Data API**
   - **Google Analytics Admin API**
   - **Google Ads API**
   - **Content API for Shopping** (Merchant Center)
4. Vá em **APIs & Services > Credentials**
5. Clique **Create Credentials > OAuth 2.0 Client ID**
   - Tipo: **Web application**
   - Authorized redirect URIs:
     ```
     https://SEU-APP.railway.app/api/google/callback
     ```
6. Copie `Client ID` e `Client Secret`

#### Google Ads Developer Token
1. Acesse https://ads.google.com
2. Vá em **Ferramentas > Central da API**
3. Solicite um **Developer Token** (pode levar alguns dias para aprovação)
4. Para testes, use o token em **modo de teste**

---

## ✅ PASSO 2 — Deploy no Railway

### 2.1 Criar conta e conectar repositório
1. Acesse https://railway.app e crie uma conta (gratuita)
2. Clique **New Project → Deploy from GitHub repo**
3. Conecte sua conta GitHub e faça upload do projeto:
   - Opção A: crie um repositório no GitHub e envie os arquivos
   - Opção B: use o **Railway CLI**: `railway up`

### 2.2 Configurar variáveis de ambiente
No painel do Railway, vá em seu serviço → **Variables** e adicione:

```
ANTHROPIC_API_KEY        = sk-ant-...
META_APP_ID              = (do Facebook Developer)
META_APP_SECRET          = (do Facebook Developer)
GOOGLE_CLIENT_ID         = (do Google Cloud Console)
GOOGLE_CLIENT_SECRET     = (do Google Cloud Console)
GOOGLE_ADS_DEVELOPER_TOKEN = (do Google Ads)
BACKEND_URL              = https://SEU-APP.railway.app
FRONTEND_URL             = https://SEU-APP.railway.app
```

> 💡 O Railway gera automaticamente a URL do seu app. Copie ela e use nas variáveis acima.

### 2.3 Aguardar o deploy
O Railway detecta automaticamente o Python e instala as dependências via `requirements.txt`.
O build leva cerca de 2-3 minutos.

---

## ✅ PASSO 3 — Configurar Redirect URIs finais

Após o deploy, você terá uma URL tipo `https://flux-marketing-production.railway.app`.

Atualize os redirects:

**No Facebook Developer:**
```
https://flux-marketing-production.railway.app/api/instagram/callback
```

**No Google Cloud Console:**
```
https://flux-marketing-production.railway.app/api/google/callback
```

---

## ✅ PASSO 4 — Usar o FLUX

1. Acesse sua URL do Railway no navegador
2. Clique em **📱 Instagram** → autorize sua conta
3. Clique em **📊 Google** → autorize (conecta Analytics + Ads + Merchant de uma vez)
4. Pronto! O FLUX agora tem acesso aos seus dados em tempo real

---

## 🛠️ Rodar localmente (desenvolvimento)

```bash
# Clone o projeto
cd flux-marketing

# Crie o arquivo .env
cp .env.example .env
# Preencha as variáveis no .env

# Instale dependências
pip install -r backend/requirements.txt

# Inicie o servidor
uvicorn backend.main:app --reload --port 8000
```

Acesse: http://localhost:8000

---

## 📡 Endpoints disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/instagram/auth` | Inicia OAuth Instagram |
| GET | `/api/instagram/profile` | Perfil + métricas IG |
| GET | `/api/instagram/audience` | Dados de audiência |
| GET | `/api/google/auth` | Inicia OAuth Google |
| GET | `/api/analytics/properties` | Lista propriedades GA4 |
| GET | `/api/analytics/report` | Relatório de métricas |
| GET | `/api/analytics/realtime` | Usuários em tempo real |
| GET | `/api/ads/customers` | Contas Google Ads |
| GET | `/api/ads/campaigns` | Campanhas + métricas |
| GET | `/api/ads/keywords` | Top palavras-chave |
| GET | `/api/merchant/products` | Produtos cadastrados |
| GET | `/api/merchant/product-statuses` | Status de aprovação |
| POST | `/api/chat/` | Chat com o agente FLUX |
| GET | `/docs` | Documentação Swagger |

---

## ❓ Dúvidas frequentes

**O Instagram não conecta?**
- Verifique se a conta é Business ou Creator
- Confirme se está vinculada a uma Página do Facebook
- Cheque se as permissões foram adicionadas no app Meta

**Erro 401 no Google?**
- O token expira. O frontend precisa usar o refresh token para renovar
- Verifique se as APIs estão ativadas no Google Cloud Console

**O Railway para o app depois de inativo?**
- No plano gratuito o app "dorme" após inatividade. Faça upgrade para o plano Hobby ($5/mês) para manter sempre ativo.
