import { createCardDeck, shuffleDeck } from './cardUtils';
import { Card } from './Icard';
import { Player } from './player';
export class Game {
    modalEl: HTMLElement;
    gameEl: HTMLElement;
    playerEl: HTMLElement;
    dealerEl: HTMLElement;
    deckEl: HTMLElement;
    betzoneEl: HTMLElement;
    btnHit: HTMLElement;
    btnHold: HTMLElement;
    btnBet: HTMLElement;
    btnNext: HTMLElement;
    totalChipsEl: HTMLElement;
    dealerTotalEl: HTMLElement;
    playerTotalEl: HTMLElement;
    isSubscriber = false;
    deck: Card[];
    originalDeck: Card[];
    player: Player;
    dealer: Player;
    display404Cards = false;
    // playStates: string[] = ["start", "betted", "betted2x", "hold", "playerEnd", "dealerEnd"];
    currentState = "start";
    constructor() {
        this.player = new Player();
        this.dealer = new Player();
        this.checkForSubscriber();
        this.modalEl = document.getElementById('modal');
        this.gameEl = document.getElementById('game');
        this.dealerEl = document.getElementById('dealer');
        this.playerEl = document.getElementById('player');
        this.deckEl = document.getElementById('deck');
        this.betzoneEl = document.getElementById('betzone');
        this.btnHit = document.getElementById('btnHit');
        this.btnHold = document.getElementById('btnHold');
        this.btnBet = document.getElementById('btnBet');
        this.btnNext = document.getElementById('btnNext');
        this.totalChipsEl = document.getElementById('totalChips');
        this.dealerTotalEl = document.getElementById('dealerTotal');
        this.playerTotalEl = document.getElementById('playerTotal');
        this.deck = createCardDeck();
        this.originalDeck = [...this.deck];
        shuffleDeck(this.deck);
        this.dealStartHand(this.deck);
        this.startGame();
        this.addEventListeners();
        this.updateButtonStates();
        this.updateChipsText();
    }
    
    addEventListeners(){
      this.btnHit.addEventListener("click", () => {
        this.dealCard(this.player);
        this.updateButtonStates();
      });
      this.btnHold.addEventListener("click", () => {
        this.currentState = "hold";
        this.reveal404Cards();
        console.log("reveal cards for player. Make dealer AI to draw cards in order to beat player");
        this.currentState = "playerEnd";
        this.updateButtonStates();
        this.updateTurnState();
      });
      this.btnBet.addEventListener("click", () => {
        if(this.currentState === "betted") {
          this.currentState = "betted2x";
        } else {
          this.currentState = "betted";
        }
        this.betzoneEl.appendChild(document.createElement("game-chip", {}));
        this.player.removeChips(10);
        this.updateButtonStates();
        this.updateChipsText();
      });
      this.btnNext.addEventListener("click", () => {
        this.startNextRound();
      });
    }

    startNextRound(){
      this.display404Cards = false;
      this.removeChipsFromDom();
      this.removeCardsFromDom();
      this.player.discardHand();
      this.dealer.discardHand();
      this.currentState = "start";
      this.updatePlayersTotalSum();
      this.dealStartHand(this.deck);
      this.updatePlayerHands();
      this.updateButtonStates();
      this.updateChipsText();
    }

    updateChipsText(){
      this.totalChipsEl.textContent = ""+this.player.totalChips;
    }

    updateButtonStates(){
      this.enableButtons([this.btnHold, this.btnBet, this.btnHit, this.btnNext]);
      if (this.currentState === "start") {
        this.disableButtons([this.btnHold, this.btnHit, this.btnNext]);
      } else if (this.currentState === "hold") {
        this.disableButtons([this.btnHold, this.btnBet, this.btnHit, this.btnNext]);
      } else if (this.currentState === "betted") {
        this.disableButtons([this.btnNext]);
      } else if (this.currentState === "betted2x") {
        this.disableButtons([this.btnBet, this.btnNext]);
      } else if (this.currentState === "playerEnd") {
        this.disableButtons([this.btnHold, this.btnBet, this.btnHit, this.btnNext]);
      } else if (this.currentState === "dealerEnd") {
        this.disableButtons([this.btnHold, this.btnBet, this.btnHit]);
      }
    }

    updateTurnState(){
      if(this.currentState === "playerEnd") {
        this.dealersTurn();
      } else if(this.currentState === "dealerEnd") {
        this.declareWinner();
      }
    }

