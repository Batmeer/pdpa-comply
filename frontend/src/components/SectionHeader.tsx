import s from './SectionHeader.module.css'

interface Props {
  title: string
  subtext?: string
}

export function SectionHeader({ title, subtext }: Props) {
  return (
    <div className={s.wrap}>
      <h2 className={s.title}>{title}</h2>
      {subtext && <p className={s.sub}>{subtext}</p>}
    </div>
  )
}
