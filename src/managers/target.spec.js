import { TargetManager } from "./target";
import { BoardManager } from "./board";
import { ROUTE_BOARDS, BOARDS } from '../boards.examples';
import { COMMANDS } from "../constants";
import { getNextSnakeMove } from "../bot";

describe("Target manager spec", () => {
    it('should instantiate target manager', () => {
        const bm = new BoardManager(BOARDS[0].board);
        const tm = new TargetManager(bm);
        expect(tm).toBeTruthy();
    });

    it('should find nearest enemy to target', () => {
        ROUTE_BOARDS.filter(rb => Boolean(rb.enemyToTarget)).forEach(({board, target, enemyToTarget}) => {
            const bm = new BoardManager(board);
            const tm = new TargetManager(bm);
            const res = tm.nearestEnemyTo(target);
            expect(res).toEqual(enemyToTarget);
        });
        BOARDS.filter(rb => Boolean(rb.enemyToTarget)).forEach(({board, target, enemyToTarget}, i) => {
            console.log('TEST: ', i);
            const bm = new BoardManager(board);
            const tm = new TargetManager(bm);
            const res = tm.nearestEnemyTo(target);
            expect(res).toEqual(enemyToTarget);
        });
    });

    it("should return enemies", () => {
        const bm = new BoardManager(BOARD);
        const tm = new TargetManager(bm);
        const enemyTarget = tm.getNearestEnemy([{command: COMMANDS.RIGHT}, {command: COMMANDS.UP}]);
        expect(enemyTarget.enemy.head).toEqual({x: 3, y: 2});
        expect(enemyTarget.enemy.size).toEqual(5);
        expect(enemyTarget.cmd).toEqual(COMMANDS.UP);
    });

    const BOARD = 
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼®                          ☼' +
    '☼# <───ö                     ☼' +
    '☼☼▲      ●         ○         ☼' +
    '☼☼║                     ○    ☼' +
    '☼☼║         ●  ┌> ○          ☼' +
    '☼☼║    ☼☼☼☼☼   │             ☼' +
    '☼☼║    ☼       │             ☼' +
    '☼#║    ☼☼☼     │  ☼☼☼☼#      ☼' +
    '☼☼╙    ☼       │  ☼   ☼  ●   ☼' +
    '☼☼     ☼☼☼☼#   ¤  ☼☼☼☼#      ☼' +
    '☼☼                ☼          ☼' +
    '☼☼                ☼         $☼' +
    '☼☼                           ☼' +
    '☼#                    ○      ☼' +
    '☼☼                           ☼' +
    '☼☼        ☼☼☼                ☼' +
    '☼☼       ☼  ☼                ☼' +
    '☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼' +
    '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼ ○  ☼' +
    '☼#     ○☼   ☼     ☼  ☼  ☼  ○ ☼' +
    '☼☼                ☼     ☼    ☼' +
    '☼☼     ●          ☼     ☼    ☼' +
    '☼☼                           ☼' +
    '☼☼                           ☼' +
    '☼☼ ○    ○      ●         ○ ○ ☼' +
    '☼#                           ☼' +
    '☼☼                           ☼' +
    '☼☼                           ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    const BOARD2 =
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼                 ○         ☼' +
    '☼#                           ☼' +
    '☼☼                           ☼' +
    '☼☼○           ○              ☼' +
    '☼☼      $                    ☼' +
    '☼☼     ☼☼☼☼☼                 ☼' +
    '☼☼○    ☼                     ☼' +
    '☼#     ☼☼☼        ☼☼☼☼#    © ☼' +
    '☼☼     ☼          ☼   ☼      ☼' +
    '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
    '☼☼                ☼        æ ☼' +
    '☼☼                ☼        │ ☼' +
    '☼☼                         │ ☼' +
    '☼#    ○       ®     ○     ┌┘ ☼' +
    '☼☼                       ┌┘  ☼' +
    '☼☼        ☼☼☼            │   ☼' +
    '☼☼   ®   ☼  ☼            ˅   ☼' +
    '☼☼      ☼☼☼☼#     ☼☼   ☼# ╔► ☼' +
    '☼☼      ☼   ☼     ☼ ☼ ☼ ☼ ║  ☼' +
    '☼#      ☼   ☼     ☼  ☼  ☼ ║  ☼' +
    '☼☼                ☼     ☼ ║  ☼' +
    '☼☼                ☼    ╓☼ ║  ☼' +
    '☼☼                     ╚══╝  ☼' +
    '☼☼                           ☼' +
    '☼☼                          ©☼' +
    '☼#                           ☼' +
    '☼☼                         ● ☼' +
    '☼☼                           ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    it("should return enemies 2", () => {
        const bm = new BoardManager(BOARD2);
        const tm = new TargetManager(bm);
        const options = [{command: COMMANDS.RIGHT}, {command: COMMANDS.UP}, {command: COMMANDS.LEFT}, {command: COMMANDS.DOWN}];
        const enemyTarget = tm.getNearestEnemy(options);
        expect(enemyTarget.enemy.head).toEqual({x: 25, y: 17});
        expect(enemyTarget.enemy.size).toEqual(9);
        expect(enemyTarget.cmd).toEqual(COMMANDS.UP);
    });

    it("should return enemy as target", () => {
        const bm = new BoardManager(BOARD2);
        const tm = new TargetManager(bm);
        const options = [{command: COMMANDS.RIGHT}, {command: COMMANDS.UP}, {command: COMMANDS.LEFT}, {command: COMMANDS.DOWN}];
        const target = tm.getTarget(options);
        console.log('testtt', target.cmd);
        expect(target.cmd).toBe(COMMANDS.UP);
    });

    const BOARD3 =
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼         ○              ○  ☼' +
    '☼#                           ☼' +
    '☼☼     ○ ●         ○         ☼' +
    '☼☼                           ☼' +
    '☼☼           ●               ☼' +
    '☼☼     ☼☼☼☼☼                 ☼' +
    '☼☼     ☼                     ☼' +
    '☼#     ☼☼☼        ☼☼☼☼#      ☼' +
    '☼☼     ☼       ˄  ☼   ☼  ●   ☼' +
    '☼☼     ☼☼☼☼#   │  ☼☼☼☼#      ☼' +
    '☼☼             │  ☼          ☼' +
    '☼☼            æ│  ☼          ☼' +
    '☼☼    ●       └┘             ☼' +
    '☼#         ╔╗╓               ☼' +
    '☼☼        ◄╝╚╝               ☼' +
    '☼☼        ☼☼☼  ®             ☼' +
    '☼☼   ○   ☼  ☼                ☼' +
    '☼☼      ☼☼☼☼#     ☼☼   ☼#    ☼' +
    '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼    ☼' +
    '☼#      ☼  ●☼     ☼  ☼  ☼    ☼' +
    '☼☼                ☼     ☼    ☼' +
    '☼☼     ●          ☼     ☼    ☼' +
    '☼☼  ○     ○        ○         ☼' +
    '☼☼                  ○        ☼' +
    '☼☼ ○    ○○     ●         ○   ☼' +
    '☼#                           ☼' +
    '☼☼              ○○           ☼' +
    '☼☼                           ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    it("should return enemy as target", () => {
        const bm = new BoardManager(BOARD3);
        const tm = new TargetManager(bm);
        const options = [{command: COMMANDS.RIGHT}, {command: COMMANDS.UP}, {command: COMMANDS.LEFT}, {command: COMMANDS.DOWN}];
        const target = tm.getTarget(options);
        expect(target.cmd).toBe(COMMANDS.LEFT);
    });

    it("get cmd", () => {
        let cmd = getNextSnakeMove(BOARD2, console.log);
        expect(cmd).toEqual(COMMANDS.UP);

        cmd = getNextSnakeMove(BOARD3, console.log);
        expect(cmd).toEqual(COMMANDS.LEFT);
    });

    it("test near enemy", () => {
        const BOARD =
        '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
        '☼☼             ╔═════════╗   ☼' +
        '☼#          ╘══╝       ● ║  ●☼' +
        '☼☼       ●               ║   ☼' +
        '☼☼                       ║   ☼' +
        '☼☼           ●       ●   ╚═╗ ☼' +
        '☼☼     ☼☼☼☼☼              ╔╝ ☼' +
        '☼☼     ☼                  ║  ☼' +
        '☼#     ☼☼☼     ©  ☼☼☼☼#   ║  ☼' +
        '☼☼     ☼          ☼   ☼  ●║  ☼' +
        '☼☼     ☼☼☼☼#      ☼☼☼☼#   ▼  ☼' +
        '☼☼                ☼          ☼' +
        '☼☼                ☼          ☼' +
        '☼☼     ┌─┐                   ☼' +
        '☼#     │ └────────┐ ┌┐       ☼' +
        '☼☼    ┌┘          └─┘└──> $  ☼' +
        '☼☼    │  ☼☼☼                 ☼' +
        '☼☼    │ ☼  ☼                 ☼' +
        '☼☼    │ ☼☼☼☼#     ☼☼   ☼#    ☼' +
        '☼☼    │ ☼   ☼   ● ☼○☼ ☼ ☼    ☼' +
        '☼#    │ ☼   ☼   ○ ☼ ●☼○ ☼    ☼' +
        '☼☼    ¤           ☼     ☼    ☼' +
        '☼☼     ●          ☼     ☼    ☼' +
        '☼☼                ○          ☼' +
        '☼☼    ●                      ☼' +
        '☼☼ ○           ●             ☼' +
        '☼#                           ☼' +
        '☼☼                           ☼' +
        '☼☼                           ☼' +
        '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

        const bm = new BoardManager(BOARD);
        const tm = new TargetManager(bm);
        const options = [{command: COMMANDS.RIGHT}, {command: COMMANDS.LEFT}, {command: COMMANDS.DOWN}];
        const target = tm.getTarget(options);
        console.log('target', target._target);
        expect(target.cmd).toBe(COMMANDS.DOWN);

    })
});
