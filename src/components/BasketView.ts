import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IEvents } from "./base/events";

interface IBasketView {
	list: HTMLElement[];
	valid: boolean;
	total: number;
}

export class BasketView extends View<IBasketView> {
	protected events: IEvents;
	protected _list: HTMLElement;
	protected _total: HTMLSpanElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
		
		this.button.addEventListener('click', () => {
			this.events.emit('order:open')
		});
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set valid(state: boolean) {
		this.setDisabled(this.button, state);
	}

	set price(value: number) {
		this.setText(this._total, `${value} синаспов`);
	}
}
