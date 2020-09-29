import 'should';
import 'reflect-metadata';
import { getComponent, inject, Context, Application, InjectType } from '..';
const { INJECTED_TAG_CLASS, INJECTED_TAG_PROP } = require('../lib/const');


@Context
class A { foo() { return 'bar'; }}

@Application
class A2 { foo() { return 'bar2'; }}

class B {
  constructor(private readonly ctx: any) { }

  @inject()
  a: A;

  @inject()
  b: A2;

  dd() {
    return this.a.foo();
  }

  dd2() {
    return this.b.foo();
  }
}

class C {
  constructor(private readonly ctx: any) { }

  @inject()
  a: A;

  cc() {
    return this.a.foo();
  }
}

describe('egg-di', () => {
  const ctx = { app: {} };
  it('inject normal', () => {
    const b = new B(ctx);
    b.dd().should.equal('bar');
    b.dd2().should.equal('bar2');
  });

  it('getComponent', () => {
    const b = new B(ctx);
    const a: A = getComponent(A, ctx);
    b.dd().should.equal('bar');
    a.foo().should.equal('bar');
  });

  it('service should only inited once', () => {
    const b = new B(ctx);
    const c = new C(ctx);
    b.a.should.equal(c.a);
  });

  it('inject to error', () => {
    (function() {
      class D {
        ctx = {};

        @inject()
        b: B;
      }
      (new D()).b;
    }).should.throw();
  });

  it('circular dependency resolved', () => {
    const O = require('./fixtures/ok/').default;
    const ret = new O({ name: 'haha' }).start();
    ret.should.equal('ok');
  });

  it('circular dependency', () => {
    (function() {
      const O = require('./fixtures/circular/').default;
      new O({ name: 'haha' }).start();
    }).should.throw(/circular dependency/);
  });

  it('injected class for context should be realized', () => {
    Reflect.getMetadata(INJECTED_TAG_CLASS, A).should.equal(InjectType.Context);
  })

  it('injected class for application should be realized', () => {
    Reflect.getMetadata(INJECTED_TAG_CLASS, A2).should.equal(InjectType.Application);
  })

  it('injected property should be realized', () => {
    const ctx = { app: {} };
    Reflect.getMetadata(INJECTED_TAG_PROP, new B(ctx), 'a').should.equal(InjectType.Property);
  })
});
