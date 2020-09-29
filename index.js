require('reflect-metadata');
const { INJECTED_TAG_CLASS, INJECTED_TAG_PROP } = require('./lib/const')

const typeKey = Symbol('typeName');
const containnerKey = Symbol('containner');

exports.inject = function(fallback) {
  return (target, key) => {
    Reflect.defineMetadata(INJECTED_TAG_PROP, InjectType.Property, target, key)
    return {
      get() {
        let c = Reflect.getMetadata('design:type', target, key);

        // circular dependency caused can not get target
        if (!c) {
          // support @inject(() => Bar)
          if (typeof fallback === 'function') {
            c = fallback();
          }
          if (!c) {
            throw new Error(`${target.constructor.name} inject ${key} fail, This problem is usually caused by a circular dependency`);
          }
        }

        const injectType = Reflect.getMetadata(INJECTED_TAG_CLASS, c);
        if (!injectType || !InjectType[injectType]) {
          throw new Error(`Inject ${c.name} component must decorator by @Context or @Application`);
        }
        return exports.getComponent(c, this.ctx, injectType);
      },
    };
  }
}

const InjectType = {
  Context: 'Context',
  Application: 'Application',
  Property: 'Property',
};

exports.InjectType = InjectType;

exports.Context = function(target) {
  Reflect.defineMetadata(INJECTED_TAG_CLASS, InjectType.Context, target)
}

exports.Application = function(target) {
  Reflect.defineMetadata(INJECTED_TAG_CLASS, InjectType.Application, target)
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

exports.INJECTED_TAG_CLASS = INJECTED_TAG_CLASS
exports.INJECTED_TAG_PROP = INJECTED_TAG_PROP

