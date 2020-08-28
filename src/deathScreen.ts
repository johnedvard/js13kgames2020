import { Sprite } from 'kontra';
import { IGameObject } from './gameObject';
export class DeathScreen implements IGameObject {
    sprite: Sprite;
    timePassed = 0;
    constructor(width: number, height: number) {
        this.sprite = Sprite({
            x: 0,
            y: 0,
            color: 'red',
            width: width,
            height: height
        });
    }
    update(dt) {
    }
    render() {
        this.sprite.render();
    }
    trackObject() {
    }
    untrackObject() {
    }
}
