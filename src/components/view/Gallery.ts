import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
  }

  render(data?: Partial<IGalleryData>): HTMLElement {
    this.container.innerHTML = ""; 

    this.container.replaceChildren(...data.items);
    return this.container; 
  } 
} 