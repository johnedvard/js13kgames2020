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
      border: 10px double white;
      color: white;
      font-size: 20px;
      font-weight: bold;
      box-shadow: -1px 1px 2px 1px rgba(0,0,0,0.8);
      background:
      radial-gradient(circle at 100% 50%, transparent 20%, rgba(255,255,255,.3) 21%, rgba(255,255,255,.3) 34%, transparent 35%, transparent),
      radial-gradient(circle at 0% 50%, transparent 20%, rgba(255,255,255,.3) 21%, rgba(255,255,255,.3) 34%, transparent 35%, transparent) 0 -50px;
      background-color: slategray;
      background-size:75px 100px;
    }`
    return style;
  }
}