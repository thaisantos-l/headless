Desafio Técnico: Blog com Painel Headless

---

##  Executar o projeto

**Pré-requisitos:** Node 18+ e npm.

1. Clone o repo e entre na pasta.
2. Crie um arquivo **`.env.local`** na raiz com:
```

NEXT_PUBLIC_WP_BASE=[https://SEU-DOMINIO-WORDPRESS.com](https://SEU-DOMINIO-WORDPRESS.com)

````
3. Instale as dependências:
```bash
npm install
````

4. Desenvolvimento:

   ```bash
   npm run dev
   ```
5. Produção:

   ```bash
   npm run build
   npm run start
   ```

**Rotas**

* `/` — home (com paginação: `/pagina/2`, …)
* `/buscar?q=termo` — busca
* `/post/slug-do-post` — single
* `/sobre` e `/contato` — páginas informativas
* `/admin` — CRUD básico via JWT (opcional)

---

## API

* **WordPress REST API**: `/wp-json/wp/v2/...`
* **Autenticação** (criar/editar): **JWT** (plugin “JWT Authentication for WP REST API”)

---

## Configuração Wordpress

1. **Links permanentes**: *Configurações → Links permanentes* → **Nome do post**.
2. **JWT**

   * Instale o plugin **JWT Authentication for WP REST API**.
   * No `wp-config.php`, adicione uma chave secreta forte:

     ```php
     define('JWT_AUTH_SECRET_KEY', 'sua-chave-secreta-bem-grande-aqui');
     ```
   * Para gerar token (exemplo):

     ```
     POST /wp-json/jwt-auth/v1/token
     { "username": "admin", "password": "sua_senha" }
     ```

     Depois, envie nas requisições autenticadas:

     ```
     Authorization: Bearer SEU_TOKEN
     ```
3. **CORS + Authorization** (se precisar, no `.htaccess` do WP):

   ```apache
   RewriteEngine On
   RewriteCond %{HTTP:Authorization} ^(.*)
   RewriteRule ^(.*)$ - [E=HTTP_AUTHORIZATION:%1]

   <IfModule mod_headers.c>
     Header set Access-Control-Allow-Origin "https://SEU-FRONTEND.com"
     Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
     Header set Access-Control-Allow-Headers "Authorization, Content-Type"
   </IfModule>
   ```

---

##   **Gestão de conteúdo**

* **Acessar o painel**: `SEU-DOMINIO-WORDPRESS.com/wp-admin`
* **Posts → Adicionar novo**

  * **Título** e **Conteúdo** no editor (Gutenberg).
  * **Imagem destacada** (vira a thumb/capa no front).
  * **Categorias** e **Tags** (influenciam chips e listagens).
  * **Slug** (link do post) — o front usa esse slug.
  * **Publicar** (ou **Rascunho**/**Privado**).
* **Mídia → Biblioteca**: subir imagens e anexos.
* **Páginas**: crie/edite **Sobre** e **Contato** normalmente.
* **SEO (Yoast)**: ao editar post/página, preencha o bloco do **Yoast**:

  * **Título SEO** e **Meta descrição** (aparecem no `<head>` do front).
  * **Canonical**, **Open Graph/Twitter** e **Robots (noindex/nofollow)** se necessário.
  * Se marcar **noindex**, o front respeita (não indexar e não enviar no sitemap dinâmico).
* **Atualizar**: qualquer edição vira conteúdo novo no front (ISR/SSR cuida do refresh).

---

## SEO`



  * `sitemap.xml` gerado via **next-sitemap**.
  * `server-sitemap.xml` (dinâmico) lista os **posts publicados** e ignora o que estiver **noindex** no Yoast.









