import { View } from '../base/View';
import { ensureElement } from '../../utils/utils';
import { TBasketCard, TPreviewCard } from '../../types';
import { IEvents } from '../base/events';

export class Card<T> extends View<T> {
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _id: string;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
	}

	get id() {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get title() {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get price() {
		return this._price.textContent || '';
	}

	set price(value: string) {
		const priceText = value ? `${value} синапсов` : 'Бесценно';
		this.setText(this._price, priceText);
	}
}


