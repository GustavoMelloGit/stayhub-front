/**
 * Pré-renderização da landing page.
 *
 * Roda depois do `vite build`. Sobe o `dist/` num servidor estático local,
 * visita as rotas públicas com um navegador de verdade e grava o HTML já
 * renderizado por cima dos arquivos do build.
 *
 * O navegador produz o `<body>`, e só ele. O `<head>` é gerado aqui, por
 * `renderHead`, a partir do frontmatter dos guias e dos arquivos de tradução —
 * e substitui por inteiro o que o React tiver montado. Antes o SEO era o que
 * sobrasse de um `useEffect` no momento do snapshot: uma tag esquecida ou um
 * efeito que não disparasse saíam como página sem meta, sem erro de build.
 *
 * Por que um navegador em vez de SSG: o app é uma SPA com React Router 7, e o
 * `vite-react-ssg` ainda declara peer de `react-router-dom ^6`. O Playwright já
 * era devDependency do projeto, então esta rota custa zero dependência nova e
 * funciona com qualquer coisa que rode no cliente.
 *
 * O navegador roda com `prefers-reduced-motion: reduce`, e a landing usa essa
 * mesma preferência para renderizar tudo em seu estado final — é assim que o
 * HTML estático sai com o conteúdo visível, e não com `opacity: 0`.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
// Compilado de `src/seo/node.ts` pelo passo `build:seo`. É o que garante que o
// HTML estático e o navegador montem o `<head>` a partir do mesmo builder.
import {
  buildGuideHead,
  buildLandingHead,
  guideBreadcrumb,
  GUIDES_INDEX,
  GUIDES_INDEX_BREADCRUMB,
  MANAGED_ATTR,
  renderHead,
} from '../dist-seo/node.js';

/**
 * Abre o navegador.
 *
 * No Linux da Vercel o Chromium do Playwright não sobe: a imagem de build é
 * Amazon Linux e não traz as bibliotecas de sistema que ele precisa
 * (`libnspr4.so` e companhia). Instalá-las exigiria root, que o build não dá.
 *
 * `@sparticuz/chromium` é um Chromium empacotado para plataformas serverless,
 * com essas bibliotecas junto. Fora da Vercel, segue valendo o binário normal
 * do Playwright, que é o que roda em desenvolvimento e nos testes.
 */
const launchBrowser = async () => {
  if (!process.env.VERCEL) return chromium.launch();

  const { default: serverless } = await import('@sparticuz/chromium');

  return chromium.launch({
    // `--single-process` vem afinado para o Lambda, onde a memória é apertada,
    // e é conhecido por travar o Playwright. O container de build não tem essa
    // restrição, então sai da lista.
    args: serverless.args.filter(arg => arg !== '--single-process'),
    executablePath: await serverless.executablePath(),
    headless: true,
  });
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = 4319;

const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://www.sogio.app').replace(
  /\/$/,
  ''
);

/**
 * Tradutor de leitura direta sobre o JSON do idioma.
 *
 * Os builders só pedem chaves de `meta` e `faq`, nenhuma delas com
 * interpolação, então um `reduce` por caminho basta e evita subir o i18next em
 * Node. A chave ausente estoura o build de propósito: uma `meta` vazia passaria
 * despercebida até alguém olhar o resultado da busca.
 */
const loadTranslator = async language => {
  const file = join(ROOT, `src/i18n/locales/${language}/landing.json`);
  const dictionary = JSON.parse(await readFile(file, 'utf8'));

  return key => {
    const value = key
      .split('.')
      .reduce((node, part) => (node == null ? node : node[part]), dictionary);

    if (typeof value !== 'string') {
      throw new Error(
        `[prerender] chave de tradução ausente em ${language}: "${key}"`
      );
    }

    return value;
  };
};

/** Rotas públicas fixas que precisam existir como HTML estático. */
const buildStaticPages = async () => {
  const [pt, en] = await Promise.all([
    loadTranslator('pt'),
    loadTranslator('en'),
  ]);

  return [
    {
      path: '/',
      output: 'index.html',
      changefreq: 'weekly',
      priority: '1.0',
      head: buildLandingHead({ siteUrl: SITE_URL, language: 'pt', t: pt }),
    },
    {
      path: '/en',
      output: 'en/index.html',
      changefreq: 'weekly',
      priority: '0.8',
      lang: 'en',
      head: buildLandingHead({ siteUrl: SITE_URL, language: 'en', t: en }),
    },
    {
      path: '/guias',
      output: 'guias/index.html',
      changefreq: 'weekly',
      priority: '0.7',
      head: buildGuideHead({
        siteUrl: SITE_URL,
        title: GUIDES_INDEX.title,
        description: GUIDES_INDEX.description,
        path: '/guias',
        breadcrumb: GUIDES_INDEX_BREADCRUMB,
      }),
    },
  ];
};

