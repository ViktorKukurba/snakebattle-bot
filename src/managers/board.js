import { ELEMENT, COMMANDS, ENEMY_HEAD, USE_STONE_SNAKE_SIZE, ENEMY_BODY } from '../constants';
import { getHeadPosition, getXYByPosition, getSorround, getElementByXY, equalPositions, getBoardSize, blockElementByXY} from '../utils';
import { RouteManager } from './route';
import { SnakeStateManager } from './snake-state';
import { EnemyManager } from './enemy';

const SNAKE = [
    ELEMENT.BODY_HORIZONTAL,
    ELEMENT.BODY_LEFT_DOWN,
    ELEMENT.BODY_LEFT_UP,
    ELEMENT.BODY_RIGHT_DOWN,
    ELEMENT.BODY_RIGHT_UP,
    ELEMENT.BODY_VERTICAL,
];

/**
 * @class
 */
export class BoardManager {

    /**
     * @constructor
     * @param {string} b Game board. 
     */
    constructor(b) {
        this.board = b;
        this.snakeState = new SnakeStateManager(this);
        this.enemyState = new EnemyManager(this);
    }

    /** 
     * @type {SnakeStateManager}
     * @public
     */ 
    snakeState;

    /** @type {EnemyManager} */ 
    enemyState;

    /** 
     * @type {Object[]}
     * @private
     */ 
    _impassedCells = [];

    _board;
    set board(board) {
        if (board) {
            this._head = getHeadPosition(board);
            this._board = board;
            this._impassedCells = [];
            this._setImpassedCells();
        }
    }
    get board() {
        return this._board;
    }
    
    _head;
    get head() {
        return this._head;
    }

    // (LEFT, UP, RIGHT, DOWN)
    get headSurround() {
        return this.getSurround(this.head);
    }

    get headRatings() {
        return this.headSurround.map(s => this.rateElement(s));
    }

    get useStone() {
        return this.snakeState.isEvil;
        // return this.snakeState.size > 10 || this.snakeState.isEvil;
        // return this.snakeState.size > USE_STONE_SNAKE_SIZE || this.snakeState.isEvil;
    }

    /**
     * Sets impassed cells.
     * @method
     * @private
     */
    _setImpassedCells() {
        const size = getBoardSize(this.board);
        for (let x = 1; x < size; x++) {
            for (let y = 1; y < size; y++) {
                const position = {x, y};
                const element = getElementByXY(this.board, position);
                if (element !== ELEMENT.WALL) {
                    if (getSorround(this.board, position).filter(e => e === ELEMENT.WALL || e === ELEMENT.ENEMY_TAIL_INACTIVE).length > 2) {
                        this._impassedCells.push(position);
                        this._board = blockElementByXY(this._board, position);
                    }
                }
            }
        }
        return this._impassedCells;
    }

    blockSurround(p) {
        [{x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}].forEach(d => {
            this._board = blockElementByXY(this.board, {x: p.x + d.x, y: p.y + d.y});
        });
    }

    getSurround(position) {
        return getSorround(this.board, position);
    }

    isCellDead(position) {
        return this.getSurround(position).map(s => this.rateElement(s)).every(o => o < 0);
    }

    isCellOneEntrance(position) {
        return this.getSurround(position).map(s => this.rateElement(s)).filter(o => o <= 0).length < 2;
    }

    isCellNearEnemyHead(position) {
        return this.getSurround(position).map(e => [ELEMENT.ENEMY_HEAD_DOWN,
            ELEMENT.ENEMY_HEAD_LEFT,
            ELEMENT.ENEMY_HEAD_RIGHT,
            ELEMENT.ENEMY_HEAD_EVIL,
            ELEMENT.HEAD_FLY,
            ELEMENT.ENEMY_HEAD_UP].includes(e)).some(e => Boolean(e));
    }

    isEnemyNear(position) {
        this.enemyState.reset();
        if (position && this.enemyState.isEnemyNear(position)) {
            if (this.snakeState.isEvil || this.snakeState.size - this.enemyState.size > 1) {
                return 40;
            }

            return -1;
        }

        if (position) {
            this.enemyState.reset();
            const eSize = this.enemyState.isEnemyBodyNear(position);
            if (eSize && this.snakeState.size - eSize > 1) {
                return -2;
            }
        }
    }

