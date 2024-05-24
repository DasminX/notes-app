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
  public static createElement<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, parent: HTMLElement, opts?: createOptions): T {
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

  public static insertAdjacentHTML<T extends Element | null>({
    into,
    at,
    HTML,
    returnElementWithSelector = "NO-SELECTOR",
  }: {
    into: Element;
    at: InsertPosition;
    HTML: string;
    returnElementWithSelector?: string;
  }): T | T[] {
    into.insertAdjacentHTML(at, HTML);

    if (returnElementWithSelector === "NO-SELECTOR") return null;

    if (returnElementWithSelector.includes(",")) {
      const elements: T[] = [];
      returnElementWithSelector.split(",").forEach((segment) => {
        elements.push(into.querySelector(segment));
      });

      return elements;
    } else {
      return into.querySelector(returnElementWithSelector) as T;
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
