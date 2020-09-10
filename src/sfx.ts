import {zzfx} from './assets/ZzFX';

export class SFX {

  blingbling = [.5,,304,.1,.3,,5,.1,-46,,,,,,-165];
  swosh = [,,150,.05,,.05,,1.3,,,,,,3];
  moneyInTheBank = [,,1675,,.06,.24,1,1.82,,,837,.06];
  buhu = [,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17];
  hmmm = [,,461,.08,.27,.43,1,1.22,,,22,.04,.18,,,,,.53,.03,.33];
  shuffle = [,,200,.2,.3,.01,4,.44,-71,-66,70,.02,.07,,.2,.1,.26,.41,,.66];
  
  constructor(){
    
  }
  private playWin(){
    zzfx(...this.moneyInTheBank);
  }

  playBetSound() {
    zzfx(...this.blingbling);
  }

  playHit(){
    zzfx(...this.swosh);
  }
  
  playLooseSound(){
    zzfx(...this.buhu);
  }
  
  playDrawSound(){
    zzfx(...this.hmmm);
  }

  playShuffleSound(){
    zzfx(...this.shuffle);
  }
  playWinRoutine(){
    this.playWin();
    let winSoundsPlayed = 0;
    const winInterval = setInterval(()=>{
      winSoundsPlayed ++;
      if(winSoundsPlayed >= 4) {
        clearInterval(winInterval);
      }
      this.playWin();
    },120);
  }
}