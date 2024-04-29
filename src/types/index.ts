import { IEvents } from "../components/base/events";

/** Интерфейс данных товара */
export interface IProductData {
	id: string;
	title: string;
	description: string;
	image: string;
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
	price: number | null;
}

/** Интерфейс товаров в каталоге*/
export interface IProductsList {
	products: IProductData[];
	preview: string | null;
	events: IEvents;
	get(data: string): IProductData;
}

/** Интерфейс корзины */
export interface IBasket {
	items: Map<string, number>; 
    total: number;
	events: IEvents;
	add(id: string): void;
	remove(id: string): void;
	disableButton(total: number): boolean;
	clear(): void;
}

/** Интерфейс формы заказа */
export interface IOrder {
    payment: 'card' | 'cash';
	address: string;
    email: string;
    phone: string;
	checkValidation(data: Record<keyof TOrderContacts, string>): boolean;
}

/** Тип данных товара на странице */
export type TProductItem = Pick<IProductData, 'category' | 'title' | 'image' | 'price'>;

/** Тип данных для валидации формы оформления заказа */
export type TOrderContacts = Pick<IOrder, 'address' | 'email' | 'phone'>;

/** Тип данных для модального окна успешного оформления заказа */
export type TSuccessOrder = Pick<IBasket, 'total'>;