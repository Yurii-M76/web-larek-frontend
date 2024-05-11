/**
 * Интерфейс класс хранения и обработки данных
 */
export interface IModel {
	emitChanges(event: string, data?: object): void;
}

/**
 * Интерфейс класса для работы с api приложения
 */
export interface IAppApi {
	getProductList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	postOrder(order: TOrderData): Promise<IOrderResult>;
}

/**
 * Интерфейс страницы каталога
 */
export interface IPage {
	catalog: HTMLElement[];
	counter: number;
}

/**
 * Интерфейс полной информации о товаре
 */
export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

/**
 * Интерфейс массива товаров
 */
export interface IProductList {
	items: IProduct[];
}

/**
 * Тип id товара
 */
export type TProductId = Pick<IProduct, 'id'>;

/**
 * Тип товаров в каталоге
 */
export type TProductCard = Omit<IProduct, 'description'>;

/**
 * Тип превью карточки товара
 */
export type TPreviewCard = IProduct & { valid: boolean; state: boolean };

/**
 * Интерфейс модального окна
 */
export interface IModal {
	content: HTMLElement;
}

/**
 * Тип карточки товаров в корзине
 */
export type TBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
	index: number;
};

/**
 * Интерфейс окна корзины
 */
export interface IBasketView {
	list: HTMLElement[];
	valid: boolean;
	price: number;
}

/**
 * Интерфейс методы оплаты заказа
 */
export type TPayment = 'card' | 'cash';

/**
 * Интерфейс формы с методом оплаты и полем адреса доставки
 */
export interface IAddress {
	payment: TPayment;
	address: string;
}

/**
 * Интерфейс формы с контактами для оформления заказа
 */
export interface IContacts {
	email: string;
	phone: string;
}

/**
 * Интерфейс списка товаров в заказе
 */
export interface IOrderList {
	total: number;
	items: string[];
}

/**
 * Тип данных о заказе для отправки запроса по Api
 */
export type TOrderData = IAddress & IContacts & IOrderList;

/**
 * Интерфейс объекта товаров в заказе для отправки запроса по Api
 */
export interface IOrder extends TOrderData {
	readyОrder(): TOrderData;
}

/**
 * Интерфейс сборки данных в заказ
 */
export interface IOrderBuilder {
	delivery: IAddress;
	contacts: IContacts;
	orderList: IOrderList;
	result: TOrderData;
}

/**
 * Интерфейс готового заказа
 */
export interface IOrderResult {
	id: string;
	total: number;
}

/**
 * Интерфейс валидности формы заказа
 */
export interface IFormCheck {
	valid: boolean;
}

/**
 * Интерфейс рендера формы заказа
 */
export interface IForm extends IFormCheck {
	render(data?: IFormCheck): HTMLElement;
}

/**
 * Интерфейс полей формы
 */
export interface IInputData {
	field: string;
	value: string;
}

/**
 * Интерфейс окна успешного оформления заказа
 */
export interface ISuccessView {
	total: number;
}