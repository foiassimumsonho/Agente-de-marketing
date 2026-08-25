# Project TODO

- [x] Criar dashboard central com calendário editorial, desempenho por canal, conteúdos pendentes e próximos relatórios (MVP)
- [x] Criar configuração de perfis de negócio multissetoriais com segmento, público-alvo, tom de voz, objetivos e canais ativos (formulário MVP)
- [x] Criar geração de ideias, legendas, hashtags, roteiros e formatos para Instagram, TikTok e Pinterest (MVP de geração)
- [x] Criar análise comparativa de métricas por rede, conteúdo, formato, tema e horário (estrutura de métricas e comparação de canais no MVP)
- [x] Criar recomendações acionáveis para campanhas e anúncios baseadas em objetivos e métricas (insights iniciais no dashboard)
- [x] Criar CRM com contatos e oportunidades vinculados a ações de marketing (schema e procedures MVP)
- [x] Criar relatórios com resultados, aprendizados e prioridades recomendadas (modelo e agenda inicial)
- [x] Implementar regras do fluxo obrigatório de revisão: rascunho, aprovação, devolução para ajuste e arquivamento
- [x] Impedir publicação automática ou conexão que publique diretamente nas redes sociais
- [x] Criar interface responsiva com direção visual elegante, refinada e consistente
- [x] Modelar tabelas e procedimentos protegidos para perfis, conteúdos, métricas, campanhas, CRM e relatórios
- [x] Implementar testes Vitest para regras de aprovação e arquivamento
- [x] Validar build, tipos, testes e estados de carregamento/erro da interface

## Próxima rodada

- [x] Implementar widget editorial inicial no dashboard e listar próximo relatório
- [x] Criar formulário real para criar perfis de negócio conectado à mutação (edição fica como extensão)
- [x] Persistir conteúdos gerados pela IA como rascunhos e tratar erro de JSON
- [x] Substituir a base de métricas por consulta agregada real e manter fallback visual do MVP para workspace vazio
- [x] Adicionar UI de aprovação e devolução na fila; arquivamento disponível no contrato protegido
- [x] Criar tabela e procedures de campanhas, além de procedures dedicados para CRM e relatórios
- [x] Adicionar teste de isolamento por usuário e estados de carregamento/erro; estado vazio tratado com fallback orientativo

## Redirecionamento de produto

- [x] Remover calendário editorial da navegação, dashboard e textos da plataforma
- [x] Reposicionar dashboard para criação de posts e identidade de marca
- [x] Criar gerador de arquétipo com personalidade, valores, desejos, medos, voz e diretrizes de comunicação
- [x] Criar formulário para briefing do arquétipo por segmento, público, diferencial e objetivo
- [x] Adaptar sugestões de posts para gerar variações para Instagram, TikTok e Pinterest; integração contextual com arquétipo preparada
- [x] Atualizar testes, validação visual e checkpoint da nova experiência

## Adaptação para flux-marketing

- [x] Documentar equivalência entre a base flux-marketing e o scaffold atual
- [x] Criar estrutura backend/routers equivalente para FastAPI/integrações como camada organizacional
- [x] Criar frontend/index.html de referência sem duplicar o app React principal
- [x] Criar Procfile, railway.json e README de compatibilidade; variáveis documentadas sem editar arquivos de segredos
- [x] Preservar o agente FLUX como conceito de orquestração para arquétipo, posts e revisão
- [x] Validar que a adaptação não habilita publicação automática

## Substituição efetiva pela base enviada

- [x] Tornar a base real do repositório FLUX a estrutura principal de execução do projeto
- [x] Remover a dependência operacional do runtime React/Express como interface principal
- [x] Promover os routers FastAPI reais do repositório para endpoints funcionais de integrações e agente FLUX
- [x] Substituir `frontend/index.html` pela interface completa real do FLUX
- [x] Ajustar Procfile e railway.json para execução FastAPI
- [x] Validar a migração com smoke test FastAPI e manter publicação automática desabilitada

## Importação do repositório GitHub

- [x] Acessar `git@github.com:foiassimumsonho/Agente-de-marketing.git` via HTTPS após a autenticação SSH ser recusada
- [x] Inspecionar branch `main`, pacote ZIP e estrutura do repositório recebido
- [x] Substituir a camada `flux-marketing/` pelo conteúdo real extraído do repositório
- [x] Validar backend Python por compilação e validar TypeScript, testes e regras de aprovação do painel
- [x] Salvar checkpoint baseado no repositório importado

## Confirmação da troca de runtime

- [x] Substituir o processo Node/React pelo processo FastAPI confirmado pelo usuário
- [x] Promover o `frontend/index.html` real do pacote para a entrada principal
- [x] Ajustar caminhos de importação dos routers e arquivos estáticos
- [x] Validar a inicialização FastAPI com porta de teste e servir a interface na raiz
- [x] Documentar a troca do preview Node pelo runtime FastAPI e preparar checkpoint da substituição
