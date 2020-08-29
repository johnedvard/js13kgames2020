import { Card } from './Icard';

export class Player {
  hand: Card[] = [];
  constructor() {

  }
  giveCards(cards: Card[]) {
    cards.forEach(c => this.hand.push(c));
  }
}