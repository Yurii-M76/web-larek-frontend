import { Model } from './Model';
import { IProductList, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class Catalog extends Model<IProductList> {
	protected _items: IProduct[];

	constructor(data: Partial<IProductList>, events: IEvents) {
		super(data, events);
	}

	set items(list: IProduct[]) {
		this._items = list;
		this.emitChanges('catalog:items-changed', this._items);
	}

	get items() {
		return this._items;
	}

	getId(id: string): IProduct | undefined {
		return this._items.find((item) => item.id === id);
	}
}