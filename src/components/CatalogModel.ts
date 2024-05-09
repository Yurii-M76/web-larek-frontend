import { ICatalog } from "../types";
import { IEvents } from "./base/events";

/**
 * Абстрактный класс для хранения и обработки данных,
 * использует EventEmitter
 */
abstract class Model {
  protected events: IEvents;
  constructor(data: ICatalog[], events: IEvents) {
    this.events = events;
    Object.assign(this, data);
  }

  emitChanges(event: string, data?: object) {
    this.events.emit(event, data ?? {});
  }
}

/**
 * Наследуется от абстрактного класса Model.
 * Хранит коллекцию товаров
 */
export class CatalogModel extends Model {
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
}