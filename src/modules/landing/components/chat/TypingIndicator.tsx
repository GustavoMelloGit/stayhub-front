import { motion } from 'motion/react';

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.94 }}
    transition={{ duration: 0.2 }}
    className='bg-lp-bubble-in border-lp-border inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border px-4 py-3.5'
  >
    {[0, 1, 2].map(index => (
      <motion.span
        key={index}
        className='bg-lp-muted size-2 rounded-full'
        animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          delay: index * 0.16,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);
