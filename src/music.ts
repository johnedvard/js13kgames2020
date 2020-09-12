// import { CPlayer } from './assets/player-small';
// import { song } from './assets/testsong';
// export class Music {
//   audio: any;
//   isPlaying = false;
//   constructor(){
//     var player = new CPlayer();
//     player.init({});
//     player.generate(); // important to start the audio
//     var wave = player.createWave();
//     this.audio = document.createElement("audio");
//     this.audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
//     this.audio.loop = true;
//   }
//   playMusic = () => {
//     this.audio.play();
//     this.isPlaying = true;
//   }
//   stopMusic = () => {
//     this.audio.pause();
//     this.isPlaying = false;
//   }
//   toggleMusic = () => {
//     if(this.isPlaying) {
//       this.stopMusic();
//     } else {
//       this.playMusic();
//     }
//   }
        
// }