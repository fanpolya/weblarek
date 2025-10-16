import { ensureElement } from "../../utils/utils" 
import { Component } from "../base/Component" 
import { IEvents } from "../base/Events"

export class Modal extends Component<HTMLElement> {
  protected modalCloseButtonElement: HTMLButtonElement;
  protected modalContentElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.modalCloseButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalContentElement = ensureElement<HTMLElement>('.modal__content', this.container);  

    this.modalCloseButtonElement.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        this.close()
      }
    });
  }

  set content(value: HTMLElement){
    this.modalContentElement.replaceChildren(value);
  }

  open(content: HTMLElement) {
    this.modalContentElement.replaceChildren(content);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }
}