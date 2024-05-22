import { HTMLBuilder } from "../utils/htmlBuilder";

type TextareaOptions = Readonly<{
  draggable?: boolean;
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
  private _options: TextareaOptions;
  private _textareaElement: HTMLTextAreaElement;
  private _addButton: HTMLButtonElement;
  private _dragger: SVGElement;

  private _isDragging: boolean = false;

  constructor(private readonly _container: HTMLDivElement, options?: TextareaOptions) {
    this._container.classList.add("textarea-container");
    this._container.id = "textarea-container";

    this._options = this._validateOptions(options || {});

    this._createInnerElements();

    this._addButton.addEventListener("click", this._handleClick.bind(this));

    HTMLBuilder.setVisibility(this._dragger, this._options.draggable ?? true);
    if (this._options.draggable) {
      this._applyDragging();
    }
  }

  public get value() {
    return this._textareaElement.value;
  }

  public setValue(value: string) {
    this._textareaElement.value = value;
  }

  public resetValue() {
    this.setValue("");
  }

  private _validateOptions(opts: TextareaOptions) {
    const temp = { ...opts };

    temp.draggable ??= true;
    temp.placeholder ??= "Type here...";
    temp.addButton ??= {};
    temp.addButton.classes ??= [];
    temp.addButton.text ??= "Add";
    temp.handlers ??= {};
    temp.handlers.add ??= new Function();

    return temp;
  }

  private _createInnerElements() {
    this._textareaElement = HTMLBuilder.createElement("textarea", this._container, {
      placeholder: this._options.placeholder,
    });

    this._addButton = HTMLBuilder.createElement("button", this._container, {
      class: ["add", ...(this._options.addButton?.classes || [])],
      text: this._options.addButton?.text,
    });

    this._dragger = HTMLBuilder.insertAdjacentHTML(
      this._container,
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

  private _handleClick() {
    if (this.value.trim() === "") return;

    if (typeof this._options.handlers?.add == "function") {
      this._options.handlers?.add(this.value);
    }

    this.resetValue();
  }

  private _applyDragging() {
    document.body.addEventListener("mousedown", (e) => {
      if (e.target !== this._dragger) return;
      document.body.style.userSelect = "none";
      this._isDragging = true;
    });
    document.body.addEventListener("mousemove", (e) => {
      if (!this._isDragging) return;
      this._textareaElement.style.height = parseFloat(window.getComputedStyle(this._textareaElement).height) + e.movementY + "px";
    });
    document.body.addEventListener("mouseup", () => {
      document.body.style.userSelect = "";
      this._isDragging = false;
    });
    document.body.addEventListener("mouseleave", () => {
      document.body.style.userSelect = "";
      this._isDragging = false;
    });
  }
}
