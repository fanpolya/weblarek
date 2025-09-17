import { IBuyer, TPayment } from '../../types';

export class Buyer {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  setAllData(data: IBuyer): void {
    this._payment = data.payment;
    this._address = data.address;
    this._email = data.email;
    this._phone = data.phone;
  }

  set payment(value: TPayment) {
    this._payment = value;
  }

  set address(value: string) {
    this._address = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set phone(value: string) {
    this._phone = value;
  }

  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  validate(): { isValid: boolean; errors: Record<keyof IBuyer, string> } {
    const errors: Record<keyof IBuyer, string> = {
      payment: '',
      address: '',
      email: '',
      phone: '',
};

    if (!this._payment) {
      errors.payment = "Способ оплаты не выбран";
    }

    if (!this._address.trim()) {
      errors.address = "Не указан адрес";
    }

    if (!this._email.trim()) {
      errors.email = "Не указан E-mail";
    } 

    if (!this._phone.trim()) {
      errors.phone = "Не указан телефон";
    } 

    return {
      isValid: Object.values(errors).every(error => error === ''),
      errors,
    };
  }
}