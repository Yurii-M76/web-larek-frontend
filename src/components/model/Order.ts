import { IOrder, TOrderData, TPayment } from '../../types';

export class Order implements IOrder {
	protected _payment: TPayment;
	protected _address: string;
	protected _email: string;
	protected _phone: string;
	protected _total: number;
	protected _items: string[];

	set payment(value: TPayment) {
		this._payment = value;
	}

	set address(value: string) {
		this._address = value;
	}

	set email(value: string) {
		this._email = value;
	}

	set phone(value: string) {
		this._phone = value;
	}

	set total(value: number) {
		this._total = value;
	}

	set items(list: string[]) {
		this._items = list;
	}

	readyОrder(): TOrderData {
		return {
			payment: this._payment,
			email: this._email,
			phone: this._phone,
			address: this._address,
			total: this._total,
			items: this._items,
		};
	}
}