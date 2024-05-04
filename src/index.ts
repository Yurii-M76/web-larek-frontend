import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from "./components/base/events";
import { IProduct } from './types';

// Все шаблоны
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
cardTemplate.content.cloneNode(true);

const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const gallery = ensureElement<HTMLElement>('.gallery');


const api = new Api(API_URL);
const events = new EventEmitter();

// Получаем каталог продуктов с сервера
api.get('/product')
	.then((result: ApiListResponse<IProduct>) => {
		console.log(result.items);
	})
	.catch(err => {
			console.error(err);
	});