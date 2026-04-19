import { pedacoRoutes } from './pedaco/pedacoRoutes'
import { paiRoutes } from './pai/paiRoutes'


export let stockRoutes = [
  ...paiRoutes,
  ...pedacoRoutes,
]
