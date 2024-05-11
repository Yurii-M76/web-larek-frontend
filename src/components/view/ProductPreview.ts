import { TPreviewCard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { CatalogView } from './CatalogView';

export class ProductPreview extends CatalogView<TPreviewCard> {
	protected _description: HTMLParagraphElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._description = ensureElement<HTMLParagraphElement>(
			'.card__text',
			container
		);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);

		this.button.addEventListener('click', () => {
			this.events.emit('basket:add', { id: this.id });
		});
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get valid() {
		return !this.button.disabled;
	}

	set valid(state: boolean) {
		this.setDisabled(this.button, !state);
	}
}
