import { z } from 'zod';

/**
 * Faixas de portfólio oferecidas como botões, não como campo livre: no público
 * da landing (50+, quase sempre no celular) cada campo digitado custa
 * conversão, e a faixa já basta para separar o anfitrião de um imóvel do
 * multiproprietário.
 */
export const PROPERTY_COUNT_RANGES = ['1', '2-3', '4-10', '10+'] as const;

export type PropertyCountRange = (typeof PROPERTY_COUNT_RANGES)[number];

/** Aceita o WhatsApp com máscara e valida só os dígitos: 10 (fixo) ou 11 (móvel). */
const whatsappSchema = z
  .string()
  .transform(value => value.replace(/\D/g, ''))
  .refine(digits => digits.length === 10 || digits.length === 11, {
    message: 'invalidWhatsapp',
  });

export const waitlistFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'invalidName' }),
  whatsapp: whatsappSchema,
  propertyCount: z.enum(PROPERTY_COUNT_RANGES, { message: 'invalidCount' }),
});

export type WaitlistFormData = z.input<typeof waitlistFormSchema>;
export type WaitlistPayload = z.output<typeof waitlistFormSchema>;

export const waitlistResponseSchema = z.object({
  id: z.string().optional(),
  position: z.number().int().positive().optional(),
});

export type WaitlistResponse = z.infer<typeof waitlistResponseSchema>;
