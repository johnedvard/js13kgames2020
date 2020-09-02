import { Card } from './Icard';

export class Player {
  private _hand: Card[] = [];
  totalChips: number
  tmpRemovedChips = 0;
  isDealer = false;
  display404Cards = false;
  constructor(isDealer = false) {
    this.isDealer = isDealer;
    this.totalChips = 110;
  }
  giveCards(cards: Card[]) {
    cards.forEach(c => this.hand.push(c));

  }
  removeChips(chips: number){
    this.tmpRemovedChips += chips;
    this.totalChips -= chips;
  }
  giveChips(chips: number){
    this.tmpRemovedChips = 0;
    this.totalChips += chips;
  }
  discardHand(){
    this._hand = [];
  }
  get hand(): Card[] {
    return this._hand;
  }
}