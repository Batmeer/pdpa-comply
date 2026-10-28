import { ClusterBar } from './ClusterBar'
import s from './ClusterGrid.module.css'

interface Props { clusterScores: Record<string, number> }

export function ClusterGrid({ clusterScores }: Props) {
  const entries = Object.entries(clusterScores).sort((a, b) => a[1] - b[1])
  return (
    <div className={s.grid}>
      {entries.map(([cluster, score]) => (
        <ClusterBar key={cluster} cluster={cluster} score={score} />
      ))}
    </div>
  )
}
