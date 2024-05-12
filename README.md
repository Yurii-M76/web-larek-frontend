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

Интерфейс класс хранения и обработки данных
```
export interface IModel {
	emitChanges(event: string, data?: object): void;
}
```

Интерфейс класса для работы с api приложения
```
export interface IAppApi {
	getProductList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	postOrder(order: TOrderData): Promise<IOrderResult>;
}
```

Интерфейс страницы каталога
```
export interface IPage {
	catalog: HTMLElement[];
	counter: number;
}
```

Интерфейс полной информации о товаре
```
export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}
```

Интерфейс массива товаров
```
export interface IProductList {
	items: IProduct[];
}
```

Тип id товара
```
export type TProductId = Pick<IProduct, 'id'>;
```

Тип товаров в каталоге
```
export type TProductCard = Omit<IProduct, 'description'>;
```

Тип превью карточки товара
```
export type TPreviewCard = IProduct & { valid: boolean; state: boolean };
```

Интерфейс модального окна
```
export interface IModal {
	content: HTMLElement;
}
```

Тип карточки товаров в корзине
```
export type TBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
	index: number;
};
```

Интерфейс окна корзины
```
export interface IBasketView {
	list: HTMLElement[];
	valid: boolean;
	price: number;
}
```

Интерфейс методы оплаты заказа
```
export type TPayment = 'card' | 'cash';
```

Интерфейс формы с методом оплаты и полем адреса доставки
```
export interface IAddress {
	payment: TPayment;
	address: string;
}
```

Интерфейс формы с контактами для оформления заказа
```
export interface IContacts {
	email: string;
	phone: string;
}
```

Интерфейс списка товаров в заказе
```
export interface IOrderList {
	total: number;
	items: string[];
}
```

Тип данных о заказе для отправки запроса по Api
```
export type TOrderData = IAddress & IContacts & IOrderList;
```

Интерфейс объекта товаров в заказе для отправки запроса по Api
```
export interface IOrder extends TOrderData {
	readyОrder(): TOrderData;
}
```

Интерфейс сборки данных в заказ
```
export interface IOrderBuilder {
	delivery: IAddress;
	contacts: IContacts;
	orderList: IOrderList;
	result: TOrderData;
}
```

Интерфейс готового заказа
```
export interface IOrderResult {
	id: string;
	total: number;
}
```

Интерфейс валидности формы заказа
```
export interface IFormCheck {
	valid: boolean;
}
```

Интерфейс рендера формы заказа
```
export interface IForm extends IFormCheck {
	render(data?: IFormCheck): HTMLElement;
}
```

Интерфейс полей формы
```
export interface IInputData {
	field: string;
	value: string;
}
```

Интерфейс окна успешного оформления заказа
```
export interface ISuccessView {
	total: number;
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

### Класс AppApi
Наследуется от базового класса Api.\
Служит для получения списка товаров и оформления заказа
- `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - конструктор принимает url-адрес изображений товаров, базовый url на Api c данными товаров и объект настроек для `GET` или `POST` запросов

Поле - `protected readonly cdn: string` - для url-адреса с изображениями товаров

Методы:
- `getProductList(): Promise<IProduct[]>` - получает с api список товаров
- `getProductItem(id: string): Promise<IProduct>` - получает с api товар по id для оформления заказа
- `postOrder(order: TOrderData): Promise<IOrderResult>` - отправляет post запрос на сервер, с данными о заказе

### Класс Model
Aбстрактный класс для классов хранения и обработки данных
- `constructor(data: Partial<T>, events: IEvents)` - конструктор принимает входные данные (с помощью Partial делая их опциональными) и брокер событий.\
Класс содержит метод `emitChanges` сообщающий подписчикам об изменениях

### Класс Catalog
Наследуется от абстрактного класса Model.\
Отвечает за хранение и логику работы с данными товаров в каталоге.
- `constructor(data: Partial<IProductList>, events: IEvents) ` - конструктор класса принимает объект с данными и инстанс брокера событий

Методы:
- `set items(list: IProduct[])` - записывает массив в items
- `get items(): IProduct[]` - получает массив из свойства items
- `getId(id: string): IProduct | undefined` - возвращает конкретный товар по id

### Класс Basket
Наследуется от абстрактного класса Model.\
Класс отвечает за хранение данных о товарах в корзине
- `constructor(data: Partial<IBasket>, events: IEvents)` - конструктор класса принимает объект с данными и инстанс брокера событий

Поля: 
- `_items: IProduct[]` - массив объектов товаров

Методы:
- `get items(): IProduct[]` - получает массив товаров 
- `get total(): number` - получает общую стоимость товаров 
- `get length(): number` - получает длину массива товаров
-	`add(item: IProduct): void` - добавляет товар в корзину по id
-	`remove(id: string): void` - удаляет товар из корзины по id
- `check(id: string): boolean` - проверяет наличие товара в корзине по id
-	`clear(): void` - очищает корзину при успешном оформлении заказа
- `getIdList(): string[]` - получает массива строк ID товаров 

