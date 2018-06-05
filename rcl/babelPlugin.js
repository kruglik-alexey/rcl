const rclCreateElementName = '__createElement';
const nativeElementId = -1;
let nextInstanceId = 1;
let nextFuncId = 1;

module.exports = function(babel) {
    const t = babel.types;
    const rclCreateElementNameIdentifier = t.identifier(rclCreateElementName);
    const funcIds = new Map();

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


                const parentFunc = path.find(p =>
                    p.isProgram() ||
                    p.isClassMethod() ||
                    p.isObjectMethod() ||
                    p.isFunctionExpression() ||
                    p.isFunctionDeclaration() ||
                    p.isArrowFunctionExpression()
                );
                if (!parentFunc) {
                    console.warn('Can\'t find enclosing funcion');
                    return;
                }

                let funcId = funcIds.get(parentFunc);
                if (funcId === undefined) {
                    funcId = nextFuncId;
                    funcIds.set(parentFunc, funcId);
                    nextFuncId++;
                }

                let idExpression;
                const isComposite = !t.isStringLiteral(n.arguments[0]);
                if (isComposite) {
                    idExpression = t.numericLiteral(nextInstanceId);
                    nextInstanceId++;
                } else {
                    idExpression = t.numericLiteral(nativeElementId);
                }

                const args = [idExpression, t.numericLiteral(funcId)].concat(n.arguments);
                const callee = t.memberExpression(n.callee.object, rclCreateElementNameIdentifier);
                path.replaceWith(t.callExpression(callee, args));
            }
        }
    };
};
