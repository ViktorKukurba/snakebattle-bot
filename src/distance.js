import { ELEMENT, COMMANDS } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getXYByPosition, getSorround
  } from './utils';

/**
 * @depracated
 */
class DistanceManager {

    _board;
    set board(board) {
        this._head = getHeadPosition(board);
        this._board = board;
    }
    get board() {
        return this._board;
    }
    _head;
    get head() {
        return this._head;
    }

    nearestElement(element, options) {
        const elements = this._nearestElements(element).filter(a => {
            return a.commands.filter(value => -1 !== options.map(c => c.command).indexOf(value)).length;
        });
    
        if (elements.length) {
            return elements[0];
        }
        return null;
    }

    _isTargetSafe(position) {
        return (getSorround(this.board, position).filter(r => r > -1).length > 1);
    }

    _nearestElements(element) {
        let elements = DistanceManager.getElementPositions(this.board, element);
        elements = elements.filter(this._isTargetSafe.bind(this));
        const distances = elements.map(DistanceManager.getDistanceToElement.bind(null, this.head));
        return distances.sort((a, b) => {
            return a.distance - b.distance;
        });
    }

    static getDistanceToElement(head, element) {
        const xD = head.x - element.x;
        const yD = head.y - element.y;
        const commands = [];

        if (xD) {
            commands.push(xD < 0 ? COMMANDS.RIGHT : COMMANDS.LEFT);
        }

        if (yD) {
            commands.push(yD > 0 ? COMMANDS.UP : COMMANDS.DOWN);
        }

        return {
            distance: Math.abs(xD) + Math.abs(yD),
            commands,
        };
    }

    static getElementPositions(board, element) {
        var positions = [], i = 0;
        for(; i < board.length; i++) {
            if (board[i] === element) {
                positions.push(i);
            }
        }
        return positions.map(getXYByPosition.bind(null, board));
    }
}
