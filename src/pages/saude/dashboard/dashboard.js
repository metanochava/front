import {
  registerDashboards,
  registerDashboardDialog,
} from "quasar_resaas"

import VitalSignsDialog from "../components/VitalSignsDialog.vue"
import PatientListDialog from "../components/PatientListDialog.vue"

// dialogs opened by the backend dashboards' "dialog" actions (saude/dashboard.py)
registerDashboardDialog("saude.record_vital_signs", VitalSignsDialog)
registerDashboardDialog("saude.patient_list", PatientListDialog)


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

