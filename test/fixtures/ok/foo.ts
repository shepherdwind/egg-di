import Bar from "./bar";
import { inject, Context } from "../../..";

@Context
export default class Foo {
  @inject(() => Bar) readonly bar: Bar;
  ctx: any;

  constructor(ctx: any) {
    this.ctx = ctx;
  }

  create() {
    this.bar.hello();
  }

  message() {
    console.log('haha');
  }
}
