import { IProduct } from '../../types';
import { IEvents } from '../base/events';

/**
 * Абстрактный класс для хранения и обработки данных,
 * использует EventEmitter
 */
export abstract class Model<T> {
	protected events: IEvents;
	constructor(data: Partial<T>, events: IEvents) {
		this.events = events;
		Object.assign(this, data);
	}

	emitChanges(event: string, data?: object) {
		this.events.emit(event, data ?? {});
	}
}
