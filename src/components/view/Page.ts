import { IPage } from '../../types';
import { ensureElement } from '../../utils/utils';
import { View } from './View';
import { IEvents } from '../base/events';

export class Page extends View<IPage> {
	protected _basketButton: HTMLElement;
	protected _catalog: HTMLElement;
	protected _counter: HTMLSpanElement;
	protected _wrapper: HTMLDivElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._basketButton = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLDivElement>('.page__wrapper', container);

		this._basketButton.addEventListener('click', () =>
			events.emit('basket:open')
		);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: string) {
		this.setText(this._counter, value);
	}

	lock(state: boolean): void {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', state);
	}
}
