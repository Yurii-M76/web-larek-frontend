import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { IApi, ICatalog } from './types/index';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from "./components/base/events";
import { CatalogModel } from './components/CatalogModel';
import { PageView } from './components/PageView';
import { CardView } from './components/CardView';

const api = new Api(API_URL);
const events = new EventEmitter();
const catalog = new CatalogModel([], events);

// Шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const pageContent = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');


const page = new PageView(pageContent, events);
const cardView = new CardView(cloneTemplate(cardTemplate), events);

events.on('catalog:items-changed', (data: ICatalog[]) => {
	const cardList = data.map((item) => {
		const card = new CardView<ICatalog>(cloneTemplate(cardTemplate), events);
		return card.render(item);
	});
	page.render({ catalog: cardList });
});





// Получаем данные с Api
api.get('/product')
  .then((res: IApi) => {
    catalog.data = res.items;
  })
  .catch(console.error);