    rateElement(element, position) {
        if (!ENEMY_BODY.includes(element)) {
            const isEnemy = this.isEnemyNear(position);
            if (isEnemy) {
                return isEnemy;
            }
        }
        
        switch(element) {
            case ELEMENT.NONE: return 0;
            case ELEMENT.ENEMY_HEAD_EVIL: return -4;
            case ELEMENT.GOLD: return 30;
            case ELEMENT.FLYING_PILL: return 0;
            case ELEMENT.APPLE: return 5;
            case ELEMENT.FURY_PILL: return this.snakeState.size < 4 && this.snakeState._stones ? 20 : 15;
            case ELEMENT.STONE: return this.useStone ? 15 : -2;
            case ELEMENT.ENEMY_BODY_HORIZONTAL:
            case ELEMENT.ENEMY_BODY_LEFT_DOWN:
            case ELEMENT.ENEMY_BODY_LEFT_UP:
            case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
            case ELEMENT.ENEMY_BODY_RIGHT_UP:
            case ELEMENT.ENEMY_BODY_VERTICAL: return -3
            case ELEMENT.ENEMY_HEAD_DOWN:
            case ELEMENT.ENEMY_HEAD_LEFT:
            case ELEMENT.ENEMY_HEAD_RIGHT:
            case ELEMENT.ENEMY_HEAD_UP: return this.snakeState.isEvil ? 20 : (this.snakeState.state === ELEMENT.HEAD_FLY ? 0 : -1);
            case ELEMENT.ENEMY_TAIL_END_DOWN:
            case ELEMENT.ENEMY_TAIL_END_UP:
            case ELEMENT.ENEMY_TAIL_END_RIGHT:
            case ELEMENT.ENEMY_TAIL_END_LEFT:
            case ELEMENT.ENEMY_HEAD_FLY: return 0;
            default: return -1;
        }
    }

    /**
     * Gets rate of element for route modeling.
     * @param {string} element 
     * @param {number} step Number of modeling step.
     * @returns {string} Return element rate.
     */
    rateRouteElement(element, step, position) {
        if (ENEMY_BODY.includes(element)) {
            this.isEnemyNear(position);
            const index = this.enemyState.indexOfPosition(position);
            if (index === -1) {
                return 0;
            }

            if (this.enemyState.size - index < step - 2) {
                return 0
            }

            return -1;
        }
        switch(element) {
            case ELEMENT.NONE: return 0;
            case ELEMENT.HEAD_RIGHT:
            case ELEMENT.ENEMY_TAIL_INACTIVE:
            case ELEMENT.WALL: return -2;
            case ELEMENT.BODY_HORIZONTAL:
            case ELEMENT.BODY_LEFT_DOWN:
            case ELEMENT.BODY_LEFT_UP:
            case ELEMENT.BODY_RIGHT_DOWN:
            case ELEMENT.BODY_RIGHT_UP:
            case ELEMENT.BODY_VERTICAL: return this.snakeState.size / 2 > step ? -1 : 0;
            default: return 0;
        }
    }

    getElementPositions(element) {
        var positions = [], i = 0, len = this.board.length;
        for(; i < len; i++) {
            if (this.board[i] === element) {
                positions.push(i);
            }
        }
        return positions.map(getXYByPosition.bind(null, this.board));
    }

    isOpposite(element, to, axis) {
        if (equalPositions(element, to)) return false;
        if (axis === 'x') {
            return this.isOppositeX(element, to);
        } else if (axis === 'y') {
            return this.isOppositeY(element, to);
        }

        let opposite = false;
        opposite = this.isOppositeY(element, to);
        if (opposite) return true;

        opposite = this.isOppositeX(element, to);

        return opposite;
    }

    isOppositeX(element, to = this.head) {
        if (to.x === element.x) {
            if (to.y < element.y) {
                return this.snakeState.state === ELEMENT.HEAD_UP;
            } else {
                return this.snakeState.state === ELEMENT.HEAD_DOWN;
            }
        }
        return false;
    }

    isOppositeY(element, to = this.head) {
        if (to.y === element.y) {
            if (to.x < element.x) {
                return this.snakeState.state === ELEMENT.HEAD_LEFT;
            } else {
                return this.snakeState.state === ELEMENT.HEAD_RIGHT;
            }
        }
        return false;
    }

    getRouteTo(target, maxDistance = false) {
        const route = new RouteManager(this, target, this.head, false, maxDistance);
        route.getBestRoute();
        return route;
    }

    getRouteFromTo(start, target) {
        const route = new RouteManager(this, start, target, true);
        route.getBestRoute();
        return route;
    }
}
