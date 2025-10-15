import { IOrderResponse } from "../../types";
import { ensureElement } from "../../utils/utils" 
import { Component } from "../base/Component" 
import { IEvents } from "../base/Events"


export class Success extends Component<IOrderResponse> {
  protected orderTitleElement: HTMLElement;
  protected description: HTMLElement;
  protected orderButtonCloseElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.orderTitleElement = ensureElement<HTMLElement>('.order-success__title', container);
    this.description = ensureElement<HTMLElement>('.order-success__description', container);  
    this.orderButtonCloseElement = ensureElement<HTMLButtonElement>('.order-success__close', container);  

    this.orderButtonCloseElement.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }
    set total(value: number) {
      this.description.textContent = `Списано ${value} синапсов`;
    }
}