export const TeamFormation = ({
  name,
  formation,
  flip = false,
}: {
  name: string
  formation: string
  flip?: boolean
}) => {
  const first = flip ? formation : name
  const second = flip ? name : formation

  return (
    <div className="flex items-center gap-2">
      <span className={flip ? 'opacity-70' : ''}>{first}</span>
      <span className={!flip ? 'opacity-70' : ''}>{second}</span>
    </div>
  )
}
