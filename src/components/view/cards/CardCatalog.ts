import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export class CardCatalog extends Card {
  private currentProduct: IProduct | null = null; 

  constructor(protected events: IEvents) {
    super(events, '#card-catalog');

    this.container.addEventListener('click', () => {
    if (this.currentProduct) {
      this.events.emit('card:select', this.currentProduct);
      }
    });
  } 

  render(product: IProduct): HTMLElement { 
    this.currentProduct = product;
    this.renderBase(product);
    return this.container; 
  } 
}