/**
 * Descobre os guias pelo sistema de arquivos em vez de importar o registro do
 * app: este script roda em Node puro, sem o pipeline do Vite que converte os
 * `.md`. O nome do arquivo é a fonte da verdade do slug.
 */
const discoverGuides = async () => {
  const dir = join(ROOT, 'src/content/guides');
  if (!existsSync(dir)) return [];

  const files = (await readdir(dir)).filter(name => name.endsWith('.md'));

  return Promise.all(
    files.map(async name => {
      const slug = name.replace(/\.md$/, '');
      const source = await readFile(join(dir, name), 'utf8');
      const field = key =>
        new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(source)?.[1]?.trim();

      const title = field('title') ?? slug;
      const description = field('description') ?? '';
      const updatedAt = field('updatedAt');

      if (!updatedAt) {
        throw new Error(`[prerender] ${name} não declara "updatedAt".`);
      }

      const path = `/guias/${slug}`;

      return {
        path,
        output: `guias/${slug}/index.html`,
        changefreq: 'monthly',
        priority: '0.6',
        title,
        description,
        head: buildGuideHead({
          siteUrl: SITE_URL,
          title,
          description,
          path,
          article: { updatedAt },
          breadcrumb: guideBreadcrumb(slug, title),
        }),
      };
    })
  );
};

/** Crawlers de IA liberados explicitamente — sem isso vários assumem bloqueio. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'Bytespider',
  'meta-externalagent',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const startServer = () =>
  new Promise(resolveServer => {
    const server = createServer((request, response) => {
      const url = new URL(request.url, `http://localhost:${PORT}`);
      const filePath = join(DIST, decodeURIComponent(url.pathname));

      // O fallback é a casca intocada, não o `index.html`: a landing é a
      // primeira página do laço e sobrescreve o `index.html` antes das
      // demais. Servi-lo como fallback faria cada guia herdar o `<head>` da
      // landing, JSON-LD incluído. É também o que a Vercel faz em produção,
      // onde todo caminho não estático é reescrito para `/app.html`.
      const target =
        existsSync(filePath) && statSync(filePath).isFile()
          ? filePath
          : join(DIST, 'app.html');

      response.writeHead(200, {
        'Content-Type': MIME[extname(target)] ?? 'application/octet-stream',
      });
      createReadStream(target).pipe(response);
    });

    server.listen(PORT, () => resolveServer(server));
  });

const writeSitemap = async pages => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(page => {
      const loc = `${SITE_URL}${page.path}`;
      const linhas = [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
      ];

      // Só a landing tem versão em outro idioma; declarar alternativa para um
      // guia que existe só em português seria mentira para o buscador.
      if (page.path === '/' || page.path === '/en') {
        linhas.push(
          `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE_URL}/" />`,
          `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}/en" />`,
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`
        );
      }

      linhas.push('  </url>');
      return linhas.join('\n');
    })
    .join('\n');

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
};

/**
 * Rotas sem valor de busca. `/app` vai sem barra final de propósito: com
 * `/app/` a regra não casa com `/app`, que é justamente a URL do produto.
 */
const DISALLOWED = [
  '/app',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/connect',
  '/stay/',
];

