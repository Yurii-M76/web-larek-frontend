import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IEvents } from "./base/events";

export class Modal extends View<{content: HTMLElement}> {
	protected events: IEvents;
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close',container);
		this._content = ensureElement<HTMLDivElement>('.modal__content', container);
		this._closeButton.addEventListener('click', () => this.close());

		this.container.addEventListener('mousedown', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement;
			if (target.classList.contains('modal')) {
				this.close();
			}
		});
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.events.emit('modal:close');
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}
}