require('reflect-metadata');

const containner = new Map();
const typeKey = Symbol('typeName');

exports.Component = function() {
  return (target, key) => {
    const c = Reflect.getMetadata('design:type', target, key);
    return {
      get() {
        return exports.getComponent(c, this.ctx);
      },
    };
  };
}

exports.Inject = exports.Component;

exports.getComponent = function(constructor, ctx) {
  const typeNameKey = constructor[typeKey] || Symbol(constructor.name);
  if (!containner.has(typeNameKey)) {
    containner.set(typeNameKey, new constructor(ctx));
    constructor[typeKey] = typeNameKey;
  }
  return containner.get(typeNameKey);
}

