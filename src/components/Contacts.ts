import { OrderForm } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class Contacts extends Form<OrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phopne(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    } 
}