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

Интерфейс данных товаров в Api
```
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}
```

Интерфейс товаров в каталоге
```
export interface IProductList {
	items: IProduct[];
	events: IEvents;
	getList(data: IProduct[]): IProduct[];
}
```

Тип id товара
```
export type TProductId = Pick<IProduct, 'id'>;
```

Тип списка товаров
```
export type TProductItems = Pick<IProductList, 'items'>
```

Тип данных товара на странице
```
export type TProductItem = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;
```

Интерфейс корзины
```
export interface IBasket {
	items: IProduct[]; 
  total: number;
	events: IEvents;
	add(item: TProductId): void;
	remove(item: TProductId): void;
	getTotal(...items: IProduct[]): number;
	check(item: TProductId): boolean;
	disableButton(items: IProduct[]): boolean;
	clear(): void;
}
```

Тип данных для модального окна успешного оформления заказа
```
export type TSuccess = Pick<IBasket, 'total'>;
```

Интерфейс формы заказа
```
export interface IOrder {
	items: IProduct[];
  payment: TPaymentMethod;
	address: string;
  email: string;
  phone: string;
	checkValidation(data: Record<keyof TOrderContacts, string>): boolean;
}
```

Тип данных для валидации формы оформления заказа
```
export type TOrderContacts = Pick<IOrder, 'address' | 'email' | 'phone'>;
```

Тип способа оплаты при оформления заказа
```
export type TPaymentMethod = 'card' | 'cash';
```

Интерфейся класса создания карточки товара
```
export interface IProductCard {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLElement;
	price: HTMLElement;
	set(data: IProduct): void;
	render(): HTMLElement;
}
```

Интерфейс абстрактного класса Modal
```
export interface IModal {
	modal: HTMLElement;
	events: IEvents;
	open(): void;
	close(): void;
}
```

Интерфейс модального окна с полной информацией о товаре
```
export interface IModalPreviewProduct {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLElement;
	price: HTMLElement;
	description: HTMLElement;
	events: IEvents;
}
```

Интерфейс модального окна формы оформления заказа
```
export interface IModalPreviewProduct {
	paymentMethod: HTMLElement;
	form: HTMLFormElement;
	address: HTMLElement;
	email: HTMLElement;
	phone: HTMLElement;
	button: HTMLButtonElement;
	errors: HTMLElement;
	showError(element: HTMLElement): void;
	hideError(field: string): void;
	close(): void;
}
```

