import { getElementByXY, getPositionByCommand, getSnakeSize } from "../utils";
import { BoardManager } from "./board";
import { ELEMENT } from "../constants";

/**
 * @class SnakeStateManager
 * @public
 */ 
export class SnakeStateManager {
    /**
     * @type {number}
     * @private
     */
    _stones;

    /**
     * @type {number}
     * @private
     */
    _evilTime;

    /**
     * @type {string}
     * @private
     */
    _state;

    /**
     * @type {BoardManager}
     * @private
     */
    _boardManager;

    /**
     * @method
     * @param {BoardManager} bm 
     */
    constructor(bm) {
        this._boardManager = bm;
        this._stones = 0;
        this._evilTime = 0;
    }

    get isEvil() {
        return getElementByXY(this._boardManager.board, this._boardManager.head) === ELEMENT.HEAD_EVIL && this._evilTime > 0;
    }

    get doAct() {
        const act = this.isEvil && this._evilTime > 2 && (this._stones > 0);
        this._stones--;
        return act;
    }

    get snake() {
        const bm = this._boardManager;
        return getAt(bm.board, bm.head.x, bm.head.y);
    }

    get size() {
        return getSnakeSize(this._boardManager.board);
    }

    /**
     * @param {string} cmd Command.
     * @public
     */
    set state(cmd) {
        const position = getPositionByCommand(this._boardManager.head, cmd);
        const element = getElementByXY(this._boardManager.board, position);
        if (element === ELEMENT.FURY_PILL) {
            this._evilTime += 10;
            this._state = element;
        } else if (element === ELEMENT.STONE) {
            this._stones++
        }
        
        if (this._evilTime) {
            this._evilTime--;
        }
    }

    reset() {
        this._stones = 0;
        this._evilTime = 0;
    }
}