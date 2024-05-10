import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { IApi, ICatalog, TProductId } from './types/index';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from "./components/base/events";
import { CatalogModel } from './components/CatalogModel';
import { PageView } from './components/PageView';
import { PreviewCard, ProductView } from './components/ProductView';
import { View } from './components/base/View';
import { Modal } from './components/Modal';

const api = new Api(API_URL);
const events = new EventEmitter();
const catalog = new CatalogModel([], events);

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
const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate), events);
const modal = new Modal(modalContainer, events);


events.on('catalog:items-changed', (data: ICatalog[]) => {
	const productList = data.map((item) => {
		const catalog = new ProductView<ICatalog>(cloneTemplate(cardTemplate), events);
		return catalog.render(item);
	});
	page.render({ catalog: productList });
});

events.on('card:select', (data: TProductId) => {
	modal.open();
	const product = catalog.find(data.id);

	if (product) {
		const previewData = Object.assign(product);
		modal.render({ content: previewCard.render(previewData) });
	}
});

//================================================




//================================================
// Получаем данные с Api
api.get('/product')
  .then((res: IApi) => {
    catalog.data = res.items;
  })
  .catch(console.error);