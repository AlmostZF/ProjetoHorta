# 🌿 Projeto Horta Comunitaria
![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-green)

Uma aplicação web moderna desenvolvida com Angular para a gestão e monitorização de hortas comunitárias.
> **O que é uma Horta Comunitária?** > São espaços urbanos ou rurais, disponibilizados pela prefeitura, onde grupos de pessoas cultivam alimentos de forma coletiva. Este projeto visa unir sustentabilidade e tecnologia ao digitalizar essa gestão, permitindo que produtores locais organizem seus estoques e facilitando para que a comunidade reserve alimentos frescos de forma eficiente

## ✨ Funcionalidades:

### 👨‍🌾 Para Vendedores (Gestão)
* **Dashboard em Tempo Real:** Visualização de métricas de vendas com resumos mensais e anuais, utilizando **RxJS** para processamento de dados em tempo real.
* **Verificação de Reservas:** Painel de controle para validação de pedidos via código de reserva.
* **Gestão de Estoque:** Cadastro, edição e monitoramento completo dos produtos ofertados na pelo vendedor.

### 🥗 Para Consumidores
* **Vitrine Digital:** Navegação simplificada pelos produtos disponíveis.
* **Sistema de Reservas:** Interface direta para que usuários possam reservar itens frescos para retirada.
* **Filtragem de Itens:** Busca avançada e filtragem dinâmica por categoria e disponibilidade.

<!-- 📸 Demonstração 
  TODO: Adicionar um GIF da aplicação 
  -->
---
## 🚀 Tecnologias Utilizadas

| Tecnologia | Ícone | Descrição |
| :--- | :---: | :--- |
| **Angular** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg" width="25"> | Framework base para construção da SPA. |
| **TypeScript** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="25"> | Superset JS para tipagem estática e segurança. |
| **Tailwind CSS** | <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" width="25"> | Estilização utilitária para interfaces responsivas. |
| **SCSS** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg" width="25"> | Pré-processador CSS para estilizações e variáveis avançadas. |
| **RxJS** | <img src="https://raw.githubusercontent.com/reactivex/rxjs/master/src/internal/logo/logo.png" width="25"> | Programação reativa para gestão de fluxos de dados. |


## 📂 Estrutura de Pastas

A organização segue o padrão modular para garantir manutenibilidade e escalabilidade:

```text
src/app/
├── components/     # Componentes de UI reutilizáveis
├── pages/          # Componentes de página (Rotas principais)
├── services/       # Lógica de negócio e consumo de APIs
├── models/         # Interfaces e definições de tipos TypeScript
├── shared/         # Pipes, diretivas e módulos globais
├── guards/         # Proteção de rotas (Auth Guard)
└── interceptors/   # Lógica de Refresh Token e headers HTTP
```



## 🛠️ Instalação e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20+)
- [Angular CLI](https://angular.io/cli) (versão 17+ ) ```npm install -g @angular/cli```
Para rodar o projeto localmente, siga os passos abaixo:

1. **Clonar o repositório:**
   
   ```bash
   git clone https://github.com/AlmostZF/ProjetoHorta.git
   ```

2. **Instalar as dependências:**
   ``` bash
   npm install
   ```
   

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   ng serve
   ```

4. **Acessar no navegador:**
   Abra o endereço [http://localhost:4200/](http://localhost:4200/)

---

## 🛡️ Detalhes Técnicos Avançados

* Segurança: Implementação de Guards para restringir o acesso administrativo apenas a usuários autenticados.
* Resiliência: Uso de Interceptors para capturar erros de autenticação e realizar a renovação automática do token (Refresh Token).
* Performance: Interface totalmente responsiva construída com Tailwind CSS, otimizada para dispositivos móveis e desktop.
---

## 📝 Considerações Finais
O projeto foi desenvolvido em colaboração direta com os **vendedores de uma horta comunitária**, visando sanar dificuldades reais de controle de estoque e ampliar a divulgação de seu trabalho. Essa parceria garantiu que a ferramenta fosse construída com foco total na usabilidade e nas necessidades práticas do dia a dia.

Desenvolvido por [Guilherme](https://github.com/AlmostZF)
