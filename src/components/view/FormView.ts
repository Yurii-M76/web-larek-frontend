import { IFormCheck } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { View } from '../base/View';
import { IEvents } from '../base/events';

export class Form<T> extends View<IFormCheck> {
	protected container: HTMLFormElement;
	protected events: IEvents;
	protected inputList: HTMLInputElement[];
	protected _submit: HTMLButtonElement;
	protected _error: HTMLSpanElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.events = events;
		this.inputList = ensureAllElements<HTMLInputElement>(
			'.form__input',
			container
		);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this._error = ensureElement<HTMLSpanElement>('.form__errors', container);

		this.container.addEventListener('input', () => {
			this.emitInput();
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	emitInput() {
		this.events.emit(`${this.container.name}:input`);
	}

	get valid(): boolean {
		return this.inputList.every((item) => item.value.length > 0);
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set error(value: string) {
		this.setText(this._error, value);
	}

	clear() {
		this.container.reset();
	}

	render(data?: Partial<T> & IFormCheck): HTMLElement {
		const { valid, ...inputs } = data;
		super.render({ valid });
		Object.assign(this, inputs);
		return this.container;
	}
}
