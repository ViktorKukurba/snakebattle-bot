import { getElementByXY, possitionStr, positionsInArray, equalPositions } from "../utils";
import { ELEMENT, COMMANDS } from "../constants";
import { BoardManager } from "./board";

export class RouteManager {

    constructor(bm, target, start, isEnemy = false, maxDistance = false) {
        this._boardManager = bm;
        this._target = target;
        this._start = start || bm.head;
        this._isEnemy = isEnemy;
        this._maxDistance = maxDistance;
    }

    _maxDistance;
    _isEnemy = false;
    _target;
    _start;
    _steps = [];
    /** @type {BoardManager} */
    _boardManager;

    _activeAxis = 'x';
    _lock = [];
    get steps() {
        return this._steps;
    }

    get next() {
        return this._steps[0];
    }

    get cmd() {
        if (this.isValid) {
            const start = this._start;
            switch (`${start.x - this.steps[0].x}${start.y - this.steps[0].y}`) {
                case '01': return COMMANDS.UP;
                case '0-1': return COMMANDS.DOWN;
                case '10': return COMMANDS.LEFT;
                case '-10': return COMMANDS.RIGHT;
            }
        }
    }

    static getCommandByPosition(a, b) {
        switch (`${a.x - b.x}${a.y - b.y}`) {
            case '01': return COMMANDS.UP;
            case '0-1': return COMMANDS.DOWN;
            case '10': return COMMANDS.LEFT;
            case '-10': return COMMANDS.RIGHT;
        }
    }

    get distance() {
        if (this.isValid) {
            return this.steps.length;
        }
        return 100;
    }

    get isValid() {
        return Boolean(this.steps.slice(-1).length && equalPositions(this.steps.slice(-1)[0], this._target));
    }

    get isFirstStep() {
        return !this.steps.length;
    }

    getBestRoute() {
        this.getStraightRoute();
        if (this.isValid) {
            return [...this.steps];
        }

        this.getStraightRoute('y');
        if (this.isValid) {
            return [...this.steps];
        }

        this.getRoute();
        return this.steps;
    }

    /**
     * Gets route steps from start to target.
     * @method
     * @public
     * @return {Object[]}
     */ 
    getRoute() {
        this._steps = [];
        this.getRouteFromTo(this._start);
        return this.steps;
    }

    getDiff(position, axis) {
        return position[axis] - this._target[axis];
    }

    getRouteFromTo(currentPosition) {
        if (this._maxDistance && this._maxDistance < this._steps.length) {
            return false;
        }
        const target = this._target;

        let axis = 'x';
        let axis2 = this.getOppositeAxis(axis);
        let diff = this.getDiff(currentPosition, axis);
        let diff2 = this.getDiff(currentPosition, axis2);

        if (Math.abs(diff2) >= Math.abs(diff)) {
            [diff2, diff] = [diff, diff2];
            [axis, axis2] = [axis2, axis];
        } 

        if (this._boardManager.isOpposite(target, currentPosition, axis)) {
            let position = this.moveOneStep(currentPosition, diff, axis);
            if (position) {
                this._steps.push(position);
                return this.getRouteFromTo(position);
            }
        } else if (this._boardManager.isOpposite(target, currentPosition, axis2)) {
            let position = this.moveOneStep(currentPosition, diff2, axis2);
            if (position) {
                this._steps.push(position);
                return this.getRouteFromTo(position);
            }
        }
        
        if (diff) {
            
            let position = this.getNextPosition(currentPosition, axis);

            if (position) {
                this._steps.push(position);
                // console.log('FINAL POSITION x', position);
                return this.getRouteFromTo(position);
            } 
        }
        
        if (diff2) {
            let position = this.getNextPosition(currentPosition, axis2);

            if (position) {
                this._steps.push(position);
                // console.log('FINAL POSITION y', position);
                return this.getRouteFromTo(position);
            }
        }

        return this.steps;
    }

