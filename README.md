# Aman Sharma · Experience Systems

This repository contains the source for Aman Sharma's portfolio and knowledge hub, now powered by a Next.js application. The project also hosts the research showcase for Zhang Teslendia and a collection of interactive demos and documents served as static assets.

## Getting started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:3000](http://localhost:3000). The main landing page lives at `/` and the research showcase is available at `/blog`.

To build the production bundle run:

```bash
npm run build
npm start
```

## Project structure

- `app/` – Next.js App Router pages and route-specific styles.
  - `page.jsx` – main portfolio experience rebuilt with React components.
  - `blog/` – research showcase route with dedicated layout and styling.
- `public/` – static assets that Next.js serves verbatim, including legacy demos, resume, and detailed blog posts.
- `next.config.mjs` – Next.js configuration.
- `package.json` – project metadata and scripts.

## Static assets

The previous standalone HTML, CSS, and JavaScript files are now located under `public/`. Any existing links to demos or documents (for example `/demo/...` or `/resume/index.html`) continue to work as before.

## Scripts

- `npm run dev` – start the development server.
- `npm run build` – generate an optimized production build.
- `npm start` – run the built application.

## On-demand expression interpreter

The app exposes a lightweight interpreter that can evaluate arithmetic expressions straight from the URL. Requesting
`/interpreter/<expression>` responds with a JSON payload containing the evaluated result. Because the expression lives in the
path, remember to URL-encode special characters such as `+` or spaces. For example:

```
/interpreter/2*5    -> { "result": 10 }
/interpreter/1%2B2  -> { "result": 3 }
```

Supported operators include addition (`+`), subtraction (`-`), multiplication (`*`), division (`/`), and parentheses.

Feel free to adapt the content and data inside `app/page.jsx` or `app/blog/page.jsx` to keep the site up to date.
