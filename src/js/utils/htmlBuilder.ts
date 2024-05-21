type createOptions = Readonly<{
  readonly id?: string;
  readonly class?: string | string[];
  readonly text?: string;
  readonly src?: string;
  readonly dataset?: Record<string, string>;
  readonly styles?: Record<keyof CSSStyleDeclaration, string>;
}>;

export class HTMLBuilder {
  public static createElement<T extends HTMLElement>(
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

    return parent.appendChild(el) as T;
  }
}
