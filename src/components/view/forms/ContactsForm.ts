import { ensureElement } from "../../../utils/utils" 
import { IEvents } from "../../base/Events"
import { Form } from "./Form";

export class ContactsForm extends Form {
    protected formEmailInputElement: HTMLInputElement;
    protected formTelephoneInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
      super(events, '#contacts', 'contacts:submit');
      this.formEmailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
      this.formTelephoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
      
      this.formEmailInputElement.addEventListener('input', () => {
        this.events.emit('contacts:email', { value: this.formEmailInputElement.value });
      });
    

      this.formTelephoneInputElement.addEventListener('input', () => {
        this.events.emit('contacts:phone', { value: this.formTelephoneInputElement.value });
      });
    }

    reset(): void {
      this.formEmailInputElement.value = '';
      this.formTelephoneInputElement.value = '';
    }
}