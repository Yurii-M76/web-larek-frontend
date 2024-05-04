import { IEvents } from "../components/base/events";

/** Интерфейс данных товаров в Api */
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

/** Интерфейс товаров в каталоге*/
export interface IProductList {
	items: IProduct[];
	events: IEvents;
	getList(data: IProduct[]): IProduct[];
}

/** Тип id товара */
export type TProductId = Pick<IProduct, 'id'>;

/** Тип списка товаров */
export type TProductItems = Pick<IProductList, 'items'>

/** Тип данных товара на странице */
export type TProductItem = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>;

/** Интерфейс корзины */
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

/** Тип данных для модального окна успешного оформления заказа */
export type TSuccess = Pick<IBasket, 'total'>;

/** Интерфейс формы заказа */
export interface IOrder {
	items: IProduct[];
  payment: TPaymentMethod;
	address: string;
  email: string;
  phone: string;
	checkValidation(data: Record<keyof TOrderContacts, string>): boolean;
}

/** Тип данных для валидации формы оформления заказа */
export type TOrderContacts = Pick<IOrder, 'address' | 'email' | 'phone'>;

/** Тип способа оплаты при оформления заказа */
export type TPaymentMethod = 'card' | 'cash';

/** Интерфейся класса создания карточки товара */
export interface IProductCard {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLElement;
	price: HTMLElement;
	set(data: IProduct): void;
	render(): HTMLElement;
}

/** Интерфейс абстрактного класса Modal */
export interface IModal {
	modal: HTMLElement;
	events: IEvents;
	open(): void;
	close(): void;
}

/** Интерфейс модального окна с полной информацией о товаре */
export interface IModalPreviewProduct {
	category: HTMLElement;
	title: HTMLElement;
	image: HTMLElement;
	price: HTMLElement;
	description: HTMLElement;
	events: IEvents;
}

/** Интерфейс модального окна формы оформления заказа */
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

/** Интерфейс модального окна успешного оформления заказа */
export interface IModalPreviewProduct {
	total: HTMLElement;
	button: HTMLButtonElement;
	getTotal(items: IProduct[]): number;
}