import { Component, getComponent, Inject } from '../index';
import 'should';

class A { foo() { return 'bar'; }}

class B {
  @Inject()
  a: A;

  dd() {
    return this.a.foo();
  }
}

class C {
  @Inject()
  a: A;

  cc() {
    return this.a.foo();
  }
}

describe('egg-di', () => {
  it('inject normal', () => {
    const b = new B();
    b.dd().should.equal('bar');
  });

  it('getComponent', () => {
    const a = getComponent(A, {});
    const b = new B();
    jest.spyOn(a, 'foo').mockImplementation(() => 'ddd');
    b.dd().should.equal('ddd');
  });

  it('service should only inited once', () => {
    const b = new B();
    const c = new C();
    b.a.should.equal(c.a);
  });
});