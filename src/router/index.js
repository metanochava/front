import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { installAuthGuard, installPageTitle } from 'quasar_resaas'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// Hash mode only reads the part after "#": a path typed before it
// (https://site/nao-existe) was ignored and the home page opened. Move it
// into the hash, so the router resolves it - a real page, or the site's 404.
function movePathIntoHash() {
  if (process.env.SERVER || process.env.VUE_ROUTER_MODE === 'history') return

  const base = (process.env.VUE_ROUTER_BASE || '/').replace(/\/?$/, '/')
  const { pathname, search, hash } = window.location
  if (!pathname.startsWith(base)) return

  const path = pathname.slice(base.length - 1)
  if (path === '/' || path === '/index.html') return

  const target = hash && hash !== '#/' ? hash : `#${path}${search}`
  window.history.replaceState(null, '', `${base}${target}`)
}

export default defineRouter(function (/* { store, ssrContext } */) {
  movePathIntoHash()

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  installAuthGuard(Router)
  installPageTitle(Router)

  return Router
})
