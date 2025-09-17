export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
  id: string;              // Уникальный идентификатор товара
  description: string;     // Подробное описание товара
  image: string;           // Ссылка на изображение товара
  title: string;           // Название товара
  category: string;        // Категория товара
  price: number | null;    // Стоимость товара (null, если товар нельзя купить)
}

// Типы оплаты
export type TPayment = 'card' | 'cash' | '';

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;       // Способ оплаты
  email: string;           // Электронная почта покупателя
  phone: string;           // Телефон покупателя
  address: string;         // Адрес доставки
}

export interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}