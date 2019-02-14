import { EnemyManager } from "./enemy";
import { BoardManager } from "./board";

describe('Enemy length', () => {
    const BOARD = 
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼         ○                 ☼' +
    '☼☼       ┌─>    ○            ☼' +
    '☼#     ×─┘           ╓       ☼' +
    '☼☼           ●  ˄ ○          ☼' +
    '☼☼     ☼☼☼☼☼    │            ☼' +
    '☼☼     ☼        ¤            ☼' +
    '☼☼     ☼   ○                 ☼' +
    '☼#     ☼☼☼   ╔═►  ☼☼☼☼#      ☼' +
    '☼☼     ☼     ╙    ☼   ☼  ●   ☼' +
    '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
    '☼☼                ☼          ☼' +
    '☼☼○               ☼         $☼' +
    '☼☼    ●  ○                   ☼' +
    '☼#           ×>○      ○      ☼' +
    '☼☼                           ☼' +
    '☼☼      æ                    ☼' +
    '☼☼ ○    │                    ☼' +
    '☼#      └─>                  ☼' +
    '☼☼      ☼   ☼   ● ☼ ☼ ☼ ☼ ○  ☼' +
    '☼#      ☼   ☼     ☼  ☼  ☼    ☼' +
    '☼☼                ☼     ☼    ☼' +
    '☼☼     ●          ☼     ☼    ☼' +
    '☼☼                           ☼' +
    '☼☼                  ○        ☼' +
    '☼☼        ×──> ●         ○   ☼' +
    '☼#                           ☼' +
    '☼☼               ○           ☼' +
    '☼☼                           ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    const BOARD2 = 
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼<┐              ☼ ○  ○     ☼' +
    '☼☼ │       © ©    ☼          ☼' +
    '☼☼ │                         ☼' +
    '☼# │                      ○  ☼' +
    '☼☼ │                   ®     ☼' +
    '☼☼ ¤      ☼☼☼                ☼' +
    '☼☼     ☼    æ         ○      ☼' +
    '☼#     ☼☼☼  │     ☼☼☼☼#      ☼' +
    '☼☼     ☼○   │●    ☼   ☼      ☼' +
    '☼☼     ☼☼☼☼#└┐˄ ◄╗☼☼☼☼#      ☼' +
    '☼☼           └┘ ╘╝☼  ○       ☼' +
    '☼☼               æ☼     ☼    ☼' +
    '☼☼  ○            │☼     ☼    ☼' +
    '☼☼               ˅           ☼' +
    '☼☼                ☼     ˄    ☼' +
    '☼☼                ☼     │    ☼' +
    '☼☼    ●    ○            │    ☼' +
    '☼#             ○ ●    ×─┘    ☼' +
    '☼☼                      ┌>   ☼' +
    '☼☼        ☼☼☼          ×┘    ☼' +
    '☼☼                ☼     ☼    ☼' +
    '☼☼     ●          ☼     ☼    ☼' +
    '☼☼                  <─┐      ☼' +
    '☼☼                   ×┘      ☼' +
    '☼☼        ×──> ●         ○   ☼' +
    '☼#                           ☼' +
    '☼☼               ○           ☼' +
    '☼☼                           ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    const BOARD3 =
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼                           ☼' +
    '☼# ●○                        ☼' +
    '☼☼       ●                   ☼' +
    '☼☼                  ┌──┐ ©   ☼' +
    '☼☼   ●       ●  ♦   │  └─ö   ☼' +
    '☼☼     ☼☼☼☼☼   ┌┘   │        ☼' +
    '☼☼     ☼ ○     │ ┌──┘        ☼' +
    '☼#     ☼☼☼     └─┘☼☼☼☼#      ☼' +
    '☼☼     ☼          ☼   ☼  ●   ☼' +
    '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
    '☼☼   ○            ☼          ☼' +
    '☼☼                ☼       ●  ☼' +
    '☼☼    ●                      ☼' +
    '☼#               ╓           ☼' +
    '☼☼               ║           ☼' +
    '☼☼        ☼☼☼    ║           ☼' +
    '☼☼       ☼○ ☼    ║           ☼' +
    '☼☼      ☼☼☼☼#    ║☼☼   ☼#    ☼' +
    '☼☼   ○  ☼   ☼   ●║☼ ☼ ☼ ☼    ☼' +
    '☼#      ☼   ☼ ○ ╔╝☼  ☼  ☼    ☼' +
    '☼☼     ◄════════╝ ☼     ☼    ☼' +
    '☼☼     ●          ☼     ☼    ☼' +
    '☼☼                           ☼' +
    '☼☼                  ┌──┐ ©   ☼' +
    '☼☼   ●       ●  ˄   │  └─ö   ☼' +
    '☼☼     ☼☼☼☼☼   ┌┘   │        ☼' +
    '☼☼     ☼ ○     │ ┌──┘        ☼' +
    '☼#     ☼☼☼     └─┘☼☼☼☼#      ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    const BOARD4 = 
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼     ☼☼☼☼☼╔══►   <┐        ☼' +
    '☼☼     ☼○  ╔╝  ╓┌───┘        ☼' +
    '☼#     ☼☼☼ ╚═══╝└┐☼☼☼☼#      ☼' +
    '☼☼     ☼        ┌┘☼   ☼      ☼' +
    '☼☼     ☼☼☼☼#   ●│ ☼☼☼☼#      ☼' +
    '☼☼  ○           ¤ ☼         ○☼' +
    '☼☼    ●☼               ○  ○  ☼' +
    '☼☼                ☼ ♦┐       ☼' +
    '☼☼○   ●   ×──────────┘       ☼' +
    '☼☼     ☼☼☼☼#      ☼☼☼☼#      ☼' +
    '☼☼    ┌♣                     ☼' +
    '☼#    │     ●                ☼' +
    '☼☼    │     ●●         ●     ☼' +
    '☼☼    │   ☼☼☼●               ☼' +
    '☼☼    │ ○☼  ☼                ☼' +
    '☼☼    │ ☼☼☼☼#     ☼☼   ☼#    ☼' +
    '☼☼   ┌┘ ☼   ☼     ☼ ☼●☼ ☼    ☼' +
    '☼#   │  ☼   ☼     ☼  ☼  ☼    ☼' +
    '☼☼   │            ☼     ☼    ☼' +
    '☼☼   └───ö●       ☼     ☼    ☼' +
    '☼☼                ☼     ☼æ   ☼' +
    '☼☼     ●          ☼     ☼└─> ☼' +
    '☼☼          ●              ◄╗☼' +
    '☼☼                ○ ○       ║☼' +
    '☼☼             ●         ╔══╝☼' +
    '☼#                       ║   ☼' +
    '☼☼                       ║   ☼' +
    '☼☼              ╘════════╝   ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼';

    const BOARD5 = 
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼' +
    '☼☼       <───┐               ☼' +
    '☼#          ●└─────ö         ☼' +
    '☼☼       ●                   ☼' +
    '☼☼    ┌─>○☼☼☼                ☼' +
    '☼☼   ○└ö ☼  ☼                ☼' +
    '☼☼     ☼☼☼☼☼                 ☼' +
    '☼☼     ☼                     ☼' +
    '☼# ○   ☼☼☼        ☼☼☼☼#      ☼' +
    '☼☼     ☼     ┌┐              ☼' +
    '☼#    ○☼☼☼   │└♣ ○☼☼☼☼#     ●☼' +
    '☼☼     ☼ ○   │    ☼   ☼  ●   ☼' +
    '☼☼     ☼☼☼☼# │    ☼☼☼☼#   ○  ☼' +
    '☼☼   ○       │    ☼          ☼' +
    '☼☼○          │    ☼          ☼' +
    '☼☼   ○●  ○   ¤               ☼' +
    '☼☼        ☼☼☼                ☼' +
    '☼☼       ☼  ☼                ☼' +
    '☼☼      ☼☼☼☼#   ˄ ☼☼   ☼#    ☼' +
    '☼☼      ☼   ☼   │ ☼ ☼ ☼ ☼    ☼' +
    '☼#      ☼   ☼  ©│ ☼  ☼  ☼    ☼' +
    '☼☼  ○           │●☼     ☼ ╓  ☼' +
    '☼☼   ©          └┐☼     ☼ ║  ☼' +
    '☼☼              ┌┘    ╔═══╝  ☼' +
    '☼☼              └┐    ╚══╗   ☼' +
    '☼☼             ● │       ║   ☼' +
    '☼#               │ ◄═════╝   ☼' +
    '☼☼               │           ☼' +
    '☼☼               ¤           ☼' +
    '☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼☼'
      


    it('enemy length test right', () => {
        const bm = new BoardManager(BOARD);
        const enemy = new EnemyManager(bm, {x: 13, y: 25});
        expect(enemy.size).toEqual(4);
        enemy.head = {x: 11, y: 2};
        expect(enemy.size).toEqual(6);
        enemy.head = {x: 14, y: 14};
        expect(enemy.size).toEqual(2);
        enemy.head = {x: 10, y: 18};
        expect(enemy.size).toEqual(5);
        enemy.head = {x: 16, y: 4};
        expect(enemy.size).toEqual(3);
    });

    it('enemy length test left', () => {
        const bm = new BoardManager(BOARD2);
        const enemy = new EnemyManager(bm, {x: 2, y: 1});
        expect(enemy.size).toEqual(7);
        enemy.head = {x: 14, y: 10};
        expect(enemy.size).toEqual(8);
        enemy.head = {x: 17, y: 14};
        expect(enemy.size).toEqual(3);

        enemy.head = {x: 24, y: 15};
        expect(enemy.size).toEqual(6);
        enemy.head = {x: 25, y: 19};
        expect(enemy.size).toEqual(4);
        enemy.head = {x: 20, y: 23};
        expect(enemy.size).toEqual(5);
    });

    it('is enemy head near', () => {
        const bm = new BoardManager(BOARD2);
        const enemy = new EnemyManager(bm);
        expect(enemy.isEnemyNear({x: 5, y: 2})).toBe(false);
        expect(enemy.isEnemyNear({x: 2, y: 2})).toBe(true);
    });

    it('is enemy head near2', () => {
        const bm = new BoardManager(BOARD3);
        const enemy = new EnemyManager(bm);
        enemy.head = {x: 16, y: 5};
        expect(enemy.size).toEqual(0);

        enemy.head = {x: 16, y: 25};
        expect(enemy.size).toEqual(20);

        bm.board = BOARD4;
        enemy.head = {x: 27, y: 22};
        expect(enemy.size).toEqual(4);
        enemy.head = {x: 19, y: 1};
        expect(enemy.size).toEqual(13);
        enemy.head = {x: 7, y: 11};
        expect(enemy.size).toEqual(16);
        expect(enemy.isEnemyBodyNear({x: 7, y: 13})).toBe(0);
        enemy.head = {x: 20, y: 8};
        expect(enemy.size).toEqual(0);

        bm.board = BOARD5;
        enemy.head = {x: 9, y: 1};
        expect(enemy.size).toEqual(12);
        enemy.head = {x: 16, y: 18};
        expect(enemy.size).toEqual(14);
        enemy.head = {x: 8, y: 4};
        expect(enemy.size).toEqual(5);
        enemy.head = {x: 15, y: 10};
        expect(enemy.size).toEqual(10);
    });

    it('is enemy body near', () => {
        const bm = new BoardManager(BOARD2);
        const enemy = new EnemyManager(bm);
        expect(enemy.isEnemyBodyNear({x: 3, y: 3})).toBe(7);
        expect(enemy.head).toEqual({x: 2, y: 1});

        enemy.head = null;
        expect(enemy.isEnemyBodyNear({x: 12, y: 9})).toBe(8);
        expect(enemy.head).toEqual({x: 14, y: 10});

        enemy.head = null;
        expect(enemy.isEnemyBodyNear({x: 5, y: 5})).toBe(0);
        expect(enemy.head).toEqual(null);
    });
})