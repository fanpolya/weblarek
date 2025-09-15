import { IApi, IProduct, IOrder } from '../../types';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api; // сохраняем объект Api для использования get/post
  }

  // Получение каталога товаров с сервера
  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ items: IProduct[] }>("/product/");
    return response.items; // возвращаем массив товаров
  }

  // Отправка заказа на сервер
  async sendOrder(orderData: IOrder): Promise<any> {
    return this.api.post("/order/", orderData, "POST");
  }
}