import { createCardDeck, shuffleDeck } from './cardUtils';
import { Card } from './Icard';
import { Player } from './player';
import { Music } from './music';
import { SFX } from './sfx';
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
    menuEl: HTMLElement;
    mainMenuEl: HTMLElement;
    mainMenuContainerEl: HTMLElement;
    selectNextPatternEl: HTMLElement;
    selectPrevPatternEl: HTMLElement;
    currentCardBackEl: HTMLElement;
    newGameBtnEl: HTMLElement;
    totalChipsContainerEl: HTMLElement;
    toggleMusicEl: HTMLElement;
    isSubscriber = false;
    music: Music;
    sfx: SFX;
    deck: Card[];
    originalDeck: Card[];
    player: Player;
    dealer: Player;
    isMenuOpen = false;
    animationTime = 400;
    currentPatternIndex = 3;
    debugSubscriber = false;
    patternClasses = ["pattern0", "pattern1", "pattern2", "pattern3", "pattern4", "pattern5"];
    // playStates: string[] = ["start", "betted", "betted2x", "hold", "playerEnd", "dealerEnd"];
    currentState = "start";
    constructor() {
        this.player = new Player(false);
        this.dealer = new Player(true);
        this.sfx = new SFX();
        this.music = new Music();
        // TODO (johnedvard) create a start game button, so we can play music
        setTimeout(()=> {
          this.initNewGame();
          this.dealStartHand();
          this.updateChipsText();
          this.checkForSubscriber();
        },100);
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
        this.menuEl = document.getElementById('menu');
        this.mainMenuEl = document.getElementById('mainMenu');
        this.mainMenuContainerEl = document.getElementById('mainMenuContainer');
        this.selectNextPatternEl = document.getElementById('selectNextPattern');
        this.selectPrevPatternEl = document.getElementById('selectPrevPattern');
        this.currentCardBackEl = document.getElementById('currentCardBack');
        this.newGameBtnEl = document.getElementById('newGameBtn');
        this.totalChipsContainerEl = document.getElementById('totalChipsContainer');
        this.toggleMusicEl = document.getElementById('toggleMusic');
        this.addEventListeners();
        this.updateButtonStates();
    }

    initNewGame(){
      this.removeDeckFromDom();
      this.deck = createCardDeck();
      this.originalDeck = [...this.deck];
      shuffleDeck(this.deck, this.sfx);
      this.addDeckToDom(this.deck);
    }

    removeDeckFromDom(){
      while (this.deckEl.firstChild) {
        this.deckEl.removeChild(this.deckEl.firstChild);
      }
    }

    addEventListeners(){
      this.btnHit.addEventListener("click", () => {
        this.dealCard(this.player);
        this.updateButtonStates();
      });
      this.btnHold.addEventListener("click", () => {
        this.currentState = "hold";
        this.reveal404Cards(this.player);
        this.currentState = "playerEnd";
        this.updatePlayersTotalSum(true);
        this.updateButtonStates();
        this.updateTurnState();
      });
      this.btnBet.addEventListener("click", () => {
        if(this.player.totalChips-10>=0) {
          if(this.currentState === "betted") {
            this.currentState = "betted2x";
          } else {
            this.currentState = "betted";
          }
          this.betzoneEl.appendChild(document.createElement("game-chip", {}));
          this.player.removeChips(10);
          this.animateWinnings(-10);
          this.sfx.playBetSound();
          this.updateButtonStates();
          this.updateChipsText();
        } else {
          this.createMessage("Not enough chips");
        }
      });
      this.btnNext.addEventListener("click", () => {
        this.startNextRound();
      });
      this.menuEl.addEventListener("click", () => {
        this.toggleMenu();
      });
      this.selectPrevPatternEl.addEventListener("click", () => {
        this.selectCardBack(-1);
      });
      this.selectNextPatternEl.addEventListener("click", () => {
        this.selectCardBack(1);
      });
      this.newGameBtnEl.addEventListener("click", () => {
        localStorage.setItem("jer-chips", "110");
        this.player.totalChips = 110;
        this.startNextRound(true);
        this.toggleMenu();
      });
      this.toggleMusicEl.addEventListener("click", () => {
        if (!this.music.isPlaying) {
          document.getElementById("musicOn").classList.remove("hidden");
          document.getElementById("musicOff").classList.add("hidden");
        } else {
          document.getElementById("musicOff").classList.remove("hidden");
          document.getElementById("musicOn").classList.add("hidden");
        }
        this.music.toggleMusic();
      });
    }

    selectCardBack(next: number){
      if(this.isSubscriber) {
        this.deckEl.classList.remove(this.patternClasses[this.currentPatternIndex]);
      }
      this.currentCardBackEl.classList.remove(this.patternClasses[this.currentPatternIndex]);
      this.currentPatternIndex = this.currentPatternIndex + next;
      if(this.currentPatternIndex<0) {
        this.currentPatternIndex = this.patternClasses.length-1;
      } else if(this.currentPatternIndex>this.patternClasses.length-1) {
        this.currentPatternIndex = 0;
      }
      if(this.isSubscriber) {
        this.deckEl.classList.add(this.patternClasses[this.currentPatternIndex]);
      }
      this.currentCardBackEl.classList.add(this.patternClasses[this.currentPatternIndex]);
    }
    toggleMenu(){
      this.isMenuOpen = !this.isMenuOpen;
      if(this.isMenuOpen) {
        this.mainMenuContainerEl.classList.remove("close");
        this.mainMenuContainerEl.classList.add("open");
        this.menuEl.classList.remove("close");
        this.menuEl.classList.add("open");
        this.menuEl.textContent = "Close menu";
      } else {
        this.mainMenuContainerEl.classList.remove("open");
        this.mainMenuContainerEl.classList.add("close");
        this.menuEl.classList.remove("open");
        this.menuEl.classList.add("close");
        this.menuEl.textContent = "Menu";
      }
    }

    startNextRound(reshuffle = false){
      if(this.deck.length <= 10 || reshuffle) {
        this.createMessage("Time for a reshuffle");
        this.initNewGame();
      }
      this.player.display404Cards = false;
      this.dealer.display404Cards = false;
      this.removeChipsFromDom();
      this.removeCardsFromDom();
      this.player.discardHand();
      this.dealer.discardHand();
      this.currentState = "start";
      this.updatePlayersTotalSum();
      this.dealStartHand();
      this.updatePlayerHands();
      this.updateButtonStates();
      this.updateChipsText();
    }

    updateChipsText(){
      this.totalChipsEl.textContent = ""+this.player.totalChips;
      localStorage.setItem("jer-chips", ""+this.player.totalChips);
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
      const totalSumPlayer = this.getTotalValue(this.player);
      const totalSumDealer = this.getTotalValue(this.dealer);
      let youWin = false;
      if(totalSumPlayer - 21 <= 0) {
        if(totalSumDealer -21 > 0) {
          youWin = true;
        } else if(totalSumPlayer > totalSumDealer && totalSumDealer -21 <= 0) {
          youWin = true;
        }
      }
      if(totalSumPlayer === totalSumDealer) {
        this.animateWinnings(this.player.tmpRemovedChips);
        this.player.giveChips(this.player.tmpRemovedChips);
        this.createMessage("It is a DRAW");
        this.sfx.playDrawSound();
      } else if(youWin) {
        this.animateWinnings(this.player.tmpRemovedChips*1.5);
        this.player.giveChips(this.player.tmpRemovedChips*1.5);
        // this.createMessage("You WON");
        this.animateChips(this.player);
        this.sfx.playWinRoutine();
      } else {
        this.player.giveChips(0);
        // this.createMessage("You Lost");
        this.sfx.playLooseSound();
        this.animateChips(this.dealer);
      }
      this.updatePlayersTotalSum(false, youWin ? 'player' : 'dealer');
      this.updateChipsText();
    }

    animateWinnings(sum: number){
      const animateElement = document.createElement("div");
      const sumEl = document.createElement("span");
      sumEl.textContent = (sum>0 ? "+" : "") + sum;
      const color = sum>0 ? "green" : "red";
      animateElement.setAttribute("style", `position: absolute; transform: translate(3px, -20px);`)
      animateElement.appendChild(sumEl);
      this.totalChipsContainerEl.appendChild(animateElement);
      setTimeout(()=> {
        // animate it
        animateElement.setAttribute("style", `position: absolute; transform: translate(3px, -55px); color:${color}; transition: all 800ms ease-out; font-size: 20px;`)
      },50)
      setTimeout(()=> {
        // remove animated text
        animateElement.remove();
      }, 800);
    }

    animateChips(winningPlayer: Player){
      const gameChips = document.getElementsByTagName("game-chip");
        for (let chip of gameChips) {
          if(winningPlayer.isDealer) {
            chip.classList.add("move-up");
          } else {
            chip.classList.add("move-down");
          }
        }
    }

    dealersTurn() {
      if(this.checkIfDealerShouldDrawCard()){
        this.dealCard(this.dealer);
        setTimeout(() => {
          this.dealersTurn();
        }, 1000);
      } else {
        this.currentState = "dealerEnd";
        this.dealer.display404Cards = true;
        this.updatePlayerHands();
        this.updatePlayersTotalSum();
        this.updateTurnState();
        this.updateButtonStates();
      }
    }

    checkIfDealerShouldDrawCard(){
      const totalSumPlayer = this.getTotalValue(this.player);
      const totalGuessedSumDealer = this.getGuessedTotalValue(this.dealerEl);
      const knownSumDealer = this.getGuessedTotalValue(this.dealerEl, true);
      if(totalSumPlayer > 21){
        return false;
      } else if(knownSumDealer > totalSumPlayer){
        return false;
      }else if(totalGuessedSumDealer < 21 && totalGuessedSumDealer <= totalSumPlayer) {
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

    updatePlayersTotalSum(playerOnly = false, youWin = ''){
      const totalSumPlayer = this.getTotalValue(this.player);
      const totalSumDealer = this.getTotalValue(this.dealer);
      if(totalSumPlayer && totalSumDealer) {
        if(playerOnly) {
          this.playerTotalEl.textContent = "Sum: " + totalSumPlayer;
        }else{
          this.playerTotalEl.textContent = "Sum: " + totalSumPlayer;
          this.dealerTotalEl.textContent = "Sum: " + totalSumDealer;
          if(youWin == 'player'){
            this.playerTotalEl.textContent = "Sum: " + totalSumPlayer + " You won";
          } else if (youWin == 'dealer'){
            this.playerTotalEl.textContent = "Sum: " + totalSumDealer + " You lost";
          }
        }
      } else {
        this.playerTotalEl.textContent = "";
        this.dealerTotalEl.textContent = "";
      }
    }

    getGuessedTotalValue(aPlayerEl: HTMLElement, onlyKnownCards = false) {
      let res = 0;
      aPlayerEl.childNodes.forEach(gameCardEl => {
        const cardValue = (<HTMLElement>gameCardEl).getAttribute("value")
        if(cardValue != "404") { 
            res += parseInt(cardValue);
        }else if(!onlyKnownCards){
          // guess the value in the 404 card, random value between 1 and 10
          res += Math.floor(Math.random() * 10)+1;
        }
      });
      return res;
    }
    
    getTotalValue(aPlayere: Player){
      let res = 0;
      aPlayere.hand.forEach(card => {
        res += card.value;
      });
      return res;
    }

    reveal404Cards(aPlayer: Player){
      aPlayer.display404Cards = true;
      this.updatePlayerHands();
    }

    dealCard(toPlayer: Player){
      if(this.deck.length>0) {
        const card = this.deck.pop()
        toPlayer.giveCards([card]);
        this.addCardToDom(toPlayer, card);
        this.sfx.playHit();
      } else {
        this.createMessage("Deck is empty. You neede to hold your hand");
      }
    }

    updatePlayerHands(){
      this.removeCardsFromDom();
      this.addCardsToDom();
    }

    addCardToDom(toPlayer: Player, card: Card) {
      const gameCardEl = this.createGameCardEl(card, toPlayer);
      let playerEl = this.playerEl;
      if(toPlayer.isDealer) {
        playerEl = this.dealerEl;
      }
      playerEl.appendChild(gameCardEl);
      const deckY = this.deckEl.offsetTop;
      const deckX = this.deckEl.offsetLeft;
      const y = gameCardEl.offsetTop;
      const x = gameCardEl.offsetLeft;
      gameCardEl.setAttribute("style", `transform: translate(${deckX-x}px,${deckY-y}px);`);
      setTimeout( () => {
        // use timeout to animate
        gameCardEl.setAttribute("style", `transform: translate(${0}px,${0}px); transition: all ${this.animationTime}ms ease-out;`);
      },75);
      this.updateDomDeck();
    }

    addDeckToDom(deck: Card[]){
      let margin = -0.25;
      let currentCardIndex = 0;
      const addCardToDeck = (cardIndex: number, deck: Card[]) => {
        setTimeout(()=> {
          const gameCardEl = document.createElement("game-card");
          gameCardEl.setAttribute("class", "back-side");
          gameCardEl.setAttribute("style", `position: absolute; border-radius: 4px; border: 1px solid white; margin: ${margin}px; box-shadow: -1px 1px 2px -1px rgba(0,0,0,.1), -1px 1px 3px 0 rgba(0,0,0,.1)`);
          // used to remove class because we want to use game-card selector for styling
          gameCardEl.setAttribute("removewrapperclass", "true");
          this.deckEl.appendChild(gameCardEl);
          margin = margin- 0.25;
          if(cardIndex < deck.length) {
            addCardToDeck(++cardIndex, deck);
          }
        },10);
      }
      addCardToDeck(currentCardIndex, deck);
    }
    updateDomDeck(){
      if(this.deckEl.lastChild) {
        this.deckEl.lastChild.remove();
      }
    }

    addCardsToDom(){
      this.player.hand.forEach(card => {
        const gameCardEl = this.createGameCardEl(card, this.player);
        this.playerEl.appendChild(gameCardEl);
      });
      this.dealer.hand.forEach(card => {        
        const gameCardEl = this.createGameCardEl(card, this.dealer);
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

    createGameCardEl(card: Card, aPlayer: Player): HTMLElement{
      const gameCardEl = document.createElement("game-card", {});
      gameCardEl.setAttribute("face", card.face);
      if(card.is404 && !aPlayer.display404Cards) {
        gameCardEl.setAttribute("value", "404");
      }else{
        gameCardEl.setAttribute("value", ""+card.value);
      }
      return gameCardEl;
    }

    /**
     * The dealer and player gets two cards from the start
     */
    dealStartHand(){
      let i = 0;
      const drawOrder = [this.player, this.dealer, this.player, this.dealer];
      
      const drawInterval = setInterval( () => {
        this.dealCard(drawOrder[i++]);
        if(i >= 4) {
          clearInterval(drawInterval);
        }
      }, this.animationTime);
    }
    
    createMessage(msg: string){
        const modalSpawnEL = document.getElementById("modalSpawn");
        const modalParent = document.createElement("div");
        modalParent.setAttribute("id", "modal");
        modalParent.setAttribute("class", "modal close");
        modalParent.appendChild(document.createTextNode(msg));
        modalSpawnEL.appendChild(modalParent);
        setTimeout(()=>{
          modalParent.classList.add('open');
          modalParent.classList.remove('close');
        });
        setTimeout(() => {
            modalParent.classList.remove('open');
            modalParent.classList.add('close');
            setTimeout(()=> {
              modalParent.remove();
            }, 450) // see styles.css for animation time
        }, 5000);
    }
    
    checkForSubscriber(){
        const setSubscriber = () => {
          this.createMessage('Thanks for subscribing!');
          document.getElementById('game').classList.add('subscriber');
          this.selectNextPatternEl.removeAttribute("disabled");
          this.selectPrevPatternEl.removeAttribute("disabled");
          const removeIfSubscriberELements = document.querySelectorAll('[removeIfSubscriber]');
          for(let el of removeIfSubscriberELements) {
            el.remove();
          }
        }
        const monetization: any = (<any>document).monetization;
        if(this.debugSubscriber) {
          setSubscriber();
        }
        setTimeout(()=> {
            if (monetization && monetization.state === 'started') { 
                setSubscriber()
            }
        });
    }
}