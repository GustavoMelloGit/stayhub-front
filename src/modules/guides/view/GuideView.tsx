import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { LandingCta } from '@/modules/landing/components/LandingCta';
import { findGuide, GUIDES } from '../service/guides';
import { GuideShell } from '../components/GuideShell';
import { useGuideSeo } from '../seo/useGuideSeo';

const GuideView = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = findGuide(slug);

  const breadcrumb = useMemo(
    () => [
      { name: 'Início', path: ROUTES.landing },
      { name: 'Guias', path: ROUTES.guides },
      ...(guide ? [{ name: guide.title, path: ROUTES.guide(guide.slug) }] : []),
    ],
    [guide]
  );

  const article = useMemo(
    () => (guide ? { updatedAt: guide.updatedAt } : undefined),
    [guide]
  );

  useGuideSeo({
    title: guide?.title ?? 'Guia não encontrado',
    description: guide?.description ?? '',
    path: guide ? ROUTES.guide(guide.slug) : ROUTES.guides,
    article,
    breadcrumb,
  });

  if (!guide) return <Navigate to={ROUTES.guides} replace />;

  const outros = GUIDES.filter(item => item.slug !== guide.slug).slice(0, 3);

  return (
    <GuideShell>
      <article className='mx-auto w-full max-w-3xl px-5 pt-28 pb-12 md:px-8 md:pt-36 md:pb-16'>
        <Link
          to={ROUTES.guides}
          className='text-lp-muted hover:text-lp-text inline-flex min-h-11 items-center gap-2 text-base transition-colors'
        >
          <ArrowLeft className='size-4' aria-hidden />
          Todos os guias
        </Link>

        <h1 className='text-lp-text mt-4 text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl'>
          {guide.title}
        </h1>

        <p className='text-lp-muted mt-4 text-lg md:text-xl'>
          {guide.description}
        </p>

        <p className='text-lp-muted mt-4 text-sm'>
          <time dateTime={guide.updatedAt}>
            Revisado em{' '}
            {new Date(`${guide.updatedAt}T12:00:00`).toLocaleDateString(
              'pt-BR',
              { day: '2-digit', month: 'long', year: 'numeric' }
            )}
          </time>
          {' · '}
          {guide.readingMinutes} min de leitura
        </p>

        {/* O HTML vem do Markdown do próprio repositório, convertido no build:
            não há entrada de terceiro nesta string. */}
        <div
          className='lp-prose mt-10'
          dangerouslySetInnerHTML={{ __html: guide.html }}
        />

        <aside className='border-lp-border bg-lp-band mt-14 rounded-2xl border p-6 md:p-8'>
          <h2 className='text-lp-text text-2xl font-bold md:text-3xl'>
            Pare de refazer essa conta na mão
          </h2>
          <p className='text-lp-muted mt-3 text-base md:text-lg'>
            Sogio lança receitas e despesas a partir de um áudio ou da foto de
            uma nota, e responde quanto cada imóvel deu de lucro. As 50
            primeiras pessoas pagam R$ 25 por mês no primeiro ano.
          </p>
          <LandingCta
            href={`${ROUTES.landing}#lista`}
            className='mt-6 w-full sm:w-auto'
          >
            Quero largar a planilha
          </LandingCta>
        </aside>

        {outros.length > 0 && (
          <nav className='mt-14' aria-label='Outros guias'>
            <h2 className='text-lp-text text-xl font-semibold md:text-2xl'>
              Continue lendo
            </h2>
            <ul className='mt-4 flex flex-col gap-3'>
              {outros.map(item => (
                <li key={item.slug}>
                  <Link
                    to={ROUTES.guide(item.slug)}
                    className='border-lp-border bg-lp-surface hover:border-lp-brand block rounded-2xl border p-5 transition-colors'
                  >
                    <span className='text-lp-text block text-lg font-semibold'>
                      {item.title}
                    </span>
                    <span className='text-lp-muted mt-1 block text-base'>
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </GuideShell>
  );
};

export default GuideView;
