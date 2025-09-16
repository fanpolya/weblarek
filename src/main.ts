import './scss/styles.scss';
import { Catalog } from "./components/models/Catalog";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { IProduct } from "./types";
import { apiProducts } from "./utils/data";
import { ApiService } from "./components/base/ApiService";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// ====== Тест модели Catalog (каталог товаров) ======
const catalogModel = new Catalog();

// Сохраняем товары из локального объекта (для проверки моделей)
catalogModel.setProducts(apiProducts.items);

// Выводим весь массив товаров в консоль
const allProducts = catalogModel.getProducts();
console.log("\n===== Catalog =====");
console.log("Массив товаров из каталога:", allProducts);

// Поиск товара по id, сохранение и получение выбранного товара
let foundProduct: IProduct | undefined;
const firstProductId = apiProducts.items[0]?.id;
if (firstProductId) {
  foundProduct = catalogModel.getProductById(firstProductId);
  console.log("Товар с ID", firstProductId, ':', foundProduct);
}

if (foundProduct) {
  catalogModel.setSelected(foundProduct);
  console.log('Выбранный товар:', catalogModel.getSelected());
}

// ====== Тест модели Cart (корзина) ======
const cartModel = new Cart();

// Добавляем товары в корзину
const product1 = apiProducts.items[0]; // добавляем первый товар
const product2 = apiProducts.items[1]; // добавляем второй товар

if (product1 && product2) {
  cartModel.addItem(product1);
  cartModel.addItem(product2);
}

// Выводим текущее содержимое корзины
console.log("\n===== Cart =====");
console.log("Содержимое корзины:", cartModel.getItems());

// Выводим количество товаров в корзине
console.log("Общее количество товаров:", cartModel.getCount());

// Выводим общую сумму товаров в корзине
console.log("Общая сумма корзины:", cartModel.getTotal());

// проверка наличия товара в корзине по его id
console.log(`Есть ли товар с id "${product1?.id}" в корзине?`, cartModel.hasItem(product1?.id || ''));

// Удаление товара
if (product1) {
  cartModel.removeItem(product1.id);
  console.log(`Удален товар с ID "${product1.id}"`)
}

console.log("Товары в корзине после удаления:", cartModel.getItems());

// Очищаем корзину
cartModel.clear();
console.log("После очистки корзины товаров:", cartModel.getCount());

// ====== Тест модели Buyer (информация о покупателе) ======
const buyerModel = new Buyer();

// Сохраняем данные о покупателе
buyerModel.setAllData({
  payment: 'card', // пример: платежные данные отсутствуют
  address: "ул. Пушкина, д. 1",
  phone: "+79123456789",
  email: "name@email.com",
});

// Выводим данные покупателя
console.log("\n===== Buyer =====");
console.log("Информация о покупателе:", buyerModel.getData());

// Валидация данных
const validation = buyerModel.validate();
console.log('Валидация данных:', validation);

// Очистка данных покупателя
buyerModel.clear();
console.log("После очистки данных:", buyerModel.getData());

// Валидация после очистки (должна провалиться)
console.log("Валидация данных (пустые):", validation);

// ====== Работа с сервером через ApiService ======
const api = new Api(API_URL);            // создаём объект Api
const apiService = new ApiService(api);  // создаём сервис для работы с сервером

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