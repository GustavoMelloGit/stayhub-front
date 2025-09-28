type FormatOptions = {
  isCents: boolean;
};
const defaultOptions: FormatOptions = {
  isCents: true,
};

export class Currency {
  static format(
    amount: number,
    options: FormatOptions = defaultOptions
  ): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(options.isCents ? amount / 100 : amount);
  }
}
