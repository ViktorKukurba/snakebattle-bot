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

 // https://game1.epam-bot-challenge.com.ua/codenjoy-contest/rest/player/viktor.kukurba@gmail.com/1048875233342840940/reset
import {
    getNextSnakeMove,
} from './bot';
import {
  COMMANDS
} from './constants';
import { BoardManager } from './managers/board';
import { BOARDS } from './boards.examples';

describe("bot", () => {
    const mockLogger = console.log;
    describe("getNextSnakeMove", ()=> {
        // const mockLogger = ()=> {};
        

       it("should define method", ()=> {
            expect(getNextSnakeMove).toBeDefined();
        });
       it("should avoid horisontal wall", ()=> {
            const board =
            '*****' +
            '*   *' +
            '*   *' +
            '* ═►*' +
            '*****'; 
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });
       it("should avoid wall", ()=> {
            const board =
            '*****' +
            '* ═►*' +
            '*   *' +
            '*   *' +
            '*****';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

       it("should try to catch apples", ()=> {
            const board =
            '******' +
            '* ═► *' +
            '*  ○ *' +
            '*    *' +
            '*    *' +
            '******';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

       it("should try to catch apples", ()=> {
            const board =
            '******' +
            '*  ○ *' +
            '* ═► *' +
            '*  $ *' +
            '*    *' +
            '******';
            const move = getNextSnakeMove(board, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

       it("setImpassedCells", () => {
            [3, 4, 5, 6, 7].forEach((i) => {
                const bm = new BoardManager(BOARDS[i].board);
                expect(bm._impassedCells).toEqual([ { x: 1, y: 2 },
                    { x: 1, y: 8 },
                    { x: 1, y: 14 },
                    { x: 1, y: 20 },
                    { x: 1, y: 26 },
                    { x: 8, y: 7 },
                    { x: 8, y: 9 },
                    { x: 9, y: 7 },
                    { x: 9, y: 9 },
                    { x: 10, y: 17 },
                    { x: 11, y: 17 },
                    { x: 12, y: 18 },
                    { x: 19, y: 9 },
                    { x: 19, y: 19 },
                    { x: 20, y: 9 },
                    { x: 21, y: 9 },
                    { x: 21, y: 19 },
                    { x: 23, y: 19 } ]);
            });
        });
    });

    describe('Test cmd choose', () => {
       it("should move correctly", () => {
            const i = 18;
            const {board, command} = BOARDS[i];
            const move = getNextSnakeMove(board, mockLogger);
            console.log(`NUMBER ${i} of ${BOARDS.length}`);
            expect(move).toEqual(command);

            BOARDS.filter(b => b.command).forEach(({board, command}, i) => {
                console.log(`NUMBER ${i} of ${BOARDS.length}`);
                const move = getNextSnakeMove(board, mockLogger);
                expect(move).toEqual(command);
            });
        });

       it("should turn from enemy", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                           ☼' +
            '☼#                           ☼' +
            '☼☼       ●                   ☼' +
            '☼☼                      ○   $☼' +
            '☼☼      ○    ●    æ          ☼' +
            '☼☼     ☼☼☼☼☼      │          ☼' +
            '☼☼     ☼         ┌┘          ☼' +
            '☼#     ☼☼☼     ○<┘☼☼☼☼#      ☼' +
            '☼☼     ☼       ▲  ☼   ☼  ●○  ☼' +
            '☼☼●    ☼☼☼☼#   ║  ☼☼☼☼#      ☼' +
            '☼☼             ║  ☼     $    ☼' +
            '☼☼             ║  ☼         $☼' +
            '☼☼    ●        ║             ☼' +
            '☼#             ╙      ○      ☼' +
            '☼☼                           ☼' +
            '☼☼        ☼☼☼                ☼' +
            '☼☼   ○   ☼  ☼                ☼' +
            '☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼ ○  ☼' +
            '☼#      ☼   ☼     ☼  ☼  ☼    ☼' +
            '☼☼®               ☼     ☼    ☼' +
            '☼☼     ●          ☼     ☼    ☼' +
            '☼☼                           ☼' +
            '☼☼                  ○        ☼' +
            '☼☼ ○    ○      ●         ○   ☼' +
            '☼#                           ☼' +
            '☼☼               ○           ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.LEFT);
        });

       it("should go to gold $", () => {
            const BOARD =
        '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
        '☼☼        ○○                 ☼' +
        '☼#                           ☼' +
        '☼☼  ○    ●                   ☼' +
        '☼☼            ○              ☼' +
        '☼☼ ○         ●               ☼' +
        '☼☼     ☼☼☼☼☼                 ☼' +
        '☼☼     ☼                     ☼' +
        '☼#     ☼☼☼        ☼☼☼☼#      ☼' +
        '☼☼     ☼          ☼   ☼  ●   ☼' +
        '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
        '☼☼●               ☼       ●  ☼' +
        '☼☼○        ○      ☼          ☼' +
        '☼☼    ●  ┌ö <┐               ☼' +
        '☼#○      └──┐│            ○  ☼' +
        '☼☼          └┘               ☼' +
        '☼☼○       ☼☼☼                ☼' +
        '☼☼   ○   ☼  ☼  ╔════╕        ☼' +
        '☼☼      ☼☼☼☼#╔═╝  ☼☼   ☼#    ☼' +
        '☼☼      ☼   ☼║  ● ☼ ☼ ☼ ☼    ☼' +
        '☼# ○   $☼   ☼▼    ☼  ☼  ☼ ○  ☼' +
        '☼☼                ☼ ●   ☼    ☼' +
        '☼☼                ☼ ○   ☼    ☼' +
        '☼☼        $                  ☼' +
        '☼☼      ●           ○        ☼' +
        '☼☼             ●         ○   ☼' +
        '☼#                           ☼' +
        '☼☼○  ○       ○   ○           ☼' +
        '☼☼                           ☼' +
        '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
        const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

       it("should atack enemy", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼         ○  ○              ☼' +
            '☼#              ○            ☼' +
            '☼☼  ○    ●                   ☼' +
            '☼☼                           ☼' +
            '☼☼ ○         ●               ☼' +
            '☼☼  ○  ☼☼☼☼☼                 ☼' +
            '☼☼     ☼                    ●☼' +
            '☼#     ☼☼☼        ☼☼☼☼#      ☼' +
            '☼☼     ☼          ☼○  ☼      ☼' +
            '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
            '☼☼    ○           ☼●         ☼' +
            '☼☼○               ☼          ☼' +
            '☼☼    ●                      ☼' +
            '☼#                           ☼' +
            '☼☼                           ☼' +
            '☼☼ ®   ○  ☼☼☼                ☼' +
            '☼☼  ●○   ☼  ☼        ○    ╔╗ ☼' +
            '☼☼      ☼☼☼☼#     ☼☼   ☼# ║║ ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼ ╙║ ☼' +
            '☼#      ☼   ☼     ☼  ☼  ☼  ║æ☼' +
            '☼☼                ☼     ☼  ║│☼' +
            '☼☼     ●         ○☼     ☼  ║│☼' +
            '☼☼                         ║│☼' +
            '☼☼      $                  ║│☼' +
            '☼☼ ○    ○      ●           ▼│☼' +
            '☼#                          ˅☼' +
            '☼☼      ○        ○   ©       ☼' +
            '☼☼ ®     ○                   ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);

        });

       it("should eat own tail", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼        ┌┐                 ☼' +
            '☼#      ┌─┘│                 ☼' +
            '☼☼○ ○<──┘● │                 ☼' +
            '☼☼         ¤                 ☼' +
            '☼☼ ○         ●               ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼          ○       ○  ☼' +
            '☼#     ☼☼☼        ☼☼☼☼#      ☼' +
            '☼☼     ☼          ☼   ☼  ●   ☼' +
            '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
            '☼☼                ☼          ☼' +
            '☼☼○    ┌─ö        ☼          ☼' +
            '☼☼  <──┘                     ☼' +
            '☼#                           ☼' +
            '☼☼                           ☼' +
            '☼☼        ☼☼☼            ●   ☼' +
            '☼☼       ☼  ☼        ○       ☼' +
            '☼☼      ☼☼☼☼#     ☼☼   ☼#  $ ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#      ☼  ○☼     ☼  ☼  ☼    ☼' +
            '☼☼                ☼╔═╗  ☼    ☼' +
            '☼☼     ●        ╓ ☼♥ ║  ☼    ☼' +
            '☼☼              ╚════╝       ☼' +
            '☼☼   ©                      ○☼' +
            '☼☼         ○   ●             ☼' +
            '☼#                           ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });

       it("should not eat enemy tail", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                           ☼' +
            '☼#                           ☼' +
            '☼☼       ●                ○  ☼' +
            '☼☼                           ☼' +
            '☼☼          ●●               ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼    æ☼                     ☼' +
            '☼#    │☼☼☼  ╔═╗   ☼☼☼☼#      ☼' +
            '☼☼    │☼    ║ ║   ☼   ☼      ☼' +
            '☼☼    │☼☼☼☼#║ ║   ☼☼☼☼#      ☼' +
            '☼☼ ┌──┘◄════╝ ║   ☼ ○        ☼' +
            '☼☼ │          ║   ☼          ☼' +
            '☼☼ │        ○ ║             ○☼' +
            '☼# ˅          ║              ☼' +
            '☼☼            ║              ☼' +
            '☼☼ ○      ☼☼☼ ║          ●   ☼' +
            '☼☼       ☼  ☼ ║    ○         ☼' +
            '☼☼  ○   ☼☼☼☼# ╙   ☼☼   ☼#    ☼' +
            '☼☼    ● ☼ ○ ☼   ● ☼ ☼ ☼ ☼ ○  ☼' +
            '☼#     ©☼   ☼     ☼  ☼  ☼    ☼' +
            '☼☼                ☼     ☼    ☼' +
            '☼☼     ●          ☼  ○  ☼    ☼' +
            '☼☼                  $○       ☼' +
            '☼☼                  ○        ☼' +
            '☼☼             ●         ○  ○☼' +
            '☼#                 ○         ☼' +
            '☼☼         ©   ® ○           ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.DOWN);
        });

       it("should omit evil enemy", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                      ○    ☼' +
            '☼#                           ☼' +
            '☼☼      ●●                   ☼' +
            '☼☼   ╔════╕                  ☼' +
            '☼☼   ║       ●               ☼' +
            '☼☼   ║ ☼☼☼☼☼                 ☼' +
            '☼☼   ║ ☼ ●               ○   ☼' +
            '☼#   ║ ☼☼☼        ☼☼☼☼#      ☼' +
            '☼☼   ║ ☼          ☼   ☼  ●   ☼' +
            '☼☼   ║ ☼☼☼☼#      ☼☼☼☼#      ☼' +
            '☼☼   ║            ☼○         ☼' +
            '☼☼   ║            ☼   ○      ☼' +
            '☼☼   ║●  ○                   ☼' +
            '☼#   ║               ●      ○☼' +
            '☼☼   ║                   ○   ☼' +
            '☼☼○  ║    ☼☼☼   ●            ☼' +
            '☼☼○  ║   ☼  ☼○               ☼' +
            '☼☼   ║  ☼☼☼☼#     ☼☼  ○☼#    ☼' +
            '☼☼   ▼  ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#      ☼   ☼     ☼  ☼  ☼    ☼' +
            '☼☼ ┌───┐♣         ☼    ○☼    ☼' +
            '☼☼ └┐  ││         ☼     ☼    ☼' +
            '☼☼  ¤  └┘      ®         ○   ☼' +
            '☼☼                           ☼' +
            '☼☼ ○                         ☼' +
            '☼#                           ☼' +
            '☼☼     ○      ○  ○           ☼' +
            '☼☼                          ○☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.LEFT);
        });

       it("should turn from enemy body", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                           ☼' +
            '☼# ○                         ☼' +
            '☼☼       ●                   ☼' +
            '☼☼                           ☼' +
            '☼☼           ●               ☼' +
            '☼☼     ☼☼☼☼☼ ┌ö              ☼' +
            '☼☼ ○○  ☼    ┌┘               ☼' +
            '☼#     ☼☼☼  │     ☼☼☼☼#      ☼' +
            '☼☼ ○   ☼    └─┐   ☼   ☼  ●   ☼' +
            '☼☼     ☼☼☼☼#▲ ˅   ☼☼☼☼#┌─ö   ☼' +
            '☼☼          ║     ☼    │     ☼' +
            '☼☼ ®        ║ ╘═╗ ☼┌───┘     ☼' +
            '☼☼    ●     ╚═══╝  │         ☼' +
            '☼#             ©   ˅         ☼' +
            '☼☼                           ☼' +
            '☼☼        ☼☼☼                ☼' +
            '☼☼       ☼  ☼                ☼' +
            '☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#      ☼   ☼ ○   ☼  ☼  ☼    ☼' +
            '☼☼       ○        ☼     ☼    ☼' +
            '☼☼     ●          ☼     ☼    ☼' +
            '☼☼ ©                         ☼' +
            '☼☼                           ☼' +
            '☼☼ ○  ○ ○      ●             ☼' +
            '☼#                           ☼' +
            '☼☼                           ☼' +
            '☼☼                 ○         ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
        });

       it("test", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                           ☼' +
            '☼#                 ○         ☼' +
            '☼☼       ●                 ● ☼' +
            '☼☼   ○                       ☼' +
            '☼☼                           ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼    ┌─────────ö      ☼' +
            '☼#     ☼☼☼  │     ☼☼☼☼#      ☼' +
            '☼☼     ☼    │     ☼   ☼      ☼' +
            '☼☼     ☼☼☼☼#│ ●   ☼☼☼☼#      ☼' +
            '☼☼  ╔►♣─────┘ ○   ☼          ☼' +
            '☼☼  ║ ●           ☼          ☼' +
            '☼☼  ║ ●                      ☼' +
            '☼#  ║              ●         ☼' +
            '☼☼  ║                        ☼' +
            '☼☼  ║     ☼☼☼              ○ ☼' +
            '☼☼  ╚══╗ ☼  ☼         ○      ☼' +
            '☼☼  ╔══╝☼☼☼☼#   © ☼☼ ○ ☼#    ☼' +
            '☼☼  ║   ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#  ║   ☼   ☼     ☼  ☼  ☼   ○☼' +
            '☼☼  ║            ○☼     ☼    ☼' +
            '☼☼  ║             ☼     ☼  ○ ☼' +
            '☼☼  ║           ○ ○          ☼' +
            '☼☼  ╙                   ○  ○ ☼' +
            '☼☼             ●             ☼' +
            '☼#                    ○      ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });

       it("test route", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼   ▲     ┌──┐              ☼' +
            '☼#   ╚╗    └┐┌┘             ○☼' +
            '☼☼  ╔═╝  ●  │¤               ☼' +
            '☼☼  ║       │           ○    ☼' +
            '☼☼ ╔╝       │●               ☼' +
            '☼☼ ║   ☼☼☼☼☼└──┐             ☼' +
            '☼☼╔╝   ☼   ○   │     ○○      ☼' +
            '☼#║ ○  ☼☼☼     ˅  ☼☼☼☼#      ☼' +
            '☼☼║    ☼       ®  ☼   ☼  ●   ☼' +
            '☼☼║    ☼☼☼☼#      ☼☼☼☼# ○    ☼' +
            '☼☼║               ☼          ☼' +
            '☼☼╚═╕             ☼          ☼' +
            '☼☼○                          ☼' +
            '☼#                           ☼' +
            '☼☼                           ☼' +
            '☼☼        ☼☼☼   $            ☼' +
            '☼☼       ☼  ☼ ©      ○       ☼' +
            '☼☼   ○ ●☼☼☼☼#     ☼☼ ○ ☼#    ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#      ☼   ☼     ☼  ☼  ☼ ○  ☼' +
            '☼☼                ☼     ☼    ☼' +
            '☼☼     ●   ○      ☼     ☼    ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼             ●      ○      ☼' +
            '☼#     ©      ○              ☼' +
            '☼☼  ®     ○                  ☼' +
            '☼☼     ○                     ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
    
            let move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);

            const BOARD2 =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼         ╔══►              ☼' +
            '☼#     ○   ║    ╔══════╕     ☼' +
            '☼☼  ○    ● ╚╗ ╔═╝            ☼' +
            '☼☼ ○        ╚═╝              ☼' +
            '☼☼ ○         ●               ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼                     ☼' +
            '☼#     ☼☼☼ ○      ☼☼☼☼#      ☼' +
            '☼☼     ☼$         ☼   ☼  ●   ☼' +
            '☼☼  ○  ☼☼☼☼#      ☼☼☼☼#      ☼' +
            '☼☼                ☼          ☼' +
            '☼☼                ☼          ☼' +
            '☼☼    ●                    ┌┐☼' +
            '☼#                       <─┘│☼' +
            '☼☼      ○              ┌─┐ ┌┘☼' +
            '☼☼○       ☼☼☼          ¤ │ └┐☼' +
            '☼☼       ☼○ ☼            └──┘☼' +
            '☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#  ●   ☼   ☼     ☼  ☼  ☼    ☼' +
            '☼☼        ●       ☼     ☼    ☼' +
            '☼☼     ●          ☼     ☼    ☼' +
            '☼☼       ○                   ☼' +
            '☼☼     ○                   ○©☼' +
            '☼☼                           ☼' +
            '☼#                           ☼' +
            '☼☼○                      ○   ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            move = getNextSnakeMove(BOARD2, mockLogger);
            expect(move).toEqual(COMMANDS.RIGHT);
            
        });

       it("test 2", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                           ☼' +
            '☼#                 ○         ☼' +
            '☼☼       ●                 ● ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼    ┌─────────ö      ☼' +
            '☼#     ☼☼☼  │     ☼☼☼☼#      ☼' +
            '☼☼     ☼    │     ☼   ☼      ☼' +
            '☼☼     ☼☼☼☼#│ ●   ☼☼☼☼#      ☼' +
            '☼☼  ╔► ♣────┘ ○   ☼          ☼' +
            '☼☼  ║ ●           ☼          ☼' +
            '☼☼  ║ ●                      ☼' +
            '☼#  ║              ●         ☼' +
            '☼☼  ║                        ☼' +
            '☼☼  ║     ☼☼☼              ○ ☼' +
            '☼☼  ╚══╗ ☼  ☼         ○      ☼' +
            '☼☼  ╔══╝☼☼☼☼#   © ☼☼ ○ ☼#    ☼' +
            '☼☼  ║   ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#  ║   ☼   ☼     ☼  ☼  ☼   ○☼' +
            '☼☼  ║            ○☼     ☼    ☼' +
            '☼☼  ║             ☼     ☼  ○ ☼' +
            '☼☼  ║           ○ ○          ☼' +
            '☼☼  ╙                   ○  ○ ☼' +
            '☼☼             ●             ☼' +
            '☼#                    ○      ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        });

        it("test3", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼         ○                 ☼' +
            '☼#                           ☼' +
            '☼☼  ○    ●                   ☼' +
            '☼☼       ○                   ☼' +
            '☼☼ ○   ©     ●               ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼        ○            ☼' +
            '☼#     ☼☼☼        ☼☼☼☼#      ☼' +
            '☼☼     ☼    ○     ☼   ☼      ☼' +
            '☼☼   ○ ☼☼☼☼#      ☼☼☼☼#      ☼' +
            '☼☼          ○     ☼          ☼' +
            '☼☼○               ☼          ☼' +
            '☼☼    ●                      ☼' +
            '☼#                           ☼' +
            '☼☼                           ☼' +
            '☼☼  ○     ☼☼☼                ☼' +
            '☼☼   ○®○ ☼  ☼                ☼' +
            '☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼' +
            '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼╓   ☼' +
            '☼#      ☼   ☼     ☼  ☼  ☼║   ☼' +
            '☼☼                ☼®    ☼║   ☼' +
            '☼☼     ●    ○     ☼     ☼║   ☼' +
            '☼☼   ○                   ║   ☼' +
            '☼☼                  ○    ║   ☼' +
            '☼☼ ○    ○      ●   ●     ║   ☼' +
            '☼#        $             ╔╝æ˄ ☼' +
            '☼☼              ●○      ║●││ ☼' +
            '☼☼                      ▼ └┘ ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.LEFT);
        });

        it("test4", () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                           ☼' +
            '☼#                 ○         ☼' +
            '☼☼       ●                 ● ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼    ┌─────────ö      ☼' +
            '☼#     ☼☼☼  │     ☼☼☼☼#      ☼' +
            '☼☼ ˄   ☼    │     ☼   ☼      ☼' +
            '☼☼ │   ☼☼☼☼#│ ●   ☼☼☼☼#      ☼' +
            '☼☼ │♥  ♣────┘ ○   ☼          ☼' +
            '☼☼ │║ ●           ☼          ☼' +
            '☼☼ │║ ●                      ☼' +
            '☼# ö║              ●         ☼' +
            '☼☼  ║                        ☼' +
            '☼☼  ║     ☼☼☼              ○ ☼' +
            '☼☼  ╚══╗ ☼  ☼         ○      ☼' +
            '☼☼  ╔══╝☼☼☼☼#   © ☼☼ ○ ☼#    ☼' +
            '☼☼  ║   ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
            '☼#  ║   ☼   ☼     ☼  ☼  ☼   ○☼' +
            '☼☼  ║            ○☼     ☼    ☼' +
            '☼☼  ║             ☼     ☼  ○ ☼' +
            '☼☼  ║           ○ ○          ☼' +
            '☼☼  ╙                   ○  ○ ☼' +
            '☼☼             ●             ☼' +
            '☼#                    ○      ☼' +
            '☼☼                           ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.LEFT);
        });

        it('test5', () => {
            const BOARD =
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
            '☼☼                   <──┐    ☼' +
            '☼#         ○         ●  └───┐☼' +
            '☼☼       ●                ×─┘☼' +
            '☼☼                           ☼' +
            '☼☼           ●               ☼' +
            '☼☼     ☼☼☼☼☼                 ☼' +
            '☼☼     ☼       ●             ☼' +
            '☼#     ☼☼☼        ☼☼☼☼#      ☼' +
            '☼☼     ☼          ☼   ☼  ●   ☼' +
            '☼☼     ☼☼☼☼#      ☼☼☼☼# ©    ☼' +
            '☼☼○    ©          ☼          ☼' +
            '☼☼                ☼          ☼' +
            '☼☼    ●  ○                   ☼' +
            '☼#                       ○   ☼' +
            '☼☼          <┐▲              ☼' +
            '☼☼        ☼☼☼│║             ○☼' +
            '☼☼       ☼  ☼│║              ☼' +
            '☼☼      ☼☼☼☼#│║   ☼☼   ☼#    ☼' +
            '☼☼      ☼   ☼│║ ● ☼ ☼ ☼ ☼ ○  ☼' +
            '☼#      ☼   ☼¤║   ☼  ☼  ☼    ☼' +
            '☼☼   <──┐     ║   ☼     ☼    ☼' +
            '☼☼     ●│     ║   ☼     ☼    ☼' +
            '☼☼      │     ╙           ○  ☼' +
            '☼☼     ×┘                    ☼' +
            '☼☼             ●             ☼' +
            '☼#                           ☼' +
            '☼☼          ○                ☼' +
            '☼☼                           ☼' +
            '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';
            const move = getNextSnakeMove(BOARD, mockLogger);
            expect(move).toEqual(COMMANDS.UP);
        })
    })
});
