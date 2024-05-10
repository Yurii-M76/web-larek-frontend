import { ICatalog } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

/**
 * Наследуется от абстрактного класса Model.
 * Хранит коллекцию товаров
 */
export class CatalogModel extends Model<ICatalog[]> {
  _items: ICatalog[]

  constructor(data: ICatalog[], events: IEvents) {
    super(data, events)
  }

  set data(data: ICatalog[]) {
    this._items = data;
    this.emitChanges('catalog:items-changed', this._items);
  }

  get data(): ICatalog[] {
    return this._items;
  }

  find(id: string): ICatalog | undefined {
		return this._items.find((item) => item.id === id);
	}
}