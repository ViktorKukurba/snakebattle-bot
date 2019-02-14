import { COMMANDS_LIST, COMMANDS } from "../constants";
import { BoardManager } from "./board";
import { TargetManager } from "./target";

export class DecisionManager {
    /**
     * @type {BoardManager}
     * @private 
     */ 
    _boardManager;
    /** 
     * @type {TargetManager}
     * @private
     */
    _targetManager;
    
    /**
     * @constructor
     * @param {BoardManager} bm 
     * @param {TargetManager} tm 
     */ 
    constructor(bm, tm) {
        this._boardManager = bm;
        this._targetManager = tm;
    }
    
    /**
     * Gets command to move.
     * @method
     * @public
     * @returns {string} Returns command.
     */
    getCommand() {
        const options = this._filterDeadCell(this._boardManager.headRatings);

        console.log('options:', options);

        const target = this._targetManager.getTarget(options);
        
        if (target) {
            console.log('Target manager decision', target._target);
            return target.cmd;
        }

        let option = this.getBestOption(options);
        if (option) {
            console.log('Best option decision', option);
            return option.command;
        }

        option = this.getBestFromBadOptions();

        if (option) {
            console.log('Best option from bad options decision', option);
            return option.command;
        }
        
        return COMMANDS.LEFT;  
    }

    getBestFromBadOptions() {
        return this.getBestOption(this._boardManager.headRatings.map((r, i) => ({rating: r, command: COMMANDS_LIST[i]})));
    }

    /**
     * Gets best of available options.
     * @public
     * @method
     * @param {Object[]} options Steps,
     * @returns {string}
     */
    getBestOption(options) {
        // If only one possible option
        if (options.length === 1) {
            return options[0];
        }

        // Looking for best options in 1 step
        if (options.some(r => r.rating > 0)) {
            const sorted = options.sort((a, b) => {
                return b.rating - a.rating;
            })
            return sorted[0];
        }

        if (options.length) {
            return options.sort((a, b) => {
                return b.rating - a.rating;
            })[0];
        }
    }

    /**
     * Filters dead cells. 
     * @private
     * @method
     * @param {number[]} ratings 
     * @returns {number[]}
     */
    _filterDeadCell(ratings) {
        return ratings.map((r, i) => ({rating: r, command: COMMANDS_LIST[i]})).filter(r => r.rating > -1)
        .filter((r => {
            return !this._boardManager.isCellDead(this.getCellNeighbour(r.command));
        }));
    }

    /**
     * Get neightbour cell by cmn.
     * @method
     * @param {string} cmd 
     */
    getCellNeighbour(cmd) {
        const cell = this._boardManager.head;
        switch (cmd) {
            case COMMANDS.RIGHT: return {x: cell.x + 1, y: cell.y};
            case COMMANDS.LEFT: return {x: cell.x - 1, y: cell.y};
            case COMMANDS.UP: return {x: cell.x, y: cell.y - 1};
            case COMMANDS.DOWN: return {x: cell.x, y: cell.y + 1};
        }
        return cell;
    }
}