### Класс Order
Модель заказа. Отвечает за обработку и хранение данных

Поля:
- `_payment: TPayment` - способ оплаты
- `_total: number` - общая стоимость всех товаров в заказе
- `_items: string[]` - массив ID товаров в виде строк
- `address: string`, `email: string` и `phone: string` - контактные данные покупателя

Методы:
- `set payment(value: TPayment)` - сеттер способа оплаты заказа
- `set address(value: string) ` - сеттер для адреса покупателя для доставки
- `set email(value: string)` - сеттер адреса электронной почты покупателя
- `set phone(value: string)` - сеттер контактного номера телефона покупателя
- `set total(value: number)` - сеттер общей стоимости заказа
- `set items(list: string[])` - сеттер списка ID товаров в заказе
- `readyОrder(): TOrderData` - возвращает готовый объект заказа для отправки по Api

### Класс OrderBuilder
Наследуется от абстрактного класса Model.\
- `constructor(data: Partial<IOrderBuilder>, events: IEvents)` - конструктор принимает объект с входными данными и броекр событий

Поле `order: IOrder;` - экземпляр класса Order

Методы формирования заказа:
- `set delivery(delivery: IAddress)` - сеттер способа оплаты заказа и адреса доставки
- `set contacts(contacts: IContacts)` - сеттер телефона и email покупателя
- `set orderList(orderList: IOrderList)` - сеттер данных о товарах в заказе
- `get result(): IOrder` - геттер возвращает объект заказа

___


## Слой представления (View)
Отвечает за отображение данных в DOM-елементах.

### Класс View
Базовый абстрактный класс для всех классов - отображений
- `constructor(container: HTMLElement)` - конструктор принимает контейнер для дочерних элементов

Поля:
- `protected readonly container: HTMLElement` - контейнер дочерних элментов

Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключатель класса на переданном элементе
- `setText(element: HTMLElement, value: unknown)` - установка текста(value) в выбранный HTMLElement (element)
- `setDisabled(element: HTMLElement, state: boolean)` - блокирует переданный html элемент(element), если state === true. В ином случае снимает блокировку
- `setHidden(element: HTMLElement)` - скрывает переданный html элемент(element)
- `setVisible(element: HTMLElement)` - отображает переданный html элемент(element)
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает url(аргумент src) в поле src переданного html элемента(element) и альтернативный текст(аргумент alt) в поле alt
- `render(data?: Partial<T>): HTMLElement` - отрисовывает компонент на странице и возвращает корневой html элемент

### Класс Modal
Общий класс реализующий модальное окно.\
Наследуется от абстрактного класса View.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке модального окна и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `_content: HTMLElement` - элемент модального окна
- `protected _closeButton: HTMLButtonElement` - кнопка закрытия модального окна
- `protected events: IEvents` - брокер событий

Методы:
- `set content(value: HTMLElement)` сеттер для записи контента модального окна
- `open` и `close` - управляют отображением модального окна

### Класс Page 
Наследуется от абстрактного класса View.\
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
-	`protected _basketButton: HTMLElement` - кнопка корзины (в header сайта)
-	`protected _catalog: HTMLElement` - каталог товаров на сайте
-	`protected _counter: HTMLSpanElement` - счетчик товаров в корзине
-	`protected _wrapper: HTMLDivElement` - элемент разметки для блокировки страницы при открытом модальном окне
-	`protected events: IEvents` - брокер событий

Методы:
-	`set catalog(items: HTMLElement[])` - сеттер для установки карточек товаров на страницу
-	`set counter(value: string)` - сеттер счетчика товаров в корзине
-	`lock(state: boolean): void` - блокировка страницы при открытом модальном окне

### Класс Card
Наследуется от абстрактного класса View.\
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `protected _title: HTMLHeadingElement` - элемент заголовка товара
- `protected _price: HTMLSpanElement` - элемент стоимости товара
-	`protected _id: string` - id товара
-	`protected events: IEvents` - брокер событий

Методы:
- `set id(value: TProductId)` - сеттер id товара
- `get id(): TProductId)` - геттер возвращает id товара
- `set title(value: string)` - сеттер устанавливает в DOM название товара
- `get title(): string` - геттер - возвращает название товара
- `set price(value: string)` - сеттер - устанавливает в DOM стоимость тавара
- `get price(): string` - геттер - возвращает стоимость товара

### Класс CatalogView
Наследуется от класса Card.\
Отвечает за отображение карточек в каталоге и действий с ними.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
-	`protected _category: HTMLSpanElement` - элемент категории товара 
-	`protected _image: HTMLImageElement` - элемент изображения товара

Методы:
- `set category(value: string)` - устанавливает в DOM категорию товара
- `get category(): string` - возвращает строку с категорией товара
- `set image(value: string)` - устанавливает в DOM изображение товара
- `toggleCategoryClass(value: string): void` - переключатель класса-модификатора категории товара 

