const template = require('babel-template');

const idPropName = '__rclId__';
const rclCreateElementName = '__createElement';

let instanceId = 0;

const getParentIdExpression = template(
    `const VAR = (arguments[0] === undefined ? this.props : arguments[0]).${idPropName} + '_';`
);

const getIdExpression = template('VAR + ID');

module.exports = function(babel) {
    const t = babel.types;
    const rclCreateElementNameIdentifier = t.identifier(rclCreateElementName);

    const processedFuncs = new Map();

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
                    const parentFunc = path.find(p =>
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

                    let parentIdVarName = processedFuncs.get(parentFunc);
                    if (!parentIdVarName) {
                        const n = parentFunc.node;
                        const params = n.params;
                        parentIdVarName = parentFunc.scope.generateUidIdentifier('thisId');
                        processedFuncs.set(parentFunc, parentIdVarName);
                        const parentIdExpression = getParentIdExpression({VAR: parentIdVarName});

                        if (t.isBlockStatement(n.body)) {
                            const newBody = t.blockStatement([parentIdExpression].concat(n.body.body));

                            let r;
                            if (parentFunc.isClassMethod()) {
                                r = t.classMethod(n.kind, n.key, params, newBody, n.computed, n.strict);
                            } else if (parentFunc.isObjectMethod()) {
                                r = t.objectMethod(n.kind, n.key, params, newBody, n.computed);
                            } else if (parentFunc.isFunctionExpression()) {
                                r = t.functionExpression(n.id, params, newBody, n.generator, n.async);
                            } else if (parentFunc.isFunctionDeclaration()) {
                                r = t.functionDeclaration(n.id, params, newBody, n.generator, n.async);
                            } else if (parentFunc.isArrowFunctionExpression()) {
                                r = t.arrowFunctionExpression(params, newBody);
                            } else {
                                console.warn('Invariant violation 1');
                                return;
                            }

                            parentFunc.replaceWith(r);
                        } else if (t.isArrowFunctionExpression(n)) {
                            const newBody = t.blockStatement([parentIdExpression, t.returnStatement(n.body)])
                            parentFunc.replaceWith(t.arrowFunctionExpression(params, newBody));
                        } else {
                            console.warn('Invariant violation 2');
                            return;
                        }
                    }

                    let args = n.arguments;
                    instanceId++;

                    const idExpression = getIdExpression({
                        VAR: parentIdVarName,
                        ID: t.stringLiteral(instanceId.toString())
                    }).expression;
                    args = [idExpression].concat(args);

                    const callee = t.memberExpression(n.callee.object, rclCreateElementNameIdentifier);
                    path.replaceWith(t.callExpression(callee, args));
                }
            }
        }
    };
};
