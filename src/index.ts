import {Game} from './game';
import {Card} from './custom-elements/Card';
/**
 * Remember to add all custom elements here
 */
function initializeCustomElements() {
  customElements.define('game-card', Card);
}
initializeCustomElements();
new Game();