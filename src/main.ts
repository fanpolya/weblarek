import './scss/styles.scss';

import { Catalog } from "./components/base/models/Catalog";
import { Cart } from "./components/base/models/Cart";
import { Buyer } from "./components/base/models/Buyer";
import { apiProducts } from "./utils/data";

import { ApiService } from "./components/base/ApiService";
import { Api } from "./components/base/Api";

// ====== Тест модели Catalog (каталог товаров) ======
const catalogModel = new Catalog();

// Загружаем тестовые товары из локального объекта (для проверки моделей)
catalogModel.setProducts(apiProducts.items);

// Выводим весь массив товаров в консоль
console.log("===== Catalog (локальные данные) =====");
console.log("Массив товаров из каталога:", catalogModel.getProducts());

// Ищем конкретный товар по id
console.log("Товар с id = 2:", catalogModel.getProductById("2"));

// ====== Тест модели Cart (корзина) ======
const cartModel = new Cart();

// Добавляем товары в корзину
cartModel.add(apiProducts.items[0]); // добавляем первый товар
cartModel.add(apiProducts.items[1]); // добавляем второй товар

// Выводим текущее содержимое корзины
console.log("\n===== Cart =====");
console.log("Содержимое корзины:", cartModel.getItems());

// Выводим количество товаров в корзине
console.log("Общее количество товаров:", cartModel.getCount());

// Выводим общую сумму товаров в корзине
console.log("Общая сумма корзины:", cartModel.getTotal());

// ====== Тест модели Buyer (информация о покупателе) ======
const buyerModel = new Buyer();

// Сохраняем данные о покупателе
buyerModel.setData({
  payment: 'card', // пример: платежные данные отсутствуют
  address: "ул. Пушкина, д. 1",
  email: "name@email.com",
  phone: "+79123456789",
});

// Выводим данные покупателя
console.log("\n===== Buyer =====");
console.log("Информация о покупателе:", buyerModel.getData());

// ====== Работа с сервером через ApiService ======
const api = new Api("https://api.example.com");    // создаём объект Api
const apiService = new ApiService(api);           // создаём сервис для работы с сервером

// Получаем каталог товаров с сервера
apiService.fetchProducts()
  .then((productsFromServer) => {
    // Сохраняем полученные товары в модель Catalog
    catalogModel.setProducts(productsFromServer);

    // Выводим в консоль, чтобы проверить работу сервиса и модели
    console.log("\n===== Catalog (данные с сервера) =====");
    console.log("Каталог товаров, полученный с сервера:", catalogModel.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка при получении каталога с сервера:", error);
  });