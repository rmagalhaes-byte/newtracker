# New-Tracker (RSMM)

Tracker para **acompanhamento de atividades, prazos e status** do trabalho/projeto RSMM, com uma base simples em HTML/CSS/JS e uma estrutura de pastas para você ir adicionando os conteúdos a serem apresentados.

## Como executar

- Opção mais simples: abrir o arquivo `index.html` no navegador.
- Se preferir um servidor local (evita problemas com paths), use qualquer servidor estático (ex.: Live Server no VS Code/Cursor).

## Estrutura sugerida do repositório

- **`index.html`**: página principal do tracker
- **`style.css`**: estilos
- **`app.js` / `data.js`**: lógica e dados do tracker
- **`designer.md`**: guia de identidade visual (cores/tipografia/layout)
- **`data/`**: dados auxiliares (ex.: CSVs, exports, backups)
- **`docs/`**: materiais do trabalho (texto, referências, prints e entregáveis)
  - **`docs/entregaveis/`**: versões finais a apresentar/entregar (PDF, DOCX, etc.)
  - **`docs/referencias/`**: links, artigos, bibliografia e notas
  - **`docs/prints/`**: imagens/prints do progresso, telas e evidências
- **`assets/`**: imagens, ícones e recursos estáticos usados pelo tracker
- **`src/`**: código adicional (se quiser evoluir para uma estrutura mais modular)

## Como organizar os conteúdos do trabalho

- Coloque **os entregáveis finais** em `docs/entregaveis/`.
- Guarde **referências e notas** em `docs/referencias/`.
- Salve **prints/evidências** (antes/depois, progresso, testes) em `docs/prints/`.
- Se o tracker consumir arquivos externos (CSV/JSON), coloque em `data/`.

## Repositório remoto

Este projeto está preparado para usar o repositório GitHub `rmagalhaes-byte/newtracker`.

