# FLUX Marketing — camada de compatibilidade

Esta pasta organiza a arquitetura de referência solicitada para o projeto Atlas Marketing. O runtime oficial continua sendo o painel React + Express já configurado no diretório raiz, com autenticação Manus, banco Drizzle, geração via LLM server-side e fluxo de aprovação humana.

| Base solicitada | Equivalência no projeto |
| --- | --- |
| `backend/main.py` | Adaptador FastAPI de referência em `backend/main.py`; o runtime oficial permanece Express/tRPC. |
| `backend/routers/instagram.py` | Contrato de leitura Meta/Instagram, sem publicação automática. |
| `backend/routers/google_auth.py` | Contrato para OAuth Google futuro; credenciais devem ser configuradas no gerenciador de segredos. |
| `backend/routers/analytics.py` | Contrato para leitura de métricas GA4. |
| `backend/routers/ads.py` | Contrato para recomendações de Google Ads, com ativação condicionada à aprovação. |
| `backend/routers/merchant.py` | Contrato de leitura de catálogo Merchant Center. |
| `backend/routers/chat.py` | Identidade do agente FLUX para arquétipos, posts e recomendações. |
| `frontend/index.html` | Referência mínima; a interface de produção está em `client/`. |

As variáveis externas esperadas pela arquitetura são `ANTHROPIC_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GA4_PROPERTY_ID`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `MERCHANT_CENTER_ID`, `META_ACCESS_TOKEN` e `META_BUSINESS_ACCOUNT_ID`. Nenhum valor deve ser commitado; as integrações devem ser adicionadas somente após confirmação do provedor e configuração segura.

## Regras de operação

O agente FLUX sugere arquétipos, posts, campanhas e recomendações. Conteúdos entram como rascunho e precisam ser aprovados, devolvidos para ajuste ou arquivados. Esta camada não publica diretamente em Instagram, TikTok, Pinterest ou qualquer rede social.
