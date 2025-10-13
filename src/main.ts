import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { API_URL } from './utils/constants';
import { ApiService } from './components/base/ApiService';
import { EventEmitter } from './components/base/Events';
import { ensureElement } from './utils/utils';
import {
  IOrder,
  IProduct,
  IOrderResponse,
  TPayment,
} from './types';

import { Success } from './components/view/Success';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Basket } from './components/view/Basket';
import { ContactsForm } from './components/view/forms/ContactsForm';
import { OrderForm } from './components/view/forms/OrderForm';
import { CardPreview } from './components/view/cards/CardPreview';
import { CardBasket } from './components/view/cards/CardBasket';
import { CardCatalog } from './components/view/cards/CardCatalog';

const events = new EventEmitter();

// Модели данных
const apiService = new ApiService(API_URL);
const productsModel = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Представления
const catalogContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(events, catalogContainer);
const modal = new Modal(events);
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement;
const basket = new Basket(events, basketContainer);
const orderForm = new OrderForm(events);
const contactsForm = new ContactsForm(events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const success = new Success(
      events,
      successTemplate.content.cloneNode(true) as HTMLElement
    );

let currentPreview: CardPreview | null = null;

// Рендер галереии
events.on('catalog:changed', () => {
  const products = productsModel.getProducts();
  const cardElements = products.map((product) => {
    return new CardCatalog(events).render(product);
  });
  gallery.render({ items: cardElements });
});

// Изменение выбранного товара
events.on('product:selected', (product: IProduct) => {
  currentPreview = new CardPreview(events);
  const cardElement = currentPreview.render(product);
  const inBasket = cart.getItems().some((p) => p.id === product.id);
  currentPreview.setInBasket(inBasket);
  modal.open(cardElement);
});

// Сохранение выбранного товара
events.on('card:select', (product: IProduct) => {
  productsModel.setSelected(product);
});

// Добавление в корзину
events.on('card:toggle', (product: IProduct) => {
  const inBasket = cart.getItems().some((p) => p.id === product.id);
  inBasket ? events.emit('card:remove', product) : cart.addItem(product);
  events.emit("basket:changed");
});

// Обновление корзины
events.on('basket:changed', () => {
  header.counter = cart.getCount();
  const basketItems = cart.getItems().map((product, index) => {
    return new CardBasket(events).render({ ...product, index });
  });
  basket.items = basketItems;
  basket.total = cart.getTotal();

  if (productsModel.setSelected) {
    currentPreview?.setInBasket(cart.hasItem(productsModel.setSelected.id));
  }
});

events.on('basket:open', () => {
    events.emit('basket:changed');
    modal.open(basket.render());
});

// Удаление из корзины
events.on('card:remove', (product: IProduct) => {
  cart.removeItem(product.id);
});

// Работа с формами

events.on('basket:order', () => {
  modal.open(orderForm.render()); 
});

events.on('payment:select', (data: { method: string }) => {
  buyer.setPayment(data.method as TPayment);
  orderForm.setPaymentSelected(data.method);
});

events.on('address:change', (data: { value: string }) => {
  buyer.setAddress(data.value);
});

// Валидация формы адреса
const validateFirstForm = () => {
  const validation = buyer.validate(["address", "payment"]);
  orderForm.setSubmitEnabled(validation.isValid);
  validation.isValid
    ? orderForm.clearErrors()
    : orderForm.setErrors(validation.errors.join(', '));
};

// переход
events.on('order:submit', () => {
  const validation = buyer.validate(["address", "payment"]);
  if (validation.isValid) {
    modal.open(contactsForm.render());
  } else {
    orderForm.setErrors(validation.errors.join(', '));
  }
});

// Валидация формы контактов

events.on('contacts:email', (data: { value: string }) => {
  buyer.setEmail(data.value);
});

events.on('contacts:phone', (data: { value: string }) => {
  buyer.setPhone(data.value);
});

const validateSecondForm = () => {
  const validation = buyer.validate(["phone", "email"]);
  contactsForm.setSubmitEnabled(validation.isValid);
  validation.isValid 
    ? contactsForm.clearErrors()
    : contactsForm.setErrors(validation.errors.join(', '));
};

// Изменения событий покупателя
events.on('buyer:changed:address', validateFirstForm);
events.on('buyer:changed:payment', validateFirstForm);
events.on('buyer:changed:email', validateSecondForm);
events.on('buyer:changed:phone', validateSecondForm);

// Оплата и завершeние заказа
events.on('contacts:submit', () => {
  const validation = buyer.validate(["phone", "email"]);
  if (validation.isValid) {
    const order: IOrder = {
      ...buyer.getData(),
      items: cart.getItems().map((product) => product.id),
      total: cart.getTotal(),
    };
    apiService.sendOrder(order).then((result: IOrderResponse) => {
      success.total = result.total;
      modal.open(success.render());
      cart.clear();
      buyer.clear();
      orderForm.reset();
      orderForm.setSubmitEnabled(false);
      contactsForm.reset();
      contactsForm.setSubmitEnabled(false);
    //   success = new Success(
    //     events,
    //     successTemplate.content.cloneNode(true) as HTMLElement // нужно обновить контейнер, так как предыдуший элемент был удален из дерева при закрытии модального окна
    //   );
    });
  } else {
    contactsForm.setErrors(validation.errors.join(', '));
  }
});

// Закрытие заказа
events.on('success:close', () => {
  modal.close();
});

// Загрузка товаров
apiService
  .fetchProducts()
  .then((products) => {
    productsModel.setProducts(products);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });
