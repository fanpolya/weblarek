import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ApiService } from './components/base/ApiService';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import {
  IOrder,
  IProduct,
  TPayment,
} from './types';

import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Catalog } from './components/models/Catalog';
import { CardBasket } from './components/view/cards/CardBasket';
import { CardCatalog } from './components/view/cards/CardCatalog';
import { CardPreview } from './components/view/cards/CardPreview';
import { ContactsForm } from './components/view/forms/ContactsForm';
import { OrderForm } from './components/view/forms/OrderForm';
import { Basket } from './components/view/Basket';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Success } from './components/view/Success';

const events = new EventEmitter();

// Модели данных
const apiService = new ApiService(API_URL);
const productsModel = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Элементы и темплейты
const galleryElement = ensureElement<HTMLElement>('.gallery');
const headerElement = ensureElement<HTMLElement>('.header');
const modalElement = ensureElement<HTMLElement>(".modal")

const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts")
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order")
const successTemplate = ensureElement<HTMLTemplateElement>("#success")
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket")

// Представления
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement, events);
const header = new Header(events, headerElement);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);

// Загрузка товаров с сервера
apiService
  .fetchProducts()
  .then((products) => {
    productsModel.setProducts(products);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });

// Рендер галереи
events.on('catalog:changed', () => {
  const products = productsModel.getProducts();
  const cardElements = products.map((product) => {
    const card = new CardCatalog(events);
    return card.render(product);
  });
  gallery.render({ catalog: cardElements });
});

// Открываем карточку
events.on('product:select', (product: IProduct) => {
  productsModel.setSelected(product);
  const preview = new CardPreview(events);
  const cardElement = preview.render(product);
  const inBasket = cart.getItems().some((p) => p.id ===product.id);
  preview.setInBasket(inBasket);
  modal.open(cardElement);
});

// Добавление в корзину
events.on('card:toggle', (product: IProduct) => {
  const inBasket = cart.getItems().some((p) => p.id === product.id);
  if (!inBasket) {
    cart.addItem(product);
    modal.close();
  } else {
    cart.removeItem(product.id);
    modal.close();
  }
  events.emit("basket:changed");
});

// Обновление корзины
events.on('basket:changed', () => {
  header.counter = cart.getCount();
  const renderedCards = cart.getItems().map((product, index) => {
    return new CardBasket(events).render({ ...product, index });
  });
  basket.items = renderedCards;
  basket.total = cart.getTotal();
});

// Открытие корзины в хедере
events.on('basket:open', () => {
  const items = cart.getItems().map((product, index) => {
    return new CardBasket(events).render({ ...product, index });
  });
  basket.items = items;
  basket.total = cart.getTotal();
  modal.open(basket.render());
});

// Удаление из корзины
events.on('card:remove', (product: IProduct) => {
  cart.removeItem(product.id);
});

// Кнопка "Оформить"
events.on('basket:order', () => {
  modal.open(orderForm.render()); 
});

// ФОРМЫ

// Выбор оплаты
events.on('payment:change', (data: { payment: TPayment }) => {
  buyer.setPayment(data.payment);
})

// Ввод адреса
events.on('address:change', (data: { address: string }) => {
  buyer.setAddress(data.address);
});

// переход
events.on('order:submit', () => {
  modal.content = contactsForm.render();
});

// Ввод email
events.on('contacts:email', (data: { email: string }) => {
  buyer.setEmail(data.email);
});

// Ввод телефона
events.on('contacts:phone', (data: { phone: string }) => {
  buyer.setPhone(data.phone);
});

// Валидация
events.on('buyer:changed', (data: { field: string }) => {
  const validation = buyer.validate();
  const selectedPayment = buyer.getData().payment;

  if (data.field === "payment" || data.field === "address") {
    const isValid = orderForm.checkValidation(validation);
    orderForm.setSubmitEnabled(isValid);
    orderForm.toggleErrorClass(!isValid);
    orderForm.togglePaymentButtonStatus(selectedPayment);
  } else if (data.field === "email" || data.field === "phone") {
    const isValid = contactsForm.checkValidation(validation);
    contactsForm.setSubmitEnabled(isValid);
    contactsForm.toggleErrorClass(!isValid);
  }
})

// Оплата и завершeние заказа
  events.on('contacts:submit', () => {
    const orderData: IOrder = {
      ...buyer.getData(),
      items: cart.getItems().map((product) => product.id),
      total: cart.getTotal(),
    };

    apiService.sendOrder(orderData)
    .then(result => {
        if (result) {
          cart.clear();
          buyer.clear();
          header.counter = cart.getCount();
          modal.content = success.render();
          orderForm.resetForm();
          contactsForm.resetForm();
          success.total = result.total;
        }
      })
    .catch(error => console.error('Ошибка оформления заказа:', error))
  })

// Закрытие заказа
events.on('success:close', () => {
  modal.close();
});