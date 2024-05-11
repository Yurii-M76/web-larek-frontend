export interface IModel {
	emitChanges(event: string, data?: object): void;
}

export interface IAppApi {
	getProductList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	postOrder(order: TOrderData): Promise<IOrderResult>;
}

export interface IPage {
	catalog: HTMLElement[];
	counter: number;
}

export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

export interface IProductList {
	items: IProduct[];
}

export type TProductId = Pick<IProduct, 'id'>;
export type TProductCard = Omit<IProduct, 'description'>;
export type TPreviewCard = IProduct & { valid: boolean; state: boolean };

export interface IModal {
	content: HTMLElement;
}

export type TBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
	index: number;
};

export interface IBasket {
	items: IProduct[];
}

export interface IBasketView {
	list: HTMLElement[];
	valid: boolean;
	price: number;
}

export type TPayment = 'card' | 'cash';

export interface IAddress {
	payment: TPayment;
	address: string;
}

export interface IOrderList {
	total: number;
	items: string[];
}

export interface IContacts {
	email: string;
	phone: string;
}

export type TOrderData = IAddress & IContacts & IOrderList;

export interface IOrder extends TOrderData {
	toApiObject(): TOrderData;
}

export interface IOrderBuilder {
	delivery: IAddress;
	contacts: IContacts;
	orderList: IOrderList;
	result: TOrderData;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IFormCheck {
	valid: boolean;
}

export interface IForm extends IFormCheck {
	render(data?: IFormCheck): HTMLElement;
}

export interface IInputData {
	field: string;
	value: string;
}

export interface ISuccessView {
	total: number;
}