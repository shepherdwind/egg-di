require('reflect-metadata');

const typeKey = Symbol('typeName');
const containnerKey = Symbol('containner');

exports.inject = function() {
  return (target, key) => {
    const c = Reflect.getMetadata('design:type', target, key);
    const injectType = c[containnerKey];
    if (!injectType || !InjectType[injectType]) {
      throw new Error(`Inject ${c.name} component must decorator by @Context or @Application`);
    }
    return {
      get() {
        return exports.getComponent(c, this.ctx, injectType);
      },
    };
  }
}

const InjectType = {
  Context: 'Context',
  Application: 'Application',
};

exports.InjectType = InjectType;

exports.Context = function(target) {
  target[containnerKey] = InjectType.Context;
}

exports.Application = function(target) {
  target[containnerKey] = InjectType.Application;
}

exports.getComponent = function(constructor, ctx, injectType = InjectType.Context) {
  const typeNameKey = constructor[typeKey] || Symbol(constructor.name);
  const base = injectType === InjectType.Context ? ctx : ctx.app;
  let containner = base[containnerKey];
  // init containner
  if (!containner) {
    containner = new Map();
    base[containnerKey] = containner;
  }

  if (!containner.has(typeNameKey)) {
    // init component
    containner.set(typeNameKey, new constructor(ctx));
    constructor[typeKey] = typeNameKey;
  }
  return containner.get(typeNameKey);
}

