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

export class CardView<T> extends View<T> {
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

    this.container.addEventListener('click', () =>
			this.events.emit('card:select', { id: this.id })
		);
  }

  protected toggleCategoryClass(value: string) {
		this.toggleClass(this._category, categoryClasses[value], true);
	}

  set id(value: string) {
    this._id = value
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