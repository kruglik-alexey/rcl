import shallowequal from 'shallowequal';
import deepequal from 'deep-equal';

export const NOT_EQ = -1;
export const STRICT_EQ = 0;
export const SHALLOW_EQ = 1;
export const DEEP_EQ = 2;

export const equalityDescriptions = {
    [STRICT_EQ]: 'strictly equal',
    [SHALLOW_EQ]: 'shallowly equal',
    [DEEP_EQ]: 'deeply equal'
};

export function checkEquality(a, b) {
    if (a === b) return STRICT_EQ;
    if (shallowequal(a, b)) return SHALLOW_EQ;
    if (deepequal(a, b)) return DEEP_EQ;

    return NOT_EQ;
}