    declareWinner(){
      const totalSumPlayer = this.getTotalValue(this.playerEl);
      const totalSumDealer = this.getTotalValue(this.dealerEl);
      let youWin = false;
      if(totalSumPlayer - 21 <= 0) {
        if(totalSumDealer -21 > 0) {
          youWin = true;
        } else if(totalSumPlayer > totalSumDealer && totalSumDealer -21 <= 0) {
          youWin = true;
        }
      }
      if(youWin) {
        this.player.giveChips(this.player.tmpRemovedChips*2.5);
        this.createMessage("You WIN, hurray");
      } else {
        this.player.giveChips(0);
        this.createMessage("You LOOSE, too bad");
      }
      this.updateChipsText();
    }

    dealersTurn() {
      this.updatePlayersTotalSum();
      if(this.checkIfDealerShouldDrawCard()){
        this.dealCard(this.dealer);
        setTimeout(() => {
          this.dealersTurn();
        }, 1000);
      } else {
        this.currentState = "dealerEnd";     
        this.updateTurnState();
        this.updateButtonStates();
      }
    }

    checkIfDealerShouldDrawCard(){
      const totalSumPlayer = this.getTotalValue(this.playerEl);
      const totalSumDealer = this.getTotalValue(this.dealerEl);
      if(totalSumPlayer > 21){
        return false;
      } else if(totalSumDealer < 21 && totalSumDealer < totalSumPlayer) {
        return true;
      }
      return false;
    }
    enableButtons(buttonElements: HTMLElement[]){
      buttonElements.forEach(btnEl => btnEl.removeAttribute("disabled"));
    }

    disableButtons(buttonElements: HTMLElement[]){
      buttonElements.forEach(btnEl => btnEl.setAttribute("disabled", "true"));
    }

    updatePlayersTotalSum(){
      const totalSumPlayer = this.getTotalValue(this.playerEl);
      const totalSumDealer = this.getTotalValue(this.dealerEl);
      if(totalSumPlayer && totalSumDealer) {
        this.playerTotalEl.textContent = "Sum: " + totalSumPlayer;
        this.dealerTotalEl.textContent = "Sum: " + totalSumDealer;
      } else {
        this.playerTotalEl.textContent = "";
        this.dealerTotalEl.textContent = "";
      }
    }

    getTotalValue(aPlayerEl: HTMLElement){
      let res = 0;
      aPlayerEl.childNodes.forEach(gameCardEl => {
        res += parseInt((<HTMLElement>gameCardEl).getAttribute("value"));
      });
      return res;
    }

    reveal404Cards(){
      this.display404Cards = true;
      this.updatePlayerHands();
    }

    dealCard(toPlayer: Player){
      toPlayer.giveCards([this.deck.pop()]);
      this.updatePlayerHands();
    }

    updatePlayerHands(){
      this.removeCardsFromDom();
      this.addCardsToDom();
    }

    addCardsToDom(){
      this.player.hand.forEach(card => {        
        const gameCardEl = this.createGameCardEl(card);
        this.playerEl.appendChild(gameCardEl);
      });
      this.dealer.hand.forEach(card => {        
        const gameCardEl = this.createGameCardEl(card);
        this.dealerEl.appendChild(gameCardEl);
      });
    }

    removeCardsFromDom(){
      while (this.playerEl.firstChild) {
        this.playerEl.removeChild(this.playerEl.firstChild);
      }
      while (this.dealerEl.firstChild) {
        this.dealerEl.removeChild(this.dealerEl.firstChild);
      }
    }

    removeChipsFromDom(){
      while (this.betzoneEl.lastChild) {
        if((<HTMLElement>this.betzoneEl.lastChild).classList.contains("txt-betzone")){
          return;
        }
        this.betzoneEl.removeChild(this.betzoneEl.lastChild);
      }
    }

    createGameCardEl(card: Card): HTMLElement{
      const gameCardEl = document.createElement("game-card", {});
      gameCardEl.setAttribute("face", card.face);
      if(card.is404 && !this.display404Cards) {
        gameCardEl.setAttribute("value", "404");
      }else{
        gameCardEl.setAttribute("value", ""+card.value);
      }
      return gameCardEl;
    }

    startGame(){
      this.updatePlayerHands();
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