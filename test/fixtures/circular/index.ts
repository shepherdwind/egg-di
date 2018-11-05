import { Context, inject } from "../../..";
import Foo from "./foo";
import Bar from "./bar";

@Context
export default class Inner {
  ctx: any;

  @inject() readonly bar: Bar;
  @inject() readonly foo: Foo;

  constructor(ctx: any) {
    this.ctx = ctx;
  }

  start() {
    this.bar.message();
    this.foo.create();
  }
}