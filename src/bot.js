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
import { COMMANDS } from './constants';
import { isGameOver } from './utils';
import { BoardManager } from './managers/board';
import { TargetManager } from './managers/target';
import { DecisionManager } from './managers/decision';

const bm = new BoardManager();
const tm = new TargetManager(bm);
const dm = new DecisionManager(bm, tm);

/**
 * Get next snake step based on board.
 * @param {string} board Game board.
 * @param {Function} logger 
 * @returns {string} Next step command.
 */
export function getNextSnakeMove(board, logger) {
    console.time('getNextSnakeMove');
    if (isGameOver(board)) {
        bm.snakeState.reset();
        return '';
    }

    bm.enemyState.reset();

    bm.board = board;

    if (!bm.head) {
        return '';
    }

    logger('Head:' + JSON.stringify(bm.head));
    logger('Surround: ' + JSON.stringify(bm.headSurround));
    logger('Ratings:' + JSON.stringify(bm.headRatings));
    try {
        const cmd = dm.getCommand();
        bm.snakeState.state = cmd;
        if (bm.snakeState.doAct) {
            return `${cmd},${COMMANDS.ACT}`;
        }
        return cmd;
    } catch(e) {
        console.log('ERROR', e);
        return COMMANDS.LEFT;
    } finally {
        console.timeEnd('getNextSnakeMove');
    }
}