    getNextPosition(currentPosition, axis) {
        const axis2 = this.getOppositeAxis(axis);
        const diff = this.getDiff(currentPosition, axis);
        const diff2 = this.getDiff(currentPosition, axis2);

        // console.log(`Start: ${possitionStr(currentPosition)}; dif:${diff}; axis: ${axis}`);
        // Axis move
        let position = this.moveOneStep(currentPosition, diff, axis);
        // console.log(`${axis} position found: ${position}`);

        // Opposite axis move
        if (!position) {
            position = this.moveOneStep(currentPosition, diff2 || 1, axis2);
            // console.log(`${axis2} position found: ${position}`);
        }

        // Back
        if(!position) {
            position = this.moveOneStep(currentPosition, diff * (-1), axis);
            // console.log(`${axis} back position found: ${position}`);
        }

        // Opposite back
        if (!position) {
            position = this.moveOneStep(currentPosition, (diff2 || 1 ) * (-1), axis2);
            // console.log(`${axis2} back position found: ${position}`);
        }

        return position;
    }

    moveOneStep(a, diff, axis) {
        const axis2 = this.getOppositeAxis(axis);
        const position = {[axis]: a[axis] + (diff < 0 ? 1 : -1), [axis2]: a[axis2]};

        if (this.isLocked(position, diff, axis)) return;

        const element = this.positionIn(position) ? ELEMENT.WALL : getElementByXY(this._boardManager.board, position, a);
        let rate;
        if (this.isFirstStep) {
            rate = this._boardManager.rateElement(element, this._isEnemy ? null : position);
        } else {
            rate = this._boardManager.rateRouteElement(element, this.steps.length, position);
        }
        if (rate > -1) {
            // console.log(`from (${axis})  ${possitionStr(a)} to ${possitionStr(position)} (${element})`);
            return position;
        }
        this.addToLock(position);
    }

    isLocked(position, diff, axis) {
        const axis2 = this.getOppositeAxis(axis);
        
        const lock = this._lock.find(l => l[axis2] === position[axis2]);
        diff = this.getDiff(position, axis);

        if (lock) {
            if (diff < 0) { 
                return (Math.abs(lock[axis] - position[axis]) > 1) && (position[axis] <= lock[axis] && lock[axis] <= this._target[axis]);
            } else if (diff > 0) {
                return (Math.abs(lock[axis] - position[axis]) > 1) && (position[axis] >= lock[axis] && lock[axis] >= this._target[axis]);
            }
        }
    }

    getOppositeAxis(axis) {
        return (axis === 'x' ? 'y' : 'x');
    }

    positionIn(position) {
        return positionsInArray(this._steps, position);
    }
    
    addToLock(position) {
        if (!this.positionIn(position) && !positionsInArray(this._lock, position)) {
            this._lock.push(position);
        }
    }

    /**
     * @method
     * @param {string} [axis=x] Axis to start.
     * @param {Object} [position=this._target] Position to start route from.
     * @return {boolean|Object[]} False if no route, steps if route was found.
     */
    getStraightRoute(axis = 'x', position = this._target) {
        this._steps = [];
        const start = this._start;
        if (this._boardManager.isOpposite(start, position)) {
            return false;
        }

        const axis2 = this.getOppositeAxis(axis);
        const diff = this.getDiff(start, axis);
        const diff2 = this.getDiff(start, axis2);

        let from = start;
        if (diff) {
            from = this.getStraightTo(from, position, axis);
        }

        if (!from) {
            return false;
        }

        if (diff2) {
            from = this.getStraightTo(from, position, axis2);
        }

        return this.steps;
    }

    /**
     * @method
     * @public
     * @this RouteManager
     * @param {string} from Gets axis route from.
     * @param {Object} to Gets axis route to.
     * @param {string} [axis='x'] Route on axis.
     * @return {Boolean} Is valid route.
     */ 
    getStraightTo(from, to, axis = 'x') {
        const axis2 = this.getOppositeAxis(axis);
        let diff = this.getDiff(from, axis);
        while(diff) {

            if (this._maxDistance && this._maxDistance < this._steps.length) {
                return false;
            }

            from = {[axis]: from[axis] + (diff < 0 ? 1 : -1), [axis2]: from[axis2]};
            const element = getElementByXY(this._boardManager.board, from);
            if (this._boardManager.rateElement(element, !this.steps.length ? from : null) < 0) {
                return false;
            } else {
                this._steps.push(from);
            }
            diff = from[axis] - to[axis];
        }
        return from;
    }
}
