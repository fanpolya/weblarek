import { ensureElement } from "../../../utils/utils" 
import { Component } from "../../base/Component" 
import { IEvents } from "../../base/Events"
import { IValidationErrors } from "../../../types";

export abstract class Form extends Component<HTMLElement> {
    protected formSubmitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this.formSubmitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    set error(message: string) {
        this.formErrorsElement.textContent = message;
    }

    clearErrors(): void {
        this.formErrorsElement.textContent = '';
    }

    resetForm(): void {
        this.clearErrors();
        this.formSubmitButtonElement.toggleAttribute('disabled', true);
    }

    setSubmitEnabled(enabled: boolean): void {
        this.formSubmitButtonElement.disabled = !enabled;
    }

    toggleErrorClass(value: boolean): void {
        this.formErrorsElement.classList.toggle('form__errors-active', value);
    }

    abstract checkValidation(errors: IValidationErrors): boolean;
}