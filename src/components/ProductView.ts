import { ICatalog } from "../types";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IEvents } from "./base/events";

const categoryClasses: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'другое': 'card__category_other',
  'дополнительное': 'card__category_additional',
  'кнопка': 'card__category_button',
  'хард-скил': 'card__category_hard',
};

export class ProductView<T> extends View<T> {
  protected _id: string;
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected events: IEvents;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

    this.container.addEventListener('click', () => {
			this.events.emit('card:select', { id: this.id })
    });
  }

  protected toggleCategoryClass(value: string) {
		this.toggleClass(this._category, categoryClasses[value], true);
	}

  set id(value: string) {
    this._id = value
  }
  get id() {
		return this._id;
	}

  set category(value: string) {
		this.toggleCategoryClass(value);
		this.setText(this._category, value);
  }

  set title(value: string) {
    this.setText(this._title, value);
  }
  
  set image(value: string) {
    this.setImage(this._image, CDN_URL + value, 'Картинка продукта');
  }

  set price(value: string) {
    if(value !== null) {
      this.setText(this._price, value);
    } else {
      this.setText(this._price, 'Бесценно');
    }
  }
}

type IPreviewCard = ICatalog & { valid: boolean; state: boolean };
export class PreviewCard extends ProductView<IPreviewCard> {
	protected _description: HTMLParagraphElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._description = ensureElement<HTMLParagraphElement>('.card__text', container);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);

		// this.button.addEventListener('click', () => {
		// 	if (this.button.textContent === BUY_BUTTON_TEXT) {
		// 		this.events.emit('basket:add', { id: this.id });
		// 	} else {
		// 		this.events.emit('basket:remove', { id: this.id });
		// 	}
		// });
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

	// set state(state: boolean) {
	// 	if (!this.valid) {
	// 		this.setText(this.button, UNABLE_BUTTON_TEXT);
	// 	} else {
	// 		const text = state ? BUY_BUTTON_TEXT : REMOVE_BUTTON_TEXT;
	// 		this.setText(this.button, text);
	// 	}
	// }
}