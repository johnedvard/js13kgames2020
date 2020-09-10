import { Card } from './Icard';
import { SFX } from './sfx';

export const createCardDeck = (): Card[] => {
  const cards = [];
  const faces = ["heart", "club", "diamond", "spade"];
  for(let face = 0; face < 4; face++) {
    for(let val = 1; val <= 10; val++) {
      cards.push({value: val, face: faces[face], is404: Math.random() > 0.4 })
    }
  }
  return cards;
}

/**
 * mutates the input deck.
 * @param deck deck of cards to shuffle
 */
export const shuffleDeck = (deck: Card[], sfx: SFX): void => {
  sfx.playShuffleSound();
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}