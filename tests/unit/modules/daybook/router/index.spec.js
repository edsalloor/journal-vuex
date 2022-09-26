import daybookRouter from '@/modules/daybook/router';

describe('router', () => {
  it('should have expected settings', async () => {
    expect(daybookRouter).toMatchObject({
      name: 'daybook',
      component: expect.any(Function),
      children: [
        {
          path: '',
          name: 'no-entry',
          component: expect.any(Function),
        },
        {
          path: ':id',
          name: 'entry',
          component: expect.any(Function),
          props: expect.any(Function)
        }
      ]
    });

    const promiseRouteComponents = [];
    daybookRouter.children.forEach(child =>
      promiseRouteComponents.push(child.component())
    );
    const routeComponentNames = (await Promise.all(promiseRouteComponents)).map(r => r.default.name);

    expect(routeComponentNames).toContain('NoEntrySelected');
    expect(routeComponentNames).toContain('NoEntrySelected');
  });

  it('should return the id of the route', () => {
    const route = {
      params: {
        id: 'ABC-123'
      }
    };

    const entryRoute = daybookRouter.children.find(route => route.name === 'entry');
    expect(entryRoute.props(route)).toStrictEqual({ id: route.params.id });
  });
});
