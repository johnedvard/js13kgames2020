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
    if(attribute === "face") {
      // this.faceElem.textContent = this.getAttribute(attribute);
    } else if(attribute === "value") {
      this.valElem.textContent = this.getAttribute(attribute);
      if(this.getAttribute(attribute) === "404") {
        this.wrapper.classList.add("is-404");
      }
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
      border-radius: 5px;
      border: 1px solid black;
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