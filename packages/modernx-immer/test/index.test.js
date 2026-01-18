import modernx from 'modernx';
import userImmer from '../src/index';

describe('modernx-immer', () => {
  it('normal', () => {
    const app = modernx();
    app.use(userImmer());

    app.model({
      namespace: 'count',
      state: {
        a: {
          b: {
            c: 0,
          },
        },
        m: {
          b: {
            c: 0,
          },
        },
      },
      reducers: {
        add(state) {
          state.a.b.c += 1;
        },
      },
    });
    app.router(() => 1);
    app.start();

    const oldCount = app._store.getState().count;
    app._store.dispatch({ type: 'count/add' });
    const newCount = app._store.getState().count;
    expect(oldCount.a.b.c).toEqual(0);
    expect(newCount.a.b.c).toEqual(1);
  });

  it('compatibility with normal reducer usage', () => {
    const app = modernx();
    app.use(userImmer());

    app.model({
      namespace: 'count',
      state: {
        a: {
          b: {
            c: 0,
          },
        },
        m: {
          b: {
            c: 0,
          },
        },
      },
      reducers: {
        add(state) {
          return {
            ...state,
            a: {
              ...state.a,
              b: {
                ...state.a.b,
                c: state.a.b.c + 1,
              },
            },
          };
        },
      },
    });
    app.router(() => 1);
    app.start();

    const oldCount = app._store.getState().count;
    app._store.dispatch({ type: 'count/add' });
    const newCount = app._store.getState().count;
    expect(oldCount.a.b.c).toEqual(0);
    expect(newCount.a.b.c).toEqual(1);
    expect(newCount.m.b.c).toEqual(0);
  });
});
