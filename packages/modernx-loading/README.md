# modernx-loading

[![NPM version](https://img.shields.io/npm/v/modernx-loading.svg?style=flat)](https://npmjs.org/package/modernx-loading)
[![Build Status](https://img.shields.io/travis/modernxjs/modernx-loading.svg?style=flat)](https://travis-ci.org/modernxjs/modernx-loading)
[![Coverage Status](https://img.shields.io/coveralls/modernxjs/modernx-loading.svg?style=flat)](https://coveralls.io/r/modernxjs/modernx-loading)
[![NPM downloads](http://img.shields.io/npm/dm/modernx-loading.svg?style=flat)](https://npmjs.org/package/modernx-loading)

Auto loading data binding plugin for modernx. :clap: You don't need to write `showLoading` and `hideLoading` any more.

---

## Install

```bash
$ npm install modernx-loading --save
```

## Usage

```javascript
import createLoading from 'modernx-loading';

const app = modernx();
app.use(createLoading(opts));
```

Then we can access loading state from store.

### opts

- `opts.namespace`: property key on global state, type String, Default `loading`

[See real project usage on modernx-hackernews](https://github.com/perlinson/modernx-hackernews/blob/2c3330b1c8ae728c94ebe1399b72486ad5a1a7a0/src/index.js#L4-L7).

## State Structure

```
loading: {
  global: false,
  models: {
    users: false,
    todos: false,
    ...
  },
}
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
