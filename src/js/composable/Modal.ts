import { HTMLBuilder } from "../utils/htmlBuilder";

export class Modal {
  private _overlay: HTMLDivElement;
  private _modal: HTMLDivElement;

  constructor(private readonly _container: HTMLElement) {
    this._container.classList.add("modal-container", "hidden");
    this._container.id = "modal-container";

    this._createModalElements();

    this._overlay.addEventListener("click", this._leaveModal.bind(this));
  }

  private _createModalElements() {
    this._overlay = HTMLBuilder.createElement("div", this._container, {
      class: "overlay",
    });

    this._modal = HTMLBuilder.createElement("div", this._overlay, {
      class: "modal",
    });
  }

  private _leaveModal() {
    this._modal.innerHTML = "";
    HTMLBuilder.setVisibility(this._container, false);
  }

  public confirm(callback: (yes: boolean) => unknown) {
    HTMLBuilder.setVisibility(this._container, true);

    const [cancelBtn, deleteBtn] = HTMLBuilder.insertAdjacentHTML({
      into: this._modal,
      at: "beforeend",
      returnElementWithSelector: ".cancel, .delete",
      HTML: `
        <p class="title-large title">Delete Note</p>
        <p class="text-extramedium prompt">Are you sure you want to delete this note?</p>
        <div class="buttons">
            <button class="button light cancel">Cancel</button>
            <button class="button dark delete">Delete</button>
        </div>
    `,
    }) as [HTMLButtonElement, HTMLButtonElement];

    cancelBtn.addEventListener("click", this._leaveModal.bind(this));

    deleteBtn.addEventListener("click", () => {
      callback(true);
    });
  }
}