const writeRobots = async () => {
  // Cada `User-agent` repete a lista porque um robô obedece só ao grupo mais
  // específico que casa com ele: um bloco com apenas `Allow: /` não herda os
  // `Disallow` do grupo `*`.
  const rules = ['Allow: /', ...DISALLOWED.map(path => `Disallow: ${path}`)];

  const groups = ['*', ...AI_CRAWLERS].map(agent =>
    [`User-agent: ${agent}`, ...rules].join('\n')
  );

  const robots = [...groups, `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n\n');

  await writeFile(join(DIST, 'robots.txt'), robots, 'utf8');
};

const writeLlmsTxt = async guias => {
  const llms = `# Sogio

> Gestão de imóveis de aluguel por temporada por conversa. O anfitrião manda um áudio, uma foto da nota ou uma pergunta, e Sogio lança a receita, arquiva a despesa e responde quanto cada imóvel deu de lucro, sem planilha e sem aprender um sistema novo.

Para quem: pessoas que cuidam de 1 a 15 imóveis de temporada (Airbnb, Booking ou aluguel direto), incluindo quem não tem familiaridade com software de gestão.

Estado atual: o painel web Sogio está em produção. A versão conversacional está em construção e entra por lista de espera.

Preço: R$ 35 por mês quando abrir ao público. As 50 primeiras pessoas da lista pagam R$ 25 por mês nos 12 primeiros meses. Os primeiros 15 dias são gratuitos nos dois casos.

## Páginas

- [Landing page (pt-BR)](${SITE_URL}/): proposta, demonstração da conversa, objeções e perguntas frequentes.
- [Landing page (en)](${SITE_URL}/en): a mesma página em inglês.
- [Entrar no painel](${SITE_URL}/login): acesso ao produto para quem já é cliente.
- [Guias](${SITE_URL}/guias): conteúdo aberto sobre gestão de aluguel por temporada.
${guias}

## O que Sogio faz

- Registra receitas e despesas a partir de áudio, foto de comprovante ou mensagem de texto.
- Concilia reservas de Airbnb, Booking e aluguel direto.
- Responde perguntas sobre lucro, ocupação, despesas e valores a receber, com números.
- Confirma o que entendeu antes de gravar qualquer valor.
- Exporta os dados e permite apagar a conta a qualquer momento.
`;

  await writeFile(join(DIST, 'llms.txt'), llms, 'utf8');
};

const main = async () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('dist/index.html não existe — rode `vite build` antes.');
  }

  // Guarda a casca intocada da SPA antes de sobrescrever o index.html com a
  // landing. `vercel.json` aponta todas as rotas não estáticas para cá, para
  // que `/app` nunca pisque o conteúdo da landing antes de montar.
  const shell = await readFile(join(DIST, 'index.html'), 'utf8');
  await writeFile(join(DIST, 'app.html'), shell, 'utf8');

  const [staticPages, guides] = await Promise.all([
    buildStaticPages(),
    discoverGuides(),
  ]);
  const pages = [...staticPages, ...guides];

  const server = await startServer();

  let browser;
  try {
    browser = await launchBrowser();
  } catch (cause) {
    server.close();
    throw new Error(
      'Não foi possível abrir o Chromium para pré-renderizar. Em ambiente ' +
        'local, rode `npx playwright install chromium`. Na Vercel, o binário ' +
        'vem de `@sparticuz/chromium`: veja `launchBrowser` neste arquivo.',
      { cause }
    );
  }

  try {
    for (const page of pages) {
      const context = await browser.newContext({
        reducedMotion: 'reduce',
        viewport: { width: 1280, height: 900 },
        locale: page.lang === 'en' ? 'en-US' : 'pt-BR',
      });

      // O Clarity não deve entrar no HTML estático: o bundle o injeta em
      // runtime e teríamos duas tags do mesmo script.
      await context.route('**://*.clarity.ms/**', route => route.abort());

      const tab = await context.newPage();
      await tab.goto(`http://localhost:${PORT}${page.path}`, {
        waitUntil: 'networkidle',
      });
      // O `h1` só existe depois que a view montou, e vale para qualquer página
      // pública. Contar caracteres seria frágil: uma página de índice curta
      // reprovaria num limiar pensado para a landing.
      await tab.waitForSelector('main#conteudo h1', { timeout: 30_000 });

      await tab.evaluate(
        ({ headHtml, managedAttr, lang }) => {
          document
            .querySelectorAll('script[src*="clarity.ms"]')
            .forEach(node => node.remove());

          // O `Toaster` do sonner injeta ~15 KB de CSS no `<head>` em runtime,
          // e o injeta de novo quando o idioma muda. A landing nunca mostra
          // toast, e o bundle recria esse estilo ao montar — no HTML estático
          // ele é só peso.
          document.querySelectorAll('head style').forEach(node => {
            if (node.textContent?.includes('data-sonner-toaster')) {
              node.remove();
            }
          });

          // O `<head>` de SEO sai por inteiro e entra de novo vindo do Node.
          // A lista cobre também as tags estáticas do `index.html`, para o
          // resultado não depender de qual efeito rodou antes do snapshot.
          const substituidas = [
            `[${managedAttr}]`,
            'title',
            'meta[name="description"]',
            'meta[property^="og:"]',
            'meta[name^="twitter:"]',
            'link[rel="canonical"]',
            'link[rel="alternate"]',
            'script[type="application/ld+json"]',
          ];

          document.head
            .querySelectorAll(substituidas.join(','))
            .forEach(node => node.remove());

          document.head.insertAdjacentHTML('beforeend', headHtml);
          document.documentElement.lang = lang;
        },
        {
          headHtml: renderHead(page.head),
          managedAttr: MANAGED_ATTR,
          lang: page.head.lang,
        }
      );

      const html = await tab.content();
      const output = join(DIST, page.output);
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, html, 'utf8');

      console.log(`prerender: ${page.path} → dist/${page.output}`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  const listaDeGuias = guides
    .map(
      guide =>
        `- [${guide.title}](${SITE_URL}${guide.path}): ${guide.description}`
    )
    .join('\n');

  await Promise.all([
    writeSitemap(pages),
    writeRobots(),
    writeLlmsTxt(listaDeGuias),
  ]);
  console.log('prerender: sitemap.xml, robots.txt e llms.txt gerados');
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
