import {
  registerDashboards,
} from "quasar_resaas"


export const DASHBOARDS = [
  {
    module: "saude",
    name: "teste-saude",
    label: "Teste Saúde",
    icon: "medical_services",
    permission: ['list_entityo', 'list_entity'],
    order: 1,

    component: () =>
      import("./DashBoard.vue")
  }
]

registerDashboards(
  DASHBOARDS
)

