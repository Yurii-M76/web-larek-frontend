import { ISuccessView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { View } from './View';
import { IEvents } from '../base/events';

export class SuccessView extends View<ISuccessView> {
	protected description: HTMLParagraphElement;
	protected button: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.button = ensureElement<HTMLButtonElement>('.button', container);
		this.description = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			container
		);
		this.events = events;
		this.button.addEventListener('click', () =>
			this.events.emit('success:submit')
		);
	}

	set total(value: number) {
		const text = `Списано ${value} синапсов`;
		this.setText(this.description, text);
	}
}
