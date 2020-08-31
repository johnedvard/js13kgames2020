export class Chip extends HTMLElement {
  wrapper: HTMLDivElement;
  constructor() {
    super();
    this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'
    this.wrapper = document.createElement("div");
    this.createElem(this.wrapper, "10");
    this.wrapper.setAttribute("class","chip-wrapper");
    const style = this.createStyle();
    this.shadowRoot.append(style, this.wrapper);
  }

  disconnectedCallback(){
  }

  connectedCallback(){
  }

  attributeChangedCallback(attribute: string, oldValue: string, newValue: string) {
  }

  createElem(wrapper: HTMLDivElement, someVal: string): HTMLElement {;
    const newElem = document.createElement("span");
    newElem.appendChild(document.createTextNode(someVal));
    wrapper.appendChild(newElem);
    return newElem;
  }
  /**
   *  Create some CSS to apply to the shadow dom
   */ 
  createStyle(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `.chip-wrapper { 
      display: flex;
      align-items: center;
      justify-content: center;
      height: 55px;
      width: 55px;
      border-radius: 50%;
      border: 4px double black;
      background-color: green;
    }`
    return style;
  }
}