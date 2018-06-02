export function isClassComponent(type) {
    return type.prototype && typeof type.prototype.render === 'function';
}

export function getDisplayName(type) {
    return type.displayName || type.name || 'Unknown';
}

export function debugLog(msg) {
    console.debug(`%cRCL: ${msg}`, 'color: silver;');
}
