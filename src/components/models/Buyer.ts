import { IBuyer, TPayment } from '../../types';

export class Buyer {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  setAddress(address: string): void {
    this._address = address;
  }

  setEmail(email: string): void {
    this._email = email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
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

  validate(fieldsToCheck: string[]): { isValid: boolean; errors: string[] } {
    let errors: string[] = [];
    fieldsToCheck.forEach(field => {
      switch(field) {
        case("payment"): {
          if (!this._payment) {
            errors.push("Способ оплаты не выбран");
          }
          return;
        }
        case("address"): {
          if (!this._address) {
            errors.push("Не указан адрес");
          }
          return;
        }
        case("email"): {
          if (!this._email) {
            errors.push("Не указан E-mail");
          }
          return;
        }
        case("phone"):
          if (!this._phone) {
            errors.push("Не указан телефон");
          }
      }
    });

    return {
      isValid: Object.values(errors).every(error => error === ''),
      errors,
    };
  }
}