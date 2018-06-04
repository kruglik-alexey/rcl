export function isClassComponent(type) {
    return type.prototype && typeof type.prototype.render === 'function';
}

export function getDisplayName(type, instance) {
    if (instance && instance.displayName) {
        return instance.displayName;
    }
    return type.displayName || type.name || type;
}

export function debugLog(msg) {
    console.debug(`%cRCL: ${msg}`, 'color: silver;');
}
