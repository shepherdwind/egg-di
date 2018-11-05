import Foo from "./foo";
import { inject, Context } from "../../..";

@Context
export default class Bar {
  @inject() readonly foo: Foo;

  ctx: any;

  constructor(ctx: any) {
    this.ctx = ctx;
  }

  hello() {
    console.log('hello');
  }

  message() {
    this.foo.message();
  }
}
