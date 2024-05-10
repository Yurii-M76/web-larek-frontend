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

export class CatalogView<T> extends View<T> {
	protected events: IEvents;
	protected _id: string;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._category = ensureElement<HTMLSpanElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		
    this.container.addEventListener('click', () =>
			this.events.emit('card:select', { id: this.id })
		);
	}

	toggleCategoryClass(value: string) {
		const categoryClassObj: Record<string, string> = categoryClasses;
		if (value in categoryClassObj) {
			const classModifier = categoryClassObj[value];
			this.toggleClass(this._category, classModifier, true);
		}
	}

	set category(value: string) {
		this.toggleCategoryClass(value);
		this.setText(this._category, value);
	}
  get category() {
		return this._category.textContent;
	}

  set image(value: string) {
    this.setImage(this._image, CDN_URL + value, 'Изображение продукта');
  }
	set id(value: string) {
    this._id = value
  }
  get id() {
		return this._id;
	}

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: string) {
    if(value !== null) {
      this.setText(this._price, value);
    } else {
      this.setText(this._price, 'Бесценно');
    }
  }
}