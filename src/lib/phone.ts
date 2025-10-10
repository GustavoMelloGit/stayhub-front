export class Phone {
  static MASK = '+55 (99) 99999-9999';
  static toHumanReadable(phone: string): string {
    return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  }
  static toAPI(phone: string): string {
    return phone.replace(/\D/g, '');
  }
  static isValid(phone: string): boolean {
    const onlyNumbers = phone.replace(/\D/g, '');

    return onlyNumbers.length === 13;
  }
}
