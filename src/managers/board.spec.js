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
import { BoardManager } from './board';
import { ROUTE_BOARDS } from '../boards.examples';
  
    
  describe("check distance to an element", () => {
    
    it("should return distance", () => {    

        // const {board, route, target} = ROUTE_BOARDS[1];
        // const bm = new BoardManager(board);
        // console.log('HEAD', bm.head);
        // const rm = bm.getRouteTo(target);

        // console.log('route', route);
        // console.log('receivedRoute', rm.steps);

        // expect(rm.steps).toEqual(route);

        ROUTE_BOARDS.forEach(({board, straightXroute, straightYroute, route, target, cmd}, i) => {
            const bestRoute = straightXroute || straightYroute || route;
            const bm = new BoardManager(board);
            const rm = bm.getRouteTo(target);
            console.log(`TEST NUMBER ${i} of ${ROUTE_BOARDS.length}`);
            expect(rm.cmd).toEqual(cmd);
            expect(rm.steps).toEqual(bestRoute);
        });
    });
})
  