export const translatePos = (p: string) =>
  p === 'G'
    ? 'Arquero'
    : p === 'D'
    ? 'Defensor'
    : p === 'M'
    ? 'Mediocampista'
    : p === 'F'
    ? 'Delantero'
    : p
