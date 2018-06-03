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

function getMatchingNotEqualKeys(a, b, matcher) {
    const result = [];

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    for (var i = 0; i < keysA.length; i++) {
        const key = keysA[i];
        if (a[key] !== undefined && b[key] !== undefined && a[key] !== b[key]) {
            if (matcher(a[key], b[key])) {
                result.push(key);
            }
        }
    }

    return result;
}

export function getNotEqualFuntionsKeys(a, b) {
    return getMatchingNotEqualKeys(a, b, (x, y) => typeof x === 'Function' && y === 'Function');
}

export function getArraysWithEqualContentKeys(a, b) {
    return getMatchingNotEqualKeys(a, b, (x, y) => {
        if (!Array.isArray(a[key]) || !Array.isArray(b[key]) || a[key].length !== b[key].length) {
            return false;
        }

        for (var j = 0; j < a[key].length; j++) {
            if (a[key][j] !== b[key][j]) return false;
        }

        return true;
    });
}

export function checkEquality(a, b) {
    if (a === b) return STRICT_EQ;
    if (shallowequal(a, b)) return SHALLOW_EQ;
    if (deepequal(a, b)) return DEEP_EQ;

    return NOT_EQ;
}
