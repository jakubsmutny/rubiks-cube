import { describe, it, expect } from 'vitest';
import { Move } from '../../../main/model/manipulation/Move';
import {Axis} from "../../../main/model/geometry/Axis";

describe('Move Class', () => {

    describe('Correctly normalize steps', () => {
        it('should translate steps to {-1, 0, 1, 2}', () => {
            const expected: number = 2
            const input: number = -2
            const result = Move['normalizeSteps'](input)
            expect(result).toEqual(expected)
        });
    });
});
