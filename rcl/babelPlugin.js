let instanceId = 0;

module.exports = function(babel) {
    const t = babel.types;

    return {
        visitor: {
            CallExpression(path, state) {
                const n = path.node;
                const isCreateCompositeElement =
                    n.arguments.length > 0 &&
                    !t.isStringLiteral(n.arguments[0]) &&
                    t.isMemberExpression(n.callee) &&
                    n.callee.object.name === 'React' &&
                    n.callee.property.name === 'createElement';
                if (isCreateCompositeElement) {
                    let args = n.arguments;
                    instanceId++;
                    args = [t.numericLiteral(instanceId)].concat(args);

                    const callee = t.memberExpression(n.callee.object, t.identifier('__createElement'));
                    return path.replaceWith(t.callExpression(callee, args));
                }
            }
        }
    };
};
