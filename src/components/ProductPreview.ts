import { ICatalog } from "../types";
import { ensureElement } from "../utils/utils";
import { CatalogView } from "./CatalogView";
import { IEvents } from "./base/events";

export class ProductPreview extends CatalogView<ICatalog> {
	protected _description: HTMLParagraphElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._description = ensureElement<HTMLParagraphElement>('.card__text', container);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);

		this.button.addEventListener('click', () => {
      this.events.emit('basket:add', { id: this.id });
		});
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get check() {
		return !this.button.disabled;
	}

	set check(have: boolean) {
		this.setDisabled(this.button, !have);
	}
}