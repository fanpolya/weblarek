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
    if (this._payment === null) {
      throw new Error("Не выбран способ оплаты");
    }

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

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this._payment) {
      errors.push("Способ оплаты не выбран");
    }

    if (!this._address.trim()) {
      errors.push("Не указан адрес");
    }

    if (!this._email.trim()) {
      errors.push("Не указан E-mail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) {
      errors.push("Некорректный формат email");
    }

    if (!this._phone.trim()) {
      errors.push("Не указан телефон");
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(this._phone)) {
      errors.push("Некорректный номер телефона");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}