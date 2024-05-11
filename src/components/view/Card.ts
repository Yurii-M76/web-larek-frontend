import { View } from './View';
import { ensureElement } from '../../utils/utils';
import { TProductId } from '../../types';
import { IEvents } from '../base/events';

export class Card<T> extends View<T> {
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _id: TProductId;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
	}
	
	set id(value: TProductId) {
		this._id = value;
	}

	get id(): TProductId {
		return this._id;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent;
	}

	set price(value: string) {
		const priceText = value ? `${value} синапсов` : 'Бесценно';
		this.setText(this._price, priceText);
	}

	get price(): string {
		return this._price.textContent;
	}
}


