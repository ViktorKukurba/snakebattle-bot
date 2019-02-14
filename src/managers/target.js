import { ELEMENT, ENEMY_HEAD, ENEMY_BODY, SAFE_ENEMY_HEAD } from '../constants';
import { BoardManager } from './board';
import { RouteManager } from './route';
import { getElementByXY } from '../utils';

const TARGET_ELEMENTS = [ELEMENT.GOLD, ELEMENT.APPLE, ELEMENT.FURY_PILL, ELEMENT.HEAD_EVIL];
const ENEMY_HEAD_ELEMENTS = [
    ELEMENT.ENEMY_HEAD_DOWN,
    ELEMENT.ENEMY_HEAD_EVIL,
    ELEMENT.ENEMY_HEAD_FLY,
    ELEMENT.ENEMY_HEAD_LEFT,
    ELEMENT.ENEMY_HEAD_RIGHT,
    ELEMENT.ENEMY_HEAD_UP
]
/**
 * @class
 */
export class TargetManager {

    /**
     * @type {BoardManager}
     * @private
     */
    _boardManager;

    constructor(boardManager) {
        this._boardManager = boardManager;
    }

    /**
     * Gets taget to follow.
     * @param {Object[]} options Options that can be used.
     * @return {RouteManager}
     */
    getTarget(options) {

        const enBody = this.getNextStepEnemyBody();
        if (enBody) {
            return enBody;
        }

        let enemy = this.getNearestEnemy(options);
        if (enemy &&
            (enemy.isEvil && !this._boardManager.snakeState.isEvil ||
             enemy.isEvil === this._boardManager.snakeState.isEvil && this._boardManager.snakeState.size - enemy.enemySize <= 1)) {
            if (enemy.element.distance < 3) {
                this.disablePositionsNearEnemy(enemy);
            }
            enemy = null;
        }

        const boardElements = this._boardManager.useStone ? [ELEMENT.STONE, ...TARGET_ELEMENTS] : TARGET_ELEMENTS;
        const elements = boardElements.map((target, index) => {
            let element = this.nearestElement(target);
            if (element)
            console.log('target', target, element._target);
            return {
                target,
                element,
                index
            }
        })
        .filter(e => Boolean(e.element) && options.map(o => o.command).includes(e.element.cmd))
        .sort((a, b) => {
            const aE = a.element, bE = b.element;
            if (aE.distance > aE.enemyDistance && bE.distance < bE.enemyDistance) {
                return 1;
            } else if (aE.distance < aE.enemyDistance && bE.distance > bE.enemyDistance) {
                return -1;
            }
            return this.priorityVal(a) - this.priorityVal(b);
        });

        return this.compareEnemyWithGoods(enemy,  elements);
    }

    disablePositionsNearEnemy(enemy) {
        this._boardManager.blockSurround(enemy.enemy.head);
    }

    getNextStepEnemyBody() {
        const surround = [{x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}];
        if (this._boardManager.snakeState.isEvil) {
            const h = this._boardManager.head;
            for (let i = 0; i < surround.length; i++) {
                let s = surround[i];
                let p = {x: h.x + s.x, y: h.y + s.y};
                const element = getElementByXY(this._boardManager.board, p);
                if (ENEMY_BODY.includes(element)) {
                    return {
                        _target: p,
                        cmd: RouteManager.getCommandByPosition(h, p)
                    }
                }
            }
        }
    }

    compareEnemyWithGoods(enemy, goods) {
        if (!goods.length) return enemy && enemy.element;
        if (!enemy) return goods[0].element;
        const enemyScore = enemy.enemySize * 10 - enemy.element.steps.length * 15;
        const goodsElement = goods[0].element;
        const goodsScore = this._boardManager.rateElement.call(this._boardManager, goods[0].target) * 2 - goodsElement.distance * 5;
        return goodsScore >= enemyScore ? goodsElement : enemy.element;
    }

    priorityVal(e) {
        return e.element.distance * (50 - this._boardManager.rateElement.call(this._boardManager, e.target));
    }

    _isTargetSafe(position) {
        return !this._boardManager.isCellOneEntrance(position);
    }

    nearestElement(element) {
        let elements = this._boardManager.getElementPositions(element).filter(this._isTargetSafe.bind(this));
        elements = elements.map(e => {
            const route = this._boardManager.getRouteTo(e);
            route.enemyDistance = this.nearestEnemyTo(e);
            return route;
        })
        .filter(r => r.isValid && !(r.distance > 1 && this._boardManager.isCellNearEnemyHead(r._target)))
        .sort((a, b) => {
            if (a.distance > a.enemyDistance && b.distance < b.enemyDistance) {
                return 1;
            } else if (a.distance < a.enemyDistance && b.distance > b.enemyDistance) {
                return -1;
            }
            return a.distance - b.distance;
        });
        if (elements.length) {
            return elements[0];
        }
        return null;
    }

    getNearestEnemy() {
        if (this._boardManager.snakeState.size > 5) {
            const enemies = (this._boardManager.snakeState.isEvil ? [...ENEMY_HEAD, ...ENEMY_BODY] : ENEMY_HEAD)
            .map((target, index) => {
                let elements = this._boardManager.getElementPositions(target);//.filter(this._isTargetSafe.bind(this));
                elements = elements.map(e => {
                    const route = this._boardManager.getRouteTo(e, 20);
                    return route;
                }).sort((a, b) => a.distance - b.distance);
                return {
                    target,
                    element: elements.length ? elements[0]: null,
                    index
                }
            })
            .filter(({element}) => Boolean(element) && element.isValid)
            .sort((a, b) => a.element.distance - b.element.distance);
            if (enemies.length) {
                this._boardManager.enemyState.reset();
                this._boardManager.enemyState.isEnemyBodyNear(enemies[0].element._target);
                const enemySize = this._boardManager.enemyState.size;
                const isEvil = this._boardManager.enemyState.isEvil;
                
                return {enemy: this._boardManager.enemyState, enemySize, isEvil, cmd: enemies[0].element.cmd, element: enemies[0].element};
            }
        }
    }

    nearestEnemyTo(element) {
        let enemies = [];
        ENEMY_HEAD_ELEMENTS.forEach(head => {
            const enemiesPositions = this._boardManager.getElementPositions(head);
            if (enemiesPositions.length) {
                const enemyRoutes = enemiesPositions.map(enemy => {
                    const r = this._boardManager.getRouteFromTo(element, enemy);
                    return r;
                }).filter(r => r.isValid);
                enemies = [...enemies, ...enemyRoutes];
            }
        });

        const sorted = enemies.sort((a, b) => {
            return a.distance - b.distance;
        });
        if (sorted.length) {
            return sorted[0].distance;
        }
        return 100;
    }
}
