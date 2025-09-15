import { IBuyer, TPayment } from '../../../types';

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  setData(data: IBuyer): void {
    this.payment = data.payment;
    this.address = data.address;
    this.email = data.email;
    this.phone = data.phone;
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  validate(): boolean {
    return Boolean(
      this.payment &&
      this.address.trim() &&
      /\S+@\S+\.\S+/.test(this.email) &&
      /^\+?\d{7,15}$/.test(this.phone)
    );
  }
}