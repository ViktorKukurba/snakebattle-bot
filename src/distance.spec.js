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
    getBoardSize,
    getElementByXY,
    getFirstPositionOf,
    isAt,
    getAt,
    isNear,
    getDistanceToElement,
    getSnakeSize
  } from './utils';
  import {
    ELEMENT, COMMANDS
  } from './constants';

  import { DistanceManager } from './distance';

  const BOARDS = [
    '******' +
    '* ═► *' +
    '*  ○ *' +
    '*    *' +
    '*    *' +
    '******',
    '*******' +
    '*  ══►*' +
    '*     *' +
    '*     *' +
    '* ○   *' +
    '*     *' +
    '*******',
    '********' +
    '* ○    *'+
    '* ═══► *' +
    '*      *' +
    '*      *' +
    '* ○    *' +
    '*      *' +
    '********'
  ]
  
    
  xdescribe("getDistanceToElement", () => {
    
    it("should return distance", () => {    
        let res = DistanceManager.getDistanceToElement({x: 1, y: 1}, {x: 3, y: 3});
        expect(res.distance).toEqual(4);
        expect(res.commands).toEqual([COMMANDS.RIGHT, COMMANDS.DOWN]);

        res = DistanceManager.getDistanceToElement({x: 1, y: 1}, {x: 3, y: 5});
        expect(res.distance).toEqual(6);
    });

    it("should calculate distance", () => {
        const ds = new DistanceManager();

        const EXPECTED = [{
            distance: 1,
            commands: [COMMANDS.DOWN]
        }, {
            distance: 6,
            commands: [COMMANDS.LEFT, COMMANDS.DOWN]
        }, {
            distance: 4,
            commands: [COMMANDS.LEFT, COMMANDS.UP]
        }];

        BOARDS.forEach((board, i) => {
            ds.board = board;
            const nearestApples = ds._nearestElements(ELEMENT.APPLE);
            expect(nearestApples[0]).toEqual(EXPECTED[i]);
        });
    })
})
  