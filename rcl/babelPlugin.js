const rclCreateElementName = '__createElement';
const nativeElementId = -1;
let nextInstanceId = 1;

module.exports = function(babel) {
    const t = babel.types;
    const rclCreateElementNameIdentifier = t.identifier(rclCreateElementName);

    return {
        visitor: {
            CallExpression(path, state) {
                const n = path.node;
                const isCreateElement =
                    n.arguments.length > 0 &&
                    t.isMemberExpression(n.callee) &&
                    n.callee.object.name === 'React' &&
                    n.callee.property.name === 'createElement';

                if (!isCreateElement) return;

                let idExpression;
                const isComposite = !t.isStringLiteral(n.arguments[0]);
                if (isComposite) {
                    idExpression = t.numericLiteral(nextInstanceId);
                    nextInstanceId++;
                } else {
                    idExpression = t.numericLiteral(nativeElementId);
                }

                const args = [idExpression].concat(n.arguments);
                const callee = t.memberExpression(n.callee.object, rclCreateElementNameIdentifier);
                path.replaceWith(t.callExpression(callee, args));
            }
        }
    };
};
