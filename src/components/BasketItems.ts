import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IEvents } from "./base/events";
import { ICatalog } from '../types/index';

type IBasketCard = Omit<ICatalog, 'description' | 'category' | 'image'> & {	index: number };

export class BasketItems extends View<IBasketCard> {
	protected events: IEvents;
	protected _index: HTMLSpanElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}