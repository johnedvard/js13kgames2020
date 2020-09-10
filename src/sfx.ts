import * as TinyMusic from '../node_modules/tinymusic/dist/TinyMusic.js';

export class SFX {
  betSequence: TinyMusic.Sequence;
  constructor(){
    var ac = typeof AudioContext !== 'undefined' ? new AudioContext : (new (<any>window).webkitAudioContext);
    var tempo = 120;
    this.betSequence = new TinyMusic.Sequence( ac, tempo );
    this.betSequence.context._context.resume();
    this.betSequence.gain.gain.value = 0.1;
    this.betSequence.loop = false;
    // Trumpety
    this.betSequence.createCustomWave([-1,-0.9,-0.6,-0.3, 0, 0.3, 0.6, 0.9,1]);
    this.betSequence.push("E4 e");
  }

  playBetSound() {
    // this.betSequence.play();
  }
}