## egg-di

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/egg-dier.svg?style=flat-square
[npm-url]: http://npmjs.org/package/egg-dier
[download-image]: https://img.shields.io/npm/dm/egg-dier.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-dier
[travis-image]: https://img.shields.io/travis/shepherdwind/egg-dier.svg?style=flat-square
[travis-url]: https://travis-ci.org/shepherdwind/egg-dier
[coveralls-image]: https://img.shields.io/coveralls/shepherdwind/egg-dier.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shepherdwind/egg-dier?branch=master

Dependency injection lib for [Egg.js](https://eggjs.org/).

### use

```typescript
// service
export class HackerNews extends Service {
  foo() {
  }
}

// other service
import { Inject } from 'egg-di';
export class Foo extends Service {
  @Inject()
  private readonly hackerNews: HackerNews;

  bar() {
    this.hackerNews.foo();
  }
}

// other controller
import { Inject } from 'egg-di';
export class Foo extends Controller {
  @Inject()
  private readonly hackerNews: HackerNews;

  bar() {
    this.hackerNews.foo();
  }
}
```

### test

Test injected service.

```typescript
// service
export class HackerNews extends Service {
  foo() {
  }
}

// hackernews.test.ts
import { getComponent } from 'egg-di';
describe('service/HackerNews.test.js', () => {
  const app = mm.app();
  let ctx: Context;
  let hackerNews: HackerNews;

  before(async () => {
    await app.ready();
    ctx = app.mockContext();
    hackerNews = getComponent(HackerNews, ctx);
  });

  it('getTopStories', async () => {
    const list = await hackerNews.getTopStories();
    assert(list.length === 30);
  });
});
```

Mock injected service.

```typescript
// service
export class HackerNews extends Service {
  foo() {
  }
}

// bar.test.ts
import { getComponent } from 'egg-di';
const app = mm.app();
ctx = app.mockContext();
const hackerNews: HackerNews = getComponent(HackerNews, ctx);
mm.data(hackerNews, 'foo', 'hello');
```