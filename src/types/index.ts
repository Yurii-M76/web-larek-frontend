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

// /** Интерфейс формы заказа */
// export interface IOrder {
//   payment: 'card' | 'cash';
// 	address: string;
//   email: string;
//   phone: string;
// 	checkValidation(data: Record<keyof TOrderContacts, string>): boolean;
// }

// /** Тип данных товара на странице */
// export type TProductItem = Pick<IProductData, 'category' | 'title' | 'image' | 'price'>;

// /** Тип данных для валидации формы оформления заказа */
// export type TOrderContacts = Pick<IOrder, 'address' | 'email' | 'phone'>;

// /** Тип данных для модального окна успешного оформления заказа */
// export type TSuccessOrder = Pick<IBasket, 'total'>;
