# PlannedGoal

**Educador financeiro desenvolvido com React, TypeScript e Inteligência Artificial.**

O **PlannedGoal** é uma aplicação de educação financeira que utiliza inteligência artificial para ajudar usuários a planejarem e alcançarem suas metas financeiras de forma mais consciente e organizada.

O usuário informa dados como:

* Renda mensal;
* Custos fixos;
* Dívidas e parcelas;
* Valor da meta;
* Prazo para alcançar a meta.

Com base nessas informações, a aplicação utiliza a **API do Gemini** para gerar uma análise personalizada, indicando se a meta é viável e fornecendo **insights e sugestões práticas** para ajudar o usuário a alcançá-la.

## Tecnologias

* React
* Vite
* TypeScript
* Tailwind CSS
* API do Google Gemini
* Inteligência Artificial

## Configuração da API do Gemini na Vercel

A chave do Gemini deve ser configurada na Vercel como variável de ambiente `GEMINI_API_KEY` para os ambientes necessários (Production, Preview e/ou Development). Não use o prefixo `VITE_`: variáveis com esse prefixo são incorporadas ao código do navegador.

O endpoint serverless `api/insight.ts` chama o Gemini no servidor. O front-end envia o prompt para `/api/insight` e não recebe nem envia a chave. Após configurar a variável, faça um novo deploy para aplicar a alteração.

Para testar localmente a função `/api/insight`, use `vercel dev` na raiz do projeto (depois de vincular a pasta ao projeto Vercel e disponibilizar a variável `GEMINI_API_KEY` no ambiente Development). `npm run dev` inicia apenas o Vite e não executa funções serverless, então `/api/insight` retorna 404 nesse modo.

## Sobre o projeto

O projeto foi desenvolvido durante o curso **Santander 2026 - AI React Front-end**, utilizando como base a estrutura apresentada ao longo do curso.

O projeto original utilizado como referência pode ser encontrado no repositório da **Digital Innovation One**:

https://github.com/digitalinnovationone/planejai

A partir dessa estrutura, o PlannedGoal foi desenvolvido e adaptado como um projeto próprio, com foco em planejamento e educação financeira.

## Próximos passos

O projeto ainda está em desenvolvimento e possui algumas funcionalidades planejadas para as próximas versões:

* **Histórico de simulações:** permitir que o usuário armazene e consulte suas simulações financeiras anteriores.
* **Chatbot com IA:** adicionar um chatbot integrado ao Gemini para que o usuário possa conversar diretamente com a inteligência artificial, tirar dúvidas e receber orientações relacionadas à sua vida financeira.

## Objetivo

O objetivo do PlannedGoal é tornar o planejamento de metas financeiras mais simples e acessível, utilizando inteligência artificial para transformar os dados financeiros do usuário em uma análise personalizada e orientações práticas.
