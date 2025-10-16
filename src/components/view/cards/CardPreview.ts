import { Card } from "./Card"; 
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils" 

export class CardPreview extends Card {
  protected description: HTMLElement;
  protected cardButtonElement: HTMLButtonElement;
  public currentProduct: IProduct | null = null;
  private _inBasket = false;

  constructor(protected events: IEvents) {
    super(events, '#card-preview');
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardButtonElement.addEventListener('click', () => {
    if (this.currentProduct) {
        this.events.emit('card:toggle', this.currentProduct);
      }
    });
  }

  render(product: IProduct): HTMLElement {
    this.currentProduct = product;
    this.renderBase(product);
    this.description.textContent = product.description;

    if (product.price === null) {
      this.cardButtonElement.setAttribute('disabled', 'true');
      this.cardButtonElement.textContent = 'Недоступно';
    } else {
      this.cardButtonElement.removeAttribute('disabled');
      this.updateButtonText()
    }
    return this.container;
  }
  
  set inBasket(value: boolean) {
    this._inBasket = value;
    this.updateButtonText();
  }

  private updateButtonText(): void {
    if (this.cardButtonElement.getAttribute('disabled') !== 'true') {
      this.cardButtonElement.textContent = this._inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }
}