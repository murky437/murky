import m from 'mithril';
import { isAuthenticated } from '../auth/auth.ts';

function wrapComponentOrResolver(
  componentOrResolver: m.FactoryComponent | m.RouteResolver,
  doBefore: () => void
): m.FactoryComponent | m.RouteResolver {
  if (typeof componentOrResolver === 'function') {
    return function (vnode) {
      doBefore();
      return componentOrResolver(vnode);
    };
  } else {
    return {
      onmatch: async function (args, requestedPath, route) {
        doBefore();
        await componentOrResolver.onmatch?.(args, requestedPath, route);
      },
    };
  }
}

function requireAuth(
  componentOrResolver: m.FactoryComponent | m.RouteResolver
): m.FactoryComponent | m.RouteResolver {
  return wrapComponentOrResolver(componentOrResolver, () => {
    if (!isAuthenticated()) {
      m.route.set('/login');
    }
  });
}

export { requireAuth };
