import { IBuyer, TPayment, IValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  constructor(private events: EventEmitter) {}

  setPayment(payment: TPayment): void {
    this._payment = payment;
    this.events.emit('buyer:changed', { field: 'payment' });
  }

  setAddress(address: string): void {
    this._address = address;
    this.events.emit('buyer:changed', { field: 'address' });
  }

  setEmail(email: string): void {
    this._email = email;
    this.events.emit('buyer:changed', { field: 'email' });
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.events.emit('buyer:changed', { field: 'phone' });
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

  validate(): IValidationErrors {
    const errors: IValidationErrors = {};
 
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
 
    return errors;
  }
}