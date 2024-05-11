import { IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';
import { IEvents } from '../base/events';

export class BasketView extends View<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLSpanElement;
	protected button: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this._list = ensureElement<HTMLUListElement>('.basket__list', container);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this._price = ensureElement<HTMLSpanElement>('.basket__price', container);
		this.events = events;
		this.button.addEventListener('click', () => this.events.emit('order:open'));
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set valid(state: boolean) {
		this.setDisabled(this.button, state);
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}
}
