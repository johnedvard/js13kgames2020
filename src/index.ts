import {Game} from './game';
import {Card} from './custom-elements/Card';
import { Chip } from './custom-elements/Chip';
/**
 * Remember to add all custom elements here
 */
function initializeCustomElements() {
  customElements.define('game-card', Card);
  customElements.define('game-chip', Chip);
}
initializeCustomElements();
new Game();