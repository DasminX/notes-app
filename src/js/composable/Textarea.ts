import { HTMLBuilder } from "../utils/htmlBuilder";

type TextareaOptions = Readonly<{
  placeholder?: string;
  addButton?: {
    classes?: string[];
    text?: string;
  };
  handlers?: {
    add?: Function;
  };
}>;

export class Textarea {
  private options: TextareaOptions;
  private textareaElement: HTMLTextAreaElement;
  private addButton: HTMLButtonElement;

  // TODO
  private dragger: SVGElement;
  private isDragging: boolean = false;

  constructor(private readonly container: HTMLDivElement, options?: TextareaOptions) {
    this.container.classList.add("textarea-container");
    this.container.id = "textarea-container";

    this.options = this.validateOptions(options || {});
    this.createInnerElements();

    this.addButton.addEventListener("click", this.handleClick.bind(this));
  }

  public get value() {
    return this.textareaElement.value;
  }

  public resetValue() {
    this.textareaElement.value = "";
  }

  private validateOptions(opts: TextareaOptions) {
    const temp = { ...opts };

    temp.placeholder ??= "Type here...";
    temp.addButton ??= {};
    temp.addButton.classes ??= [];
    temp.addButton.text ??= "Add";
    temp.handlers ??= {};
    temp.handlers.add ??= new Function();

    return temp;
  }

  private createInnerElements() {
    this.textareaElement = HTMLBuilder.createElement("textarea", this.container, {
      placeholder: this.options.placeholder,
    });

    this.addButton = HTMLBuilder.createElement("button", this.container, {
      class: ["add", ...(this.options.addButton?.classes || [])],
      text: this.options.addButton?.text,
    });

    this.dragger = HTMLBuilder.insertAdjacentHTML(
      this.container,
      "beforeend",
      ".dragger",
      `
      <svg
        class="dragger"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
          <path d="M15.333 12.3467V15.3333H12.3463L15.333 12.3467Z" fill="#3B3C3E" />
          <path d="M15.333 7.68002V10.32L10.3197 15.3334H7.67969L15.333 7.68002Z" fill="#5B5C5E" />
          <path d="M15.3331 3.01334V5.65334L5.65306 15.3333H3.01306L15.3331 3.01334Z" fill="#858686" />
      </svg>
    `
    );
  }

  private handleClick() {
    if (this.value.trim() === "") return;

    if (typeof this.options.handlers?.add == "function") {
      this.options.handlers?.add(this.value);
    }

    this.resetValue();
  }
}
