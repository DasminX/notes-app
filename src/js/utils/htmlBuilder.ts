type createOptions = Readonly<{
  readonly id?: string;
  readonly class?: string | string[];
  readonly text?: string;
  readonly src?: string;
  readonly dataset?: Record<string, string>;
  readonly styles?: Record<keyof CSSStyleDeclaration, string>;
  readonly placeholder?: string;
}>;

export class HTMLBuilder {
  public static createElement<T extends HTMLElement | SVGElement>(
    tag: keyof HTMLElementTagNameMap,
    parent: HTMLElement,
    opts?: createOptions
  ): T {
    const el = document.createElement(tag);

    if (opts?.id) {
      el.id = opts.id;
    }
    if (opts?.class) {
      if (Array.isArray(opts.class)) {
        el.classList.add(...opts.class);
      } else {
        el.classList.add(opts.class);
      }
    }

    if (opts?.text) {
      el.innerText = opts.text;
    }

    if (opts?.src && "src" in el) {
      el.src = opts.src;
    }

    if (opts?.dataset) {
      for (const [dataKey, value] of Object.entries(opts.dataset)) {
        el.dataset[dataKey] = value;
      }
    }

    if (opts?.styles) {
      for (const [styleName, value] of Object.entries(opts.styles)) {
        el.style[styleName] = value;
      }
    }

    if (opts?.placeholder && "placeholder" in el) {
      el.placeholder = opts.placeholder;
    }

    return parent.appendChild(el) as T;
  }

  // prettier-ignore
  public static insertAdjacentHTML<T extends Element>({ into, at, HTML }: { into: Element; at: InsertPosition; HTML: string }): void;
  // prettier-ignore
  public static insertAdjacentHTML<T extends Element>({ into, at, HTML, returnElementWithSelector }: { into: Element; at: InsertPosition; HTML: string, returnElementWithSelector: string }): T;
  // prettier-ignore
  public static insertAdjacentHTML<T extends Element>({ into, at, HTML, returnElementWithSelector }: { into: Element; at: InsertPosition; HTML: string, returnElementWithSelector: string[] }): T[];
  // prettier-ignore
  public static insertAdjacentHTML<T extends Element>({ into, at, HTML, returnElementWithSelector }: { into: Element; at: InsertPosition; HTML: string, returnElementWithSelector?: string | string[] }): T | T[] | void {
    into.insertAdjacentHTML(at, HTML);
    
    if (typeof returnElementWithSelector === "string") {
      return into.querySelector(returnElementWithSelector) as T;
    } else if (Array.isArray(returnElementWithSelector)) {
      const elements: T[] = [];
      
      returnElementWithSelector.forEach(selector => {
        elements.push(into.querySelector(selector))
      });

      return elements;
    }
  }

  public static setVisibility(element: Element, visible: boolean): void {
    if (!(element instanceof Element)) {
      console.warn("[setVisibility] No instanceof element:", element);
      return;
    }
    element.classList[visible ? "remove" : "add"]("hidden");
  }
}
