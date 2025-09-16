import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api; // сохраняем объект Api для использования get/post
  }

  // Получение каталога товаров с сервера
  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>("/product");
    return response.items || []; // возвращаем массив товаров
  }

  // Отправка заказа на сервер
  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>("/order/", order);
  }
}