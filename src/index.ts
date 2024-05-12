import './scss/styles.scss';
import { AppApi } from './components/model/AppApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CDN_URL, API_URL } from './utils/constants';
import {
	IContacts,
	IAddress,
	IForm,
	IFormCheck,
	IOrderList,
	IOrderResult,
	IProduct,
	TProductCard,
	TOrderData,
	TProductId,
	TPayment,
} from './types';
import { Page } from './components/view/Page';
import { Catalog } from './components/model/Catalog';
import { EventEmitter } from './components/base/events';
import { CatalogView } from './components/view/CatalogView';
import { Modal } from './components/view/Modal';
import { Basket } from './components/model/Basket';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';
import { OrderBuilder } from './components/model/OrderBuilder';
import { BasketCard } from './components/view/BasketCard';
import { ProductPreview } from './components/view/ProductPreview';

const pageContent = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();
const catalog = new Catalog({}, events);
const basket = new Basket({}, events);
const orderBuilder = new OrderBuilder({}, events);
const page = new Page(pageContent, events);
const modal = new Modal(modalContainer, events);
const productPreview = new ProductPreview(cloneTemplate(cardPreviewTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderView = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successOrder = new SuccessView(cloneTemplate(successTemplate), events);

events.on('catalog:items-changed', (data: IProduct[]) => {
	const cardList = data.map((item) => {
		const card = new CatalogView<TProductCard>(
			cloneTemplate(cardTemplate),
			events
		);
		return card.render(item);
	});
	page.render({ catalog: cardList });
});

events.on('card:select', (data: TProductId) => {
	!modalContainer.classList.contains('modal_active')
		? modal.open()
		: modal.close();

	const product = catalog.getId(data.id);
	if (product) {
		const previewData = Object.assign(product, {
			valid: Boolean(product.price),
			state: !basket.check(data.id),
		});
		modal.render({ content: productPreview.render(previewData) });
	}
});

events.on('basket:open', () => {
	modal.open();
	modal.render({
		content: basketView.render({
			price: basket.total,
			valid: basket.length === 0,
		}),
	});
});

events.on('basket:add', (data: TProductId) => {
	const product = catalog.getId(data.id);
	basket.add(product);
});

events.on('basket:remove', (data: TProductId) => {
	basket.remove(data.id);
});

events.on('basket:items-changed', (data: TProductId) => {
	page.render({ counter: basket.length });
	const cardList = basket.items.map((item, index) => {
		const cardData = Object.assign(item, { index: index + 1 });
		const card = new BasketCard(cloneTemplate(cardBasketTemplate), events);
		return card.render(cardData);
	});
	basketView.render({
		list: cardList,
		valid: basket.length === 0,
		price: basket.total,
	});
});

events.on('order:open', () => {
	const orderList: IOrderList = {
		total: basket.total,
		items: basket.getIdList(),
	};
	orderBuilder.orderList = orderList;

	modal.render({
		content: orderView.render({
			valid: orderView.valid,
		}),
	});
});

function validate(form: IForm) {
	const validity: IFormCheck = { valid: form.valid };
	form.render(validity);
}

events.on('order:input', () => {
	validate(orderView);
	const deliveryData: IAddress = {
		payment: orderView.payment as TPayment,
		address: orderView.address,
	};
	orderBuilder.delivery = deliveryData;
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			valid: contactsForm.valid,
		}),
	});
});

events.on('contacts:input', () => {
	validate(contactsForm);
	const contactsData: IContacts = {
		email: contactsForm.email,
		phone: contactsForm.phone,
	};
	orderBuilder.contacts = contactsData;
});

events.on('contacts:submit', () => {
	const apiObj: TOrderData = orderBuilder.result.readyОrder();
	api
		.postOrder(apiObj)
		.then((data: IOrderResult) => {
			modal.render({ content: successOrder.render({ total: data.total }) });
			orderView.clear();
			contactsForm.clear();
			basket.clear();
		})
		.catch(console.error);
});

events.on('success:submit', () => {
	modal.close();
});

events.on('modal:open', () => {
	page.lock(true);
});

events.on('modal:close', () => {
	page.lock(false);
});

// получаем данные
api
	.getProductList()
	.then((res) => {
		catalog.items = res;
	})
	.catch(console.error);
