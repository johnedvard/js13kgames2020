export class Card extends HTMLElement {
  static get observedAttributes() {
    return ['face', 'value'];
  }
  wrapper: HTMLDivElement;
  faceElem: HTMLElement;
  valElem: HTMLElement;
  constructor() {
    super();
    this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("class","card-wrapper");
    const style = this.createStyle();
    this.shadowRoot.append(style, this.wrapper);
    this.faceElem = this.createElem(this.wrapper, "");
    this.valElem = this.createElem(this.wrapper, "");
  }

  disconnectedCallback(){
  }

  connectedCallback(){
  }

  attributeChangedCallback(attribute: string, oldValue: string, newValue: string) {
    if(newValue !== oldValue) {
      this.updateFace(attribute);
    }
  }

  updateFace(attribute: string){
    this.faceElem.textContent = this.getAttribute(attribute);
  }

  createElem(wrapper: HTMLDivElement, someVal: string): HTMLElement {;
    const newElem = document.createElement("p");
    newElem.appendChild(document.createTextNode(someVal));
    wrapper.appendChild(newElem);
    return newElem;
  }
  /**
   *  Create some CSS to apply to the shadow dom
   */ 
  createStyle(): HTMLStyleElement {
    const style = document.createElement('style');
    style.textContent = `.card-wrapper { 
      display: flex;
      height: 150px; 
      width: 150px; 
      border: 1px solid black;
    }`
    return style;
  }
}