Интерфейс модального окна успешного оформления заказа
```
export interface IModalPreviewProduct {
	total: HTMLElement;
	button: HTMLButtonElement;
	getTotal(items: IProduct[]): number;
}
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

___


## Слой данных (Model)

### Класс Model
Aбстрактный класс для классов хранения и обработки данных
- `constructor(data: TProductItem, events: IEvents)` - конструктор принимает входные данные и брокер событий. Класс содержит метод `emitChanges` сообщающий подписчикам об изменениях

### Класс ProductList
Наследуется от абстрактного класса Model.\
Отвечает за хранение и логику работы с данными товаров в каталоге.
- `constructor(data: TProductItem, events: IEvents) ` - конструктор класса принимает объект с данными и инстанс брокера событий

Поля: 
- `items: IProduct[]` - массив объектов товаров
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий

Методы:
- `set items(list: IProduct[]): void` - записывает массив в items
- `get items(): IProduct[]` - получает массив из свойства items
- `id(string: id): IProduct | undefined` - получает конкретный товар по id

### Класс Basket
Наследуется от абстрактного класса Model.\
Класс отвечает за хранение данных о товарах в корзине
- `constructor(data: TProductItem, events: IEvents) ` - конструктор класса принимает объект с данными и инстанс брокера событий

Поля: 
- `items: IProduct[]` - массив объектов товаров
- `total: HTMLElement` - элемент с общей стоимостью товаров
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий

Методы:
-	`add(item: TProductId): void` - добавляет товар в корзину по id
-	`remove(item: TProductId): void` - удаляет товар из корзины по id
-	`getTotal(items: IProduct[]): number` - получает общую стоимость товаров
- `check(item: TProductId): boolean` - проверяет наличие товара в корзине по id
-	`disableButton(items: IProduct[]): boolean` - активирует кнопку оформления заказа при наличии товаров в корзине
-	`clear(): void` - очищает корзину при успешном оформлении заказа

### Класс Order
Класс отвечает за хранение контактных данных покупателя и валидацию формы заказа.

Поля:
- `items: IProduct[]` - массив объектов товаров
- `payment: TPaymentMethod` - способ оплаты
- `address: string`, `email: string` и `phone: string` - контактные данные покупателя

Методы:
- `checkValidation(data: Record<keyof TOrderContacts, string>): boolean` - валидация формы заказа

___


## Слой представления (View)
Отвечает за отображение данных в DOM-елементах.

### Класс ProductCard
Создает карточки. Задает категорию, название продукта, изображение и стоимость. 
Класс используется для отображения карточек на странице сайта. 
- `constructor(template: HTMLElement, events: IEvents)` - в конструктор передается DOM-элемент темплейта. Конструктор так же принимает экземпляр `EventEmitter` для инициализации событий.

Поля:
- `category: HTMLElement` - элемент категории товара
- `title: HTMLElement` - элемент названия товара
- `image: HTMLElement` - элемент изображения товара
- `price: HTMLElement` - элемент стоимости товара

Методы:
- `set(data: IProduct): void` - заполняет элементы карточки данными
- `render(): HTMLElement` - метод возвращает полностью заполненную карточку с установленными слушателями

### Класс Modal
Общий класс реализующий модальное окно.
- `constructor(selector: HTMLElement, events: IEvents)` - конструктор принимает селектор для идентификации в разметке модального окна и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `modal: HTMLElement` - элемент модального окна  
- `events: IEvents` - брокер событий

Методы:
- `open` и `close` - управляют отображением модального окна

### Класс ModalPreviewProduct
Расширяет класс Modal. Предназначен для модального окна с полной информацией о товаре

Поля:
- `category: HTMLElement` - элемент категории товара
- `title: HTMLElement` - элемент названия товара
- `image: HTMLElement` - элемент изображения товара
- `price: HTMLElement` - элемент стоимости товара
- `description: HTMLElement` - элемент с описанием товара
- `events: IEvents` - брокер событий

### Класс ModalOrderForm
Расширяет класс Modal. Предназначен для модального окна оформления заказа.\
Включает в себя выбор способа оплаты, поля ввода: адрес доставки, email и телефон

Поля:
- `paymentMethod: HTMLElement` - DOM-элемент способа оплаты
- `form: HTMLFormElement` - DOM-элемент формы
- `address: HTMLElement`, `email: HTMLElement` и `phone: HTMLElement` - DOM-элементы контактных данных покупателя
- `button: HTMLElement` - DOM-элемент кнопки продолжения оформления заказа
- `errors: HTMLElement` - DOM-элемент для вывода ошибок

Методы:
- `showError(element: HTMLElement): void` - принимает DOM-элемент для отображения текста ошибки
- `hideError(field: string): void` - очищает текст ошибки
- `close(): void` - расширяет родительский метод класса Modal дополнительно очищая поля формы

### Класс ModalSuccess
Расширяет класс Modal. Предназначен для показа модального окна успешного оформления заказа.\
Включает в себя информацию о сумме заказа.

Поля:
- `total: HTMLElement` - DOM-элемент для суммы заказа
- `button: HTMLButtonElement` - DOM-элемент кнопки возврата к покупкам

Методы:
-	`getTotal(items: IProduct[]): number` - получает общую стоимость товаров

___


## Слой коммуникации (Presenter)
Из-за не большого размера приложения код выполняющий роль презентера и описывающий взаимодействие представления и данных между компонентами находится корневом файле index.ts.