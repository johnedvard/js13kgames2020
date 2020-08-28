import { init, GameLoop, initPointer, on, Sprite, setStoreItem, getStoreItem, emit, track} from 'kontra';
import { IGameObject } from './gameObject';
import { GameEvent, GameEventData } from './gameEvent';
export class Game {
    gameObjects: IGameObject[] = [];
    gameCanvas;
    canvasSprite;
    modalEl: HTMLElement;
    isSubscriber = false;
    loop: GameLoop;
    constructor() {
        const { canvas, context } = init('game');
        this.checkForSubscriber();
        this.modalEl = document.getElementById('modal');
        this.gameCanvas = canvas;
        this.gameObjects = [];
        initPointer();
        this.loop = GameLoop({ 
            update: this.update,
            render: this.render,
        });
        this.createCanvasSprite();
        this.loop.start();
    }
    render = () => {
        this.canvasSprite.render();
        this.gameObjects.forEach(go => {
            if(go) {
                go.render();
            }
        });
    }
    update = (dt: number) => {
        this.canvasSprite.update();
        this.gameObjects.forEach(go => {
            go.update();
        });
    }
    onGameObjectKill() {
        on(GameEvent.KILL, (event: GameEventData) => {
        });
    }
    createLevel(level: number){
        
    }
    createCanvasSprite(){
        this.canvasSprite = Sprite({
            x: 0,
            y: 0,
            width: this.gameCanvas.width,
            height: this.gameCanvas.height,
            color: "rgba(125,125,125,0.2)",
            onDown: this.onCanvasDown,
        });
        track(this.canvasSprite);
    }
    onCanvasDown = (pointer) => {
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