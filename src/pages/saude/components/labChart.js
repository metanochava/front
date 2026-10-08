// Chart of a lab parameter's time series (lab phase 12), shared by the
// doctor's evolution (LabEvolutionDialog) and the patient's trends
// (MyHealthPage). Built ONLY from the backend's structured points
// (lab_evolution / portal trends): never from text, PDFs or attachments.
//
// The reference shown is the latest point's (the snapshot recorded with
// that result): a neutral band between low and high, or a dashed line when
// only one limit is configured. No reference configured -> no band; nothing
// is invented here.
import { tdc } from 'quasar_resaas'

const BAND = '#9e9e9e'

export function labChartData (evolution, formatDate) {
  return {
    labels: evolution.points.map((p) => formatDate(p.date)),
    series: [{ name: evolution.parameter.name, data: evolution.points.map((p) => Number(p.value)) }]
  }
}

export function labChartOptions (evolution) {
  const last = evolution.points[evolution.points.length - 1]
  const ref = last?.reference || {}
  const low = ref.low != null ? Number(ref.low) : null
  const high = ref.high != null ? Number(ref.high) : null
  const label = { text: tdc('Reference range'), borderWidth: 0, style: { background: 'transparent' } }

  const yaxis = []
  if (low != null && high != null) {
    yaxis.push({ y: low, y2: high, fillColor: BAND, opacity: 0.12, borderColor: 'transparent', label })
  } else if (low != null || high != null) {
    yaxis.push({ y: low ?? high, borderColor: BAND, strokeDashArray: 4, label })
  }

  const unit = evolution.parameter.unit
  return {
    annotations: { yaxis },
    yaxis: unit ? { title: { text: unit } } : {}
  }
}
