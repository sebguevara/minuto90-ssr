export interface StatusConfig {
  type: 'live' | 'finished' | 'scheduled' | 'other'
  label: string
  className: string
}

export function getStatusConfig(status: string): StatusConfig {
  if (status === 'FT' || status === 'AET' || status === 'PEN') {
    return { type: 'finished', label: 'Finalizado', className: 'text-muted-foreground' }
  }
  if (status === 'HT') {
    return { type: 'live', label: 'Descanso', className: 'text-orange-500' }
  }
  if (status === 'NS' || status.includes(':')) {
    return { type: 'scheduled', label: 'Programado', className: 'text-muted-foreground' }
  }
  if (['CAN', 'PST', 'ABD', 'AWD', 'WO'].includes(status)) {
    return { type: 'other', label: 'Pospuesto', className: 'text-yellow-500' }
  }
  if (!isNaN(parseInt(status))) {
    return { type: 'live', label: 'En vivo', className: 'text-destructive' }
  }
  return { type: 'other', label: status, className: 'text-muted-foreground' }
}
