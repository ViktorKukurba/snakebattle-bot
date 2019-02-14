import { ELEMENT, ENEMY_HEAD, ENEMY_BODY } from "../constants";
import { getElementByXY, positionsInArray, equalPositions } from "../utils";

const ENEMY_TAIL = [
    ELEMENT.ENEMY_TAIL_END_DOWN,
    ELEMENT.ENEMY_TAIL_END_LEFT,
    ELEMENT.ENEMY_TAIL_END_UP,
    ELEMENT.ENEMY_TAIL_END_RIGHT,
    ELEMENT.ENEMY_TAIL_INACTIVE,
];

const ENEMY_MAP = {
    [ELEMENT.ENEMY_BODY_RIGHT_UP]: [ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_LEFT_DOWN, ELEMENT.ENEMY_BODY_HORIZONTAL, ELEMENT.ENEMY_BODY_LEFT_UP],
    [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: [ELEMENT.ENEMY_BODY_LEFT_DOWN, ELEMENT.ENEMY_BODY_LEFT_UP, ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_RIGHT_UP, ELEMENT.ENEMY_BODY_HORIZONTAL],
    [ELEMENT.ENEMY_BODY_VERTICAL]: [ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_LEFT_DOWN, ELEMENT.ENEMY_BODY_LEFT_UP, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_RIGHT_UP],
    [ELEMENT.ENEMY_BODY_HORIZONTAL]: [ELEMENT.ENEMY_BODY_HORIZONTAL, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_RIGHT_UP, ELEMENT.ENEMY_BODY_LEFT_DOWN, ELEMENT.ENEMY_BODY_LEFT_UP],
    [ELEMENT.ENEMY_BODY_LEFT_UP]: [ELEMENT.ENEMY_BODY_HORIZONTAL, ELEMENT.ENEMY_BODY_RIGHT_UP, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_LEFT_DOWN],
    [ELEMENT.ENEMY_BODY_LEFT_DOWN]: [ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_LEFT_UP, ELEMENT.ENEMY_BODY_RIGHT_UP, ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_HORIZONTAL],
    
    [ELEMENT.ENEMY_HEAD_DOWN]: [ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_LEFT_DOWN],
    [ELEMENT.ENEMY_HEAD_RIGHT]: [ELEMENT.ENEMY_BODY_RIGHT_UP, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_HORIZONTAL],
    [ELEMENT.ENEMY_HEAD_UP]: [ELEMENT.ENEMY_BODY_VERTICAL, ELEMENT.ENEMY_BODY_LEFT_UP, ELEMENT.ENEMY_BODY_RIGHT_UP],
    [ELEMENT.ENEMY_HEAD_LEFT]: [ELEMENT.ENEMY_BODY_HORIZONTAL, ELEMENT.ENEMY_BODY_LEFT_UP, ELEMENT.ENEMY_BODY_LEFT_DOWN],
    [ELEMENT.ENEMY_HEAD_EVIL]: [ELEMENT.ENEMY_BODY_HORIZONTAL, ELEMENT.ENEMY_BODY_LEFT_UP, ELEMENT.ENEMY_BODY_LEFT_DOWN, ELEMENT.ENEMY_BODY_RIGHT_UP, ELEMENT.ENEMY_BODY_RIGHT_DOWN, ELEMENT.ENEMY_BODY_VERTICAL]
};

const ELEMENT_NEXT = {
    [ELEMENT.ENEMY_BODY_LEFT_UP]: [{x: -1, y: 0}, {x: 0, y: -1}],
    [ELEMENT.ENEMY_BODY_VERTICAL]: [{x: 0, y: -1}, {x: 0, y: 1}],
    [ELEMENT.ENEMY_BODY_RIGHT_UP]: [{x: 1, y: 0}, {x: 0, y: -1}],
    [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: [{x: 0, y: 1}, {x: 1, y: 0}],
    [ELEMENT.ENEMY_BODY_LEFT_DOWN]: [{x: -1, y: 0}, {x: 0, y: 1}],
    [ELEMENT.ENEMY_BODY_HORIZONTAL]: [{x: -1, y: 0}, {x: 1, y: 0}],
    
    [ELEMENT.ENEMY_HEAD_RIGHT]: [{x: -1, y: 0}],
    [ELEMENT.ENEMY_HEAD_UP]: [{x: 0, y: 1}],
    [ELEMENT.ENEMY_HEAD_LEFT]: [{x: 1, y: 0}],
    [ELEMENT.ENEMY_HEAD_DOWN]: [{x: 0, y: -1}],
    [ELEMENT.ENEMY_HEAD_EVIL]: [{x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}]
};

export class EnemyManager {

    head_;
    boardManager_;

    constructor(bm, h) {
        this.head_ = h;
        this.boardManager_ = bm;
        this.body_ = [];
    }

    get board_() {
        return this.boardManager_.board;
    }

    set head(position) {
        this.body_ = [];
        this.head_ = position;
    }

    get head() {
        return this.head_;
    }

    get isEvil() {
        if (this.head) {
            return getElementByXY(this.board_, this.head) === ELEMENT.ENEMY_HEAD_EVIL;
        }
    }

    body_;

    reset() {
        this.body_ = [];
        this.head = null;
    }

    indexOfPosition(position) {
        for(let i = 0; i < this.body_.length; i++) {
            if (equalPositions(position, this.body_[i])) {
                return i;
            }
        }
        return -1;
    }

    get size() {
        if (!this.head) {
            return false;
        }
        this.body_ = [];
        let currElement;
        let nextPosition = {...this.head};
        let nextElement = getElementByXY(this.board_, nextPosition);
        let size = 1;
        this.body_.push(nextPosition);

        if (nextElement === ELEMENT.ENEMY_HEAD_FLY) {
            return 0;
        }

        do {
            currElement = nextElement;
            [nextElement, nextPosition] = this.getNextSegment(nextElement, nextPosition);
            size++;
            if (size > 50 || ENEMY_TAIL.some(t => t === nextElement)) {
                return size;
            }
        }
        while(ELEMENT_NEXT[nextElement] && ENEMY_MAP[currElement].some(e => e === nextElement));
        return size;
    }

    getNextSegment(element, position) {
        this.body_.push(position);
        const diffs = ELEMENT_NEXT[element];
        if (!diffs) {
            console.log('ERROR:', element, position);
        }
        for (let i = 0; i < diffs.length; i++) {
            const diff = diffs[i];
            const nextPosition = {x: position.x + diff.x, y: position.y + diff.y};
            if (!positionsInArray(this.body_, nextPosition)) {
                const nextElement = getElementByXY(this.board_, nextPosition);
                return [nextElement, nextPosition];
            }
        }
    }

    isEnemyNear(position) {
        const surround = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0},  {x: -1, y: 0}]
        for (let i = 0, len = surround.length; i < len; i++) {
            const diff = surround[i];
            const p = {x: position.x + diff.x, y: position.y + diff.y};
            let element = getElementByXY(this.board_, p);
            if (ENEMY_HEAD.includes(element)) {
                this.head = p;
                return true;
            }
        }
        return false;
    }

    isEnemyBodyNear(position) {
        if (!position) return 0;
        let size = 0;
        let nextPosition = {...position};
        let nextElement = getElementByXY(this.board_, nextPosition);
        if (nextElement && ENEMY_BODY.some(e => e === nextElement)) {
            do {
                
                if (nextElement === ELEMENT.ENEMY_HEAD_FLY) {
                    return 0;
                }

                [nextElement, nextPosition] = this.getNextSegment(nextElement, nextPosition);
    
                size++;

                if (size > 50 || ENEMY_HEAD.some(h => h === nextElement)) {
                    this.head = nextPosition;
                    return this.size;
                }

                if (ENEMY_TAIL.some(t => t === nextElement)) {
                    this.body_.push(nextPosition);
                    return this.isEnemyBodyNear(this.body_[0]);
                }
            }
            while(!this.head);
        } else if (ENEMY_HEAD.some(e => e === nextElement)) {
            return this.isEnemyNear(position);
        }
        return 0;
    }
}
