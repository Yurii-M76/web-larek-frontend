import { Order } from "./Order";
import { Model } from "./Model";
import { IEvents } from "../base/events";
import { IOrderBuilder, IOrder, IAddress, IContacts, IOrderList } from "../../types";

export class OrderBuilder extends Model<IOrderBuilder> {
	protected order: IOrder;

	constructor(data: Partial<IOrderBuilder>, events: IEvents) {
		super(data, events);
		this.order = new Order();
	}

	set delivery(delivery: IAddress) {
		this.order.payment = delivery.payment;
		this.order.address = delivery.address;
	}

	set contacts(contacts: IContacts) {
		this.order.email = contacts.email;
		this.order.phone = contacts.phone;
	}

	set orderList(orderList: IOrderList) {
		this.order.total = orderList.total;
		this.order.items = orderList.items;
	}

	get result(): IOrder {
		return this.order;
	}
}