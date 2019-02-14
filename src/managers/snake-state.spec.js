import { SnakeStateManager } from "./snake-state";
import { BOARDS } from "../boards.examples";

describe('Snake state manager spec', () => {
    it('should instantiate', () => {
        const sm = new SnakeStateManager();
        expect(sm).toBeTruthy();
    })
});

