export function compare(a: unknown, b: unknown, compareDepth?: number): boolean {
    if (typeof a !== typeof b) return false;

    const t = typeof a;

    if (t === "boolean" || t === "number" || t === "string" || t === "bigint" || t === "symbol") {
        return a === b;
    }

    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;

        for (const [key, value] of a) {
            if (compareDepth === 0) {
                if (!Object.is(value, b.get(key))) {
                    return false;
                }
            } else if (!compare(value, b.get(key), getCompareDepth())) {
                return false;
            }
        }

        return true;
    }

    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;

        for (const value of a) {
            if (!b.has(value)) {
                return false;
            }
        }

        return true;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (compareDepth === 0) {
                if (!Object.is(a[i], b[i])) {
                    return false;
                }
            } else if (!compare(a[i], b[i], getCompareDepth())) {
                return false;
            }
        }

        return true;
    }

    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            const va = (a as any)[key];
            const vb = (b as any)[key];
            if (compareDepth === 0) {
                if (!Object.is(va, vb)) {
                    return false;
                }
            } else if (!compare(va, vb, getCompareDepth())) {
                return false;
            }
        }

        return true;
    }

    return false;

    function getCompareDepth() {
        if (compareDepth === undefined) return undefined;
        if (compareDepth === 0) return 0;
        return compareDepth - 1;
    }
}

export function getCompare(depth?: number) {
    return (a: unknown, b: unknown) => compare(a, b, depth);
}

function isObject(v: unknown): v is object {
    return typeof v === "object";
}
