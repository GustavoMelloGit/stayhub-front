import { useCallback } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/clarity';
import { LandingSection } from './LandingSection';
import { ChatDemo } from './chat/ChatDemo';

export const DemoSection = () => {
  const { t } = useTranslation('landing');

  const handleWatched = useCallback(() => {
    trackEvent('demo_watched');
  }, []);

  return (
    <LandingSection
      id='demonstracao'
      eyebrow={t('demo.eyebrow')}
      title={t('demo.title')}
      subtitle={t('demo.subtitle')}
      className='bg-lp-surface/40'
    >
      <div className='mx-auto w-full max-w-2xl'>
        <ChatDemo onWatched={handleWatched} />
      </div>
    </LandingSection>
  );
};
