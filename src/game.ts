import { createCardDeck, shuffleDeck } from './cardUtils';
import { Card } from './Icard';
import { Player } from './player';
export class Game {
    modalEl: HTMLElement;
    gameEl: HTMLElement;
    isSubscriber = false;
    deck: Card[];
    originalDeck: Card[];
    player: Player;
    dealer: Player;
    constructor() {
        this.player = new Player();
        this.dealer = new Player();
        this.checkForSubscriber();
        this.modalEl = document.getElementById('modal');
        this.gameEl = document.getElementById('game');
        this.deck = createCardDeck();
        this.originalDeck = [...this.deck];
        shuffleDeck(this.deck);
        this.dealStartHand(this.deck);
        this.startGame();
    }
    
    updatePlayerHands(){
      const gameCard = document.createElement("game-card");
      gameCard.setAttribute('face', 'Toast');
      gameCard.setAttribute('face', 'Toaster');
      this.gameEl.appendChild(gameCard);
    }

    startGame(){
      window.requestAnimationFrame(() => {
        this.updatePlayerHands();
      })
    }
    /**
     * The dealer and player gets two cards from the start
     */
    dealStartHand(deck: Card[]){
      this.player.giveCards([deck.pop(), deck.pop()]);
      this.dealer.giveCards([deck.pop(), deck.pop()]);
    }
    
    createMessage(msg: string){
        const modalChild = this.modalEl.childNodes[0];
        this.modalEl.classList.add('open');
        this.modalEl.classList.remove('close');
        this.modalEl.replaceChild(document.createTextNode(msg), modalChild);
        setTimeout(() => {
            this.modalEl.classList.remove('open');
            this.modalEl.classList.add('close');
        }, 3000);
    }
    
    checkForSubscriber(){
        const monetization: any = (<any>document).monetization;
        setTimeout(()=> {
            if (monetization && monetization.state === 'started') { 
                this.createMessage('Hello Subscriber!');
                document.getElementById('game').classList.add('subscriber');
            }
        });
    }
}