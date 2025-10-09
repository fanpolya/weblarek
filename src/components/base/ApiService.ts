import { IProduct, IOrderRequest, IOrderResponse } from '../../types';
import { Api } from "./Api";

export class ApiService extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options); // инициализация конструктора родительского класса
  }

  // Получение каталога товаров с сервера
  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.get<{ items: IProduct[] }>("/product");
    return response.items || []; // возвращаем массив товаров
  }

  // Отправка заказа на сервер
  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return await this.post<IOrderResponse>("/order/", order);
  }
}