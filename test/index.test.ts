import { getComponent, inject, Context, Application } from '../index';
import 'should';

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
    const a = getComponent(A, ctx);
    jest.spyOn(a, 'foo').mockImplementation(() => 'ddd');
    b.dd().should.equal('ddd');
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
});
