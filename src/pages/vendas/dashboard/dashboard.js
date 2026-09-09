import {
  registerDashboards,
} from "quasar_resaas"


export const DASHBOARDS = [
  {
    module: "farmacia",
    name: "farmacia-saude",
    label: "farmacia Saúde",
    icon: "medical_services",
    permission: ['list_paciente', 'list_entity'],
    order: 1,

    component: () =>
      import("./DashBoard.vue")
  }
]




registerDashboards(
  DASHBOARDS
)

