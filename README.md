# E AGORA, DEUS? — Seminário Diocesano São José

PWA de evangelização, reflexão e discernimento vocacional.

## Estrutura inicial
- `index.html`: páginas e navegação da aplicação.
- `css/styles.css`: identidade visual e estilos responsivos.
- `js/app.js`: navegação e interacções iniciais.
- `manifest.json`: metadados de instalação PWA.
- `service-worker.js`: cache da aplicação pública.
- `assets/icons/icon.svg`: ícone vectorial.

## Desenvolvimento
A aplicação é estática e não exige processo de build. Para testar localmente, servir esta pasta através de um servidor HTTP local. O service worker só funciona em contexto seguro (HTTPS ou localhost).

## Segurança e funcionalidades ainda não activas
O formulário de mensagens está deliberadamente desactivado até existir backend configurado e testado. Não são guardadas mensagens no browser. Não colocar chaves privadas ou credenciais neste repositório.

O cache offline destina-se apenas à estrutura pública da aplicação. Não adicionar endpoints de autenticação, APIs ou mensagens ao service worker.

## Publicação
Pode ser publicada como site estático no Cloudflare Pages, ligando este repositório GitHub. Não é necessário comando de build; a pasta de saída é a raiz do projecto (`/`).
