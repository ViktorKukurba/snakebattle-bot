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
import { ELEMENT, COMMANDS } from './constants';
import {
  isGameOver, arrayIntercection, getSnakeSize, getSorround
} from './utils';
import { DistanceManager } from './distance';

const ds = new DistanceManager();
const COMMANDS_LIST = [COMMANDS.LEFT, COMMANDS.UP, COMMANDS.RIGHT, COMMANDS.DOWN];

// Bot Example
export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    // const headPosition = getHeadPosition(board);
    ds.board = board;
    const headPosition = ds.head;

    if (!headPosition) {
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));

    const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Sorround: ' + JSON.stringify(sorround));

    const snakeSize = getSnakeSize(board);

    const raitings = sorround.map(rateElement.bind(null, snakeSize));
    logger('Raitings:' + JSON.stringify(raitings));

    // Looking for goods on 1 step;
    if (raitings.some(r => r > 0)) {
        return getCommandByRaitings(raitings);
    }

    // Get correct options.
    const options = getOptions(board, raitings);

    // Return if only 1 correct option.
    if (options.length === 1) {
        return options[0].command;
    } else if (options.length === 0) {
        return COMMANDS.LEFT;
    }

    const cmd = getElementCmd(options, snakeSize) || options[0].command;

    console.log('cmd', cmd);

    return cmd;
}

function getOptions(board, raitings) {
    return raitings.map((r, i) => ({raiting: r, command: COMMANDS_LIST[i]})).filter(r => r.raiting > -1).filter((r => {
        
        if (r.command === COMMANDS.LEFT) {
            let sorround = getSorround(board, {x: r.x - 1, y: r.y});
            if (sorround.every(o => o < 0)) {
                return false;
            }
        } else if (r.command === COMMANDS.RIGHT) {
            let sorround = getSorround(board, {x: r.x + 1, y: r.y});
            if (sorround.every(o => o < 0)) {
                return false;
            }
        } else if (r.command === COMMANDS.UP) {
            let sorround = getSorround(board, {x: r.x, y: r.y - 1});
            if (sorround.every(o => o < 0)) {
                return false;
            }
        } else if (r.command === COMMANDS.DOWN) {
            let sorround = getSorround(board, {x: r.x, y: r.y + 1});
            if (sorround.every(o => o < 0)) {
                return false;
            }
        }

        return true;
    }));
}

function getElementCmd(options, snakeSize) {
    const TARGET_ELEMENTS = [ELEMENT.GOLD, ELEMENT.APPLE, ELEMENT.FLYING_PILL, ELEMENT.FURY_PILL, ELEMENT.HEAD_EVIL];

    if (snakeSize > 5) {
        TARGET_ELEMENTS.unshift(ELEMENT.STONE)
    }

    const elements = TARGET_ELEMENTS.map((target, index) => {
        let element = ds.nearestElement(target, options);
        return {
            target,
            element,
            index
        }
    }).filter(e => Boolean(e.element)).sort((a, b) => {
        return priorityVal(a) - priorityVal(b);
    });

    console.log('elements', elements);

    if (elements.length) {
        const moves = arrayIntercection(options.map(o => o.command), elements[0].element.commands);
        if (moves.length) {
            return moves[0];
        }
    }

    return null;
}

function priorityVal(e) {
    return e.element.distance * (10 - e.index);
}

function rateElement(size, element) {
    switch(element) {
        case ELEMENT.NONE: return 0;
        case ELEMENT.HEAD_EVIL: return -2;
        case ELEMENT.GOLD: return 3;
        case ELEMENT.FLYING_PILL: return 2;
        case ELEMENT.APPLE: return 1;
        case ELEMENT.FURY_PILL: return 1;
        case ELEMENT.STONE: return size > 5 ? 4 : -2
        default: return -1;
    }
    return -1;
}

function getCommandByRaitings(raitings) {
    // var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < raitings.length; i++) {
        var r = raitings[i];
        if (r > max) {
            maxIndex = i;
            max = r;
        }
    }

    return COMMANDS_LIST[maxIndex];
}
