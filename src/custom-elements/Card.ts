export class Card extends HTMLElement {
  static get observedAttributes() {
    return ['face', 'value', 'removewrapperclass'];
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
      this.updateStyle(attribute);
    }
  }

  updateStyle(attribute: string){
    if(attribute === "face") {
      // this.faceElem.textContent = this.getAttribute(attribute);
    } else if(attribute === "value") {
      this.valElem.textContent = this.getAttribute(attribute);
      if(this.getAttribute(attribute) === "404") {
        this.wrapper.classList.add("is-404");
        this.wrapper.classList.add("pattern2");
      }
    } else if(attribute === "removewrapperclass") {
      this.wrapper.classList.remove('card-wrapper');
    }
  }

  createElem(wrapper: HTMLDivElement, someVal: string): HTMLElement {;
    const newElem = document.createElement("div");
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
      height: 105px;
      width: 75px;
      border-radius: var(--card-radius);
      border: 1px solid black;
      box-shadow: -1px 3px 1px -2px rgba(0,0,0,.2), -1px 2px 2px 0 rgba(0,0,0,.14), -1px 1px 5px 0 rgba(0,0,0,.12);
      background-color: white;
      font-size: 16px;
    }
    .is-404 {
      writing-mode: vertical-lr;
      text-orientation: upright;
    }
    .card-wrapper div {
      margin: 3px 0px 0px 6px;
    }
    .is-404 div{
      margin: 3px 0px 0px 0px;
    }`
    return style;
  }
}