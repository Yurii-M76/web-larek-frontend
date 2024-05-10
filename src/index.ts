import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { IApi, ICatalog, TProductId } from './types/index';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from "./components/base/events";
import { CatalogModel } from './components/CatalogModel';
import { PageView } from './components/PageView';
import { CatalogView } from './components/CatalogView';
import { ProductPreview } from './components/ProductPreview';
import { View } from './components/base/View';
import { Modal } from './components/Modal';
import { Model } from './components/base/Model';
import { BasketModel } from './components/BasketModel';
import { BasketView } from './components/BasketView';
import { BasketItems } from './components/BasketItems';

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const pageContent = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');

const api = new Api(API_URL);
const events = new EventEmitter();
const catalogModel = new CatalogModel([], events);

const page = new PageView(pageContent, events);
const previewCard = new ProductPreview(cloneTemplate(cardPreviewTemplate), events);
const modal = new Modal(modalContainer, events);
const basket = new BasketModel({}, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);

events.on('catalog:items-changed', (data: ICatalog[]) => {
	const productList = data.map((item) => {
		const catalogView = new CatalogView<ICatalog>(cloneTemplate(cardTemplate), events);
		return catalogView.render(item);
	});
	page.render({ catalog: productList });
});

events.on('card:select', (data: TProductId) => {
	modal.open();
	const product = catalogModel.find(data.id);
	console.log('card:select')
	if (product) {
		const previewData = Object.assign(product, {
			check: Boolean(product.price),
			have: !basket.has(data.id),
		});
		modal.render({ content: previewCard.render(previewData) });
	}
});

events.on('basket:open', () => {
	modal.open();
	console.log('basket:open')
	modal.render({
		content: basketView.render({
			total: basket.total,
			valid: basket.length === 0,
		}),
	});
});

events.on('basket:add', (data: TProductId) => {
	const product = catalogModel.find(data.id);
	basket.add(product);
	console.log('basket:add')
});

events.on('basket:items-changed', (data: TProductId) => {
	previewCard.render({ valid: true, state: !basket.has(data.id) });

	page.render({ counter: basket.length });
	const cardList = basket.items.map((item, index) => {
		const cardData = Object.assign(item, { index: index + 1 });
		const card = new BasketItems(cloneTemplate(cardBasketTemplate), events);
		return card.render(cardData);
	});
	previewCard.render({
		list: cardList,
		price: basket.total,
		valid: basket.length === 0,
	});
});

//================================================


//================================================
// Получаем данные с Api
api.get('/product')
  .then((res: IApi) => {
    catalogModel.data = res.items;
  })
  .catch(console.error);