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
import { ROUTE_BOARDS, BOARDS } from '../boards.examples';
import { RouteManager } from './route';
    
  describe("Test Router manager", () => {
    
    it("should find routes", () => {    

        const {board, route, target, cmd, straightXroute, straightYroute} = ROUTE_BOARDS[2];
        const bm = new BoardManager(board);
        const rm = new RouteManager(bm, target);

        rm.getRoute();
        expect(rm.steps).toEqual(route);

        rm.getStraightRoute();
        expect(rm.isValid).toEqual(Boolean(straightXroute));
        if (Boolean(straightXroute)) {
            expect(rm.steps).toEqual(straightXroute);
        }
        rm.getStraightRoute('y');
            expect(rm.isValid).toEqual(Boolean(straightYroute));
            if (Boolean(straightYroute)) {
                expect(rm.steps).toEqual(straightYroute);
            }

        function verifyRoutes({board, route, target, cmd, command, straightXroute, straightYroute}, i) {
            const bm = new BoardManager(board);
            const rm = new RouteManager(bm, target);
            rm.getRoute();
            console.log(`TEST NUMBER ${i} of ${ROUTE_BOARDS.length}`);
            // expect(rm.cmd).toEqual(cmd || command);
            expect(rm.steps).toEqual(route);
            expect(rm.isValid).toEqual(true);
            
            if (straightXroute) {
                rm.getStraightRoute();
                expect(rm.isValid).toEqual(Boolean(straightXroute));
                if (Boolean(straightXroute)) {
                    expect(rm.steps).toEqual(straightXroute);
                }
                rm.getStraightRoute('y');
                expect(rm.isValid).toEqual(Boolean(straightYroute));
                if (Boolean(straightYroute)) {
                    expect(rm.steps).toEqual(straightYroute);
                }
            }
        }
        ROUTE_BOARDS.forEach(verifyRoutes);
        BOARDS.filter(b => b.target && b.route).forEach(verifyRoutes);
    });
})