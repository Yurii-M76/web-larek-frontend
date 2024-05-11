import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './FormView';
import { IContacts, IAddress } from '../../types';

export class OrderForm extends Form<IAddress> {
	protected buttonContainer: HTMLDivElement;
	protected onlineButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			container
		);
		[this.onlineButton, this.cashButton] = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this.addressInput = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this.buttonContainer.addEventListener('click', (evt) => {
			if (evt.target === this.onlineButton || evt.target === this.cashButton) {
				const button = evt.target as HTMLButtonElement;
				this.resetButtons();
				this.toggleClass(button, 'button_alt-active', true);
				this.emitInput();
			}
		});
	}

	protected toggleCard(state = true) {
		this.toggleClass(this.onlineButton, 'button_alt-active', state);
	}

	protected toggleCash(state = true) {
		this.toggleClass(this.cashButton, 'button_alt-active', state);
	}

	protected resetButtons() {
		this.toggleCard(false);
		this.toggleCash(false);
	}

	protected getActiveButton(): HTMLButtonElement | null {
		if (this.onlineButton.classList.contains('button_alt-active')) {
			return this.onlineButton;
		} else if (this.cashButton.classList.contains('button_alt-active')) {
			return this.cashButton;
		} else {
			return null;
		}
	}

	clear(): void {
		super.clear();
		this.resetButtons();
	}

	get payment(): string {
		const buttonActive = this.getActiveButton();
		const result = buttonActive ? buttonActive.name : '';
		return result;
	}

	get address(): string {
		return this.addressInput.value;
	}

	get valid(): boolean {
		const isInputValid = super.valid;
		return isInputValid && this.payment !== '';
	}

	set valid(value: boolean) {
		super.valid = value;
	}
}
