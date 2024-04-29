# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- `src/` — исходные файлы проекта
- `src/components/` — папка с JS компонентами
- `src/components/base/` — папка с базовым кодом

Важные файлы:
- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и их типы, используемые в приложении

Интерфейс данных товара
```
export interface IProductData {
	id: string;
	title: string;
	description: string;
	image: string;
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
	price: number | null;
}
```

Интерфейс товаров в каталоге
```
export interface IProductsList {
	products: IProductData[];
	preview: string | null;
	events: IEvents;
	get(data: string): IProductData;
}
```

Интерфейс корзины
```
export interface IBasket {
	items: Map<string, number>; 
    total: number;
	events: IEvents;
	add(id: string): void;
	remove(id: string): void;
	disableButton(total: number): boolean;
	clear(): void;
}
```

Интерфейс формы заказа
```
export interface IOrder {
    payment: 'card' | 'cash';
	address: string;
    email: string;
    phone: string;
	checkValidation(data: Record<keyof TOrderContacts, string>): boolean;
}
```

Тип данных товара на странице
```
export type TProductItem = Pick<IProductData, 'category' | 'title' | 'image' | 'price'>;
```

Тип данных для валидации формы оформления заказа
```
export type TOrderContacts = Pick<IOrder, 'address' | 'email' | 'phone'>;
```

Тип данных для модального окна успешного оформления заказа
```
export type TSuccessOrder = Pick<IBasket, 'total'>;
```

## Архитектура приложения
Код приложения разделен на слои образующие паттерн проектирования MVP (Model-View-Presenter):
- `Model` - Отвечает за хранение и изменение данных.
- `View` - Реализует отображение данных.
- `Presenter` - Отвечает за связь представления и данных.
 
## Базовый код

### Класс Api
Выполняет логику отправки запросов.
Конструктор принимает базовый адрес `baseUrl` и опциональный объект `RequestInit` с заголовками запросов.

Поля:
- `baseUrl: string` - базовый url на api.
- `options: RequestInit` - объект настроек для формирования запроса.

Методы:
- `get` - выполняет GET-запрос и возвращает `Promise` с результатом ответа.
- `post` - принимает объект данных, которые будут переданы в `JSON` в теле запроса. По умолчанию выполняется `POST` запрос, который может быть переопределен на `PUT` или `DELETE` третьим параметром `method` при вызове.

### Класс EventEmitter
Брокер событий позволяющий отправлять и подписаваться на события, происходящие в системе.\
Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\
Конструктор класса не принимает аргументов.

Поля:
- `_events: Map<EventName, Set<Subscriber>>` - хранит события, где ключём является строка, а значением коллбэк

Основные методы описанные интерфейсом `IEvents`:
- `on` - Установливает обработчик на событие.
- `emit` - Инициирует событие с данными.
- `trigger` - Коллбек триггер возвращающий функцию, при вызове которой инициализируется требуемое в параметрах событие.

## Слой данных (Model)

### Класс ProductsListModel
Класс отвечает за хранение и логику работы с данными товаров в каталоге.
Конструктор класса принимает инстанс брокера событий.

Поля: 
- `products: IProductData[]` - массив объектов продуктов
- `preview: string | null` - id продукта, выбранного для просмотра полной информации в модальном окне
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий

Методы:
- `get(id: string): IProductData` - для получения идентификатора элемента

### Класс BasketModel
Класс отвечает за хранение данных о товарах в корзине

Поля: 
-	`items: Map<string, number>` - массив объектов товаров
- `total: number` - общая стоимость товаров
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий

Методы:
-	`add(id: string): void` - добавляет товар в корзину по id
-	`remove(id: string): void` - удаляет товар из корзины по id
-	`disableButton(total: number): boolean` - активирует кнопку оформления заказа при наличии товаров в корзине
-	`clear(): void` - очищает корзину при успешном оформлении заказа

### Класс OrderModel
Класс отвечает за хранение контактных данных покупателя и валидацию формы заказа.

Поля:
- `payment: 'card' | 'cash'` - способ оплаты
- `address: string`, `email: string` и `phone: string` - контактные данные покупателя

Методы:
- `checkValidation(data: IUser): boolean` - валидация формы заказа

## Слой представления (View)
Отвечает за отображение данных в DOM-елементах.

### Класс Modal
Общий класс реализующий модальное окно.
- `constructor(selector: string, events: IEvents)` - конструктор принимает селектор для идентификации в разметке модального окна и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `modal: HTMLElement` - элемент модального окна  
- `events: IEvents` - брокер событий

Методы:
- `open` и `close` - устанавливают слушатели событий для управления отображением модального окна

## Слой коммуникации (Presenter)
Из-за не большого размера приложения для связи всех компонентов используется корневой файл index.ts