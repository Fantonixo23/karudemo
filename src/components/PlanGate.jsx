import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PlanModal from './PlanModal'

export default function PlanGate() {
  const [show, setShow] = useState(false)
  const location = useLocation()
  const enApp = location.pathname.startsWith('/app')

  useEffect(() => {
    if (!enApp) return
    const chosen = localStorage.getItem('karuapp_plan_chosen')
    if (chosen !== 'true') setShow(true)
  }, [enApp])

  if (!enApp || !show) return null

  return (
    <PlanModal onClose={() => {
      localStorage.setItem('karuapp_plan_chosen', 'true')
      setShow(false)
    }} />
  )
}
