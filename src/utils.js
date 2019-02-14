/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import {
  ELEMENT, COMMANDS_LIST, COMMANDS
} from './constants';
import { get } from 'https';

// Here is utils that might help for bot development
export function getBoardAsString(board) {
    const size = getBoardSize(board);

    return getBoardAsArray(board).join("\n");
}

export function getBoardAsArray(board) {
  const size = getBoardSize(board);
  var result = [];
  for (var i = 0; i < size; i++) {
      result.push(board.substring(i * size, (i + 1) * size));
  }
  return result;
}

export function getBoardSize(board) {
    return Math.sqrt(board.length);
}

export function isGameOver(board) {
    return board.indexOf(ELEMENT.HEAD_DEAD) !== -1;
}

export function isAt(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false;
    }
    return getAt(board, x, y) === element;
}

export function getAt(board, x, y) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }
    return getElementByXY(board, { x, y });
}

export function isNear(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }

    return isAt(board, x + 1, y, element) ||
			  isAt(board, x - 1, y, element) ||
			  isAt(board, x, y + 1, element) ||
			  isAt(board, x, y - 1, element);
}

export function arrayIntercection(array1, array2) {
    return array1.filter(value => -1 !== array2.indexOf(value));
}

export function getPositionByCommand(position, cmd) {
    switch (cmd) {
        case COMMANDS.LEFT: return {...position, x: position.x -1 };
        case COMMANDS.RIGHT: return {...position, x: position.x +1 };
        case COMMANDS.UP: return {...position, y: position.y -1 };
        case COMMANDS.DOWN: return {...position, y: position.y  +1 };
        default: return position;
    }
}

export function isOutOf(board, x, y) {
    const boardSize = getBoardSize(board);
    return x >= boardSize || y >= boardSize || x < 0 || y < 0;
}

export function getHeadPosition(board) {
    return getFirstPositionOf(board, [
        ELEMENT.HEAD_DOWN,
        ELEMENT.HEAD_LEFT,
        ELEMENT.HEAD_RIGHT,
        ELEMENT.HEAD_UP,
        ELEMENT.HEAD_DEAD,
        ELEMENT.HEAD_EVIL,
        ELEMENT.HEAD_FLY,
        ELEMENT.HEAD_SLEEP,
    ]);
}

export function getFirstPositionOf(board, elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var position = board.indexOf(element);
        if (position !== -1) {
            return getXYByPosition(board, position);
        }
    }
    return null;
}

export function getXYByPosition(board, position) {
    if (position === -1) {
        return null;
    }

    const size = getBoardSize(board);
    return {
        x:  position % size,
        y: (position - (position % size)) / size
    };
}

export function getElementByXY(board, position) {
    const size = getBoardSize(board);
    if (position.x >= size || position.y >= size) {
        return ELEMENT.WALL;
    }
    return board[size * position.y + position.x];
}

export function blockElementByXY(board, position) {
    const size = getBoardSize(board);
    if (position.x >= size || position.y >= size) {
        return ELEMENT.WALL;
    }
    const index = size * position.y + position.x;
    return board.substr(0, index) + ELEMENT.WALL + board.substr(index + 1);
}

export function getSnakeSize(board) {
    return [
        ELEMENT.BODY_HORIZONTAL,
        ELEMENT.BODY_LEFT_DOWN,
        ELEMENT.BODY_LEFT_UP,
        ELEMENT.BODY_RIGHT_DOWN,
        ELEMENT.BODY_RIGHT_UP,
        ELEMENT.BODY_VERTICAL,
    ].reduce((prev, curr) => {
        return (board.match(new RegExp(curr, "g")) || []).length + prev;
    }, 2);
}

export function possitionStr(possition) {
    return `{x: ${possition.x}, y: ${possition.y}}`;
}

export function getSorround(board, position) {
    const p = position;
    return [
        getElementByXY(board, {x: p.x - 1, y: p.y }), // LEFT
        getElementByXY(board, {x: p.x, y: p.y -1 }), // UP
        getElementByXY(board, {x: p.x + 1, y: p.y}), // RIGHT
        getElementByXY(board, {x: p.x, y: p.y + 1 }) // DOWN
    ];
}

export function getCommandByRatings(ratings) {
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < ratings.length; i++) {
        var r = ratings[i];
        if (r > max) {
            maxIndex = i;
            max = r;
        }
    }

    return COMMANDS_LIST[maxIndex];
}

export function positionsInArray(positions, position) {
    return Boolean(positions.find(equalPositions.bind(null, position)));
}

export function equalPositions(a, b) {
    return a.x === b.x && a.y === b.y;
}