### Класс ProductPreview
Наследуется от класса CatalogView.\
Отвечает за показ полной информации о товаре в модальном окне.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
-	`protected _description: HTMLParagraphElement` - элемент полного описания товара
-	`protected button: HTMLButtonElement` - кнопка добавления товара в корзину

Методы:
- `set description(value: string)` - устанавливает в DOM полное описание товара
- `set valid(state: boolean)` - устанавливает валидность стоимости товара (если товар "бесценен" - кнопка покупки блокируется)
- `get valid(): boolean` - возвращает true или false в зависимости от наличия цены на товар
- `set state(state: boolean)` - блокирует кнопку покупки в зависимости от наличия товара в корзине

### Класс BasketCard
Наследуется от класса Card.\
Отвечает за отображение товара в корзине.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля: 
-	`protected _index: HTMLSpanElement` - элемент нумерации товаров в корзине
-	`protected button: HTMLButtonElement` - элемент кнопки удаления товара из корзины

Методы:
- `set index(value: number)` - устанавливает в DOM порядковый номер товара

### Класс BasketView
Наследуется от абстрактного класса View.\
Отвечает за отображение корзины с товарами.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `protected _list: HTMLElement` - элемент списка карточек товаров в корзине
- `protected _price: HTMLSpanElement` -  элемент общей стоимости товаров
- `protected button: HTMLButtonElement` - кнопка оформления заказа
- `protected events: IEvents` - брокер событий

Методы:
- `set list(items: HTMLElement[])` - устанавливает в DOM список товаров в корзине
- `set valid(state: boolean)` - устанавливает наличие товаров в корзине, если 0 - кнопка блокируется
- `set price(value: number)` - устанавливает общую стоимость товаров

### Класс Form
Наследуется от абстрактного класса View.\
- `constructor(container: HTMLFormElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке формы и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `protected container: HTMLFormElement` - элемент формы
- `protected inputList: HTMLInputElement[]` - список инпутов формы
- `protected _submit: HTMLButtonElement;` - кнопка формы
- `protected _error: HTMLSpanElement;` - элемент для выводы сообщений об ошибках заполнения формы
- `protected events: IEvents` - брокер событий

Методы:
- `set valid(value: boolean)` - сеттер для блокировки кнопки
- `get valid(): boolean` - геттер для получения статуса валидности формы
- `set error(value: string)` - сеттер для установки текста ошибки
- `emitInput(): void` - для контроля заполнения полей формы
- `clear(): void` - очистка полей формы
- `render(data?: Partial<T> & IFormCheck): HTMLElement` - рендер формы на странице

### Класс OrderForm
Наследуется от класса Form.\
Отвечает за форму заказа (способ оплаты и адресс доставки).
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
-	`protected buttonContainer: HTMLDivElement` - элемент с кнопками способа оплаты
-	`protected onlineButton: HTMLButtonElement` - кнопка оплаты по карте
-	`protected cashButton: HTMLButtonElement` - кнопка оплаты при получении
-	`protected addressInput: HTMLInputElement` - поле ввода адреса доставки

Методы:
- `toggleCard(state = true): void` и `toggleCash(state = true): void` - переключатели классов-модификаторов кнопок способа оплаты товара.
- `resetButtons(): void` - сбрасывает класс-модификатор с кнопок способа оплаты
- `getActiveButton(): HTMLButtonElement | null` - возвращает кнопку способы оплаты, у которой активен класс 'button_alt-active'
- `clear(): void` - очищает форму
- `get payment(): string` - возвращает способ оплаты
- `get address(): string` - возвращает адресс доставки
- `set valid(value: boolean)` - устанавливает валидность формы, блокируя кнопку
- `get valid(): boolean` - возвращает валидность формы


### Класс ContactsForm
Наследуется от класса Form.\
Отвечает за форму контактов для оформления заказа.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `protected emailInput: HTMLInputElement` - инпут формы для ввода email
- `protected phoneInput: HTMLInputElement` - инпут формы для ввода телефона

Методы:
- `get email(): string` - возвращает email из инпута
- `get phone(): string` - возвращает телефон из инпута

### Класс SuccessView
Наследуется от абстрактного класса View.\
Отвечает за отображение окна об успешом оформлении заказа.
- `constructor(container: HTMLElement, events: IEvents)` - конструктор принимает контейнер для идентификации в разметке и экземпляр класса `EventEmitter` для инициализации событий

Поля:
- `protected description: HTMLParagraphElement` - элемент с общей суммой за заказ
- `protected button: HTMLButtonElement` - кнопка возврата к покупкам
-	`protected events: IEvents` - брокер событий

Методы:
- `set total(value: number)` - устанавливает в DOM общую сумму заказа 

___


## Слой коммуникации (Presenter)
Из-за не большого размера приложения код выполняющий роль презентера и описывающий взаимодействие представления и данных между компонентами находится корневом файле index.ts.