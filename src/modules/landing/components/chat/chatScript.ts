import type { TranslateFn } from '@/i18n/useTranslation';

export type DemoTab = 'audio' | 'photo' | 'text';

export type DemoMessage =
  | {
      id: string;
      from: 'user';
      kind: 'voice';
      duration: string;
      transcript: string;
    }
  | {
      id: string;
      from: 'user';
      kind: 'photo';
      fileName: string;
      caption: string;
    }
  | { id: string; from: 'user'; kind: 'text'; text: string }
  | { id: string; from: 'sogio'; kind: 'text'; text: string };

export interface DemoAct {
  tab: DemoTab;
  messages: [DemoMessage, DemoMessage];
}

/**
 * Os três atos da demonstração, na ordem em que rodam: áudio, foto e pergunta.
 * Cada ato termina com uma resposta que contém um número — é o que separa
 * "chat bonitinho" de "isso resolve o meu problema".
 */
export const buildDemoActs = (t: TranslateFn): DemoAct[] => [
  {
    tab: 'audio',
    messages: [
      {
        id: 'audio-user',
        from: 'user',
        kind: 'voice',
        duration: t('demo.acts.audio.duration'),
        transcript: t('demo.acts.audio.transcript'),
      },
      {
        id: 'audio-sogio',
        from: 'sogio',
        kind: 'text',
        text: t('demo.acts.audio.reply'),
      },
    ],
  },
  {
    tab: 'photo',
    messages: [
      {
        id: 'photo-user',
        from: 'user',
        kind: 'photo',
        fileName: t('demo.acts.photo.attachment'),
        caption: t('demo.acts.photo.caption'),
      },
      {
        id: 'photo-sogio',
        from: 'sogio',
        kind: 'text',
        text: t('demo.acts.photo.reply'),
      },
    ],
  },
  {
    tab: 'text',
    messages: [
      {
        id: 'text-user',
        from: 'user',
        kind: 'text',
        text: t('demo.acts.text.question'),
      },
      {
        id: 'text-sogio',
        from: 'sogio',
        kind: 'text',
        text: t('demo.acts.text.reply'),
      },
    ],
  },
];

export const flattenActs = (acts: DemoAct[]): DemoMessage[] =>
  acts.flatMap(act => act.messages);

/** Qual aba está ativa para um índice da sequência achatada (2 mensagens por ato). */
export const tabForIndex = (acts: DemoAct[], index: number): DemoTab =>
  acts[Math.min(Math.floor(index / 2), acts.length - 1)].tab;
