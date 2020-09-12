import { Card } from './Icard';

export class Player {
  private _hand: Card[] = [];
  totalChips: number
  tmpRemovedChips = 0;
  isDealer = false;
  display404Cards = false;
  constructor(isDealer = false) {
    this.isDealer = isDealer;
    this.totalChips = parseInt(localStorage.getItem("jer-chips")) || 110;
  }
  giveCards(cards: Card[]) {
    cards.forEach(c => this.hand.push(c));

  }
  removeChips(chips: number){
    this.tmpRemovedChips += chips;
    this.totalChips -= chips;
    localStorage.setItem("jer-chips", ""+this.totalChips);
  }
  giveChips(chips: number){
    this.tmpRemovedChips = 0;
    this.totalChips += chips;
  }
  discardHand(){
    this._hand = [];
  }
  giveSubscriptionChips(chips: number) {
    this.totalChips += chips;
  }
  get hand(): Card[] {
    return this._hand;
  }
}