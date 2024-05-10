import { ICatalog } from "../types";
import { Model } from "./base/Model";
import { IEvents } from "./base/events";

export class BasketModel extends Model<{items: ICatalog[]}> {
	protected _items: ICatalog[];

	constructor(data: Partial<{items: ICatalog[]}>, events: IEvents) {
		super(data, events);
		this._items = [];
	}

	add(item: ICatalog) {
		const product = this._items.find((product) => product.id === item.id);
		if (!product) {
			this._items.push(item);
			this.emitChanges('basket:items-changed', { id: item.id });
		}
	}

	remove(id: string) {
		this._items = this._items.filter((item) => item.id !== id);
		this.emitChanges('basket:items-changed', { id: id });
	}

	has(id: string): boolean {
		const item = this._items.find((item) => item.id === id);
		return Boolean(item);
	}

	clear() {
		this._items = [];
		this.emitChanges('basket:items-changed');
	}

	get items() {
		return this._items;
	}

	get total() {
		return this._items.reduce((sum, item) => {
			return item.price + sum;
		}, 0);
	}

	get length() {
		return this._items.length;
	}

	getIdItems() {
		return this._items.map((item) => item.id);
	}
}