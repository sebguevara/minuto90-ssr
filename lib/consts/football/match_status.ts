import { GoalServeFixturesResponse } from '@/modules/football/domain/types/fixtureResponse'

export interface StatusConfig {
  label: string
  type: string
  className: string
  code: string
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  NS: {
    label: 'PROGRAMADO',
    type: 'scheduled',
    code: 'NS',
    className: 'status-scheduled',
  },
  TBD: {
    label: 'POR DEFINIR',
    type: 'scheduled',
    code: 'TBD',
    className: 'status-scheduled',
  },
  '1H': {
    label: 'EN VIVO',
    type: 'live',
    code: '1H',
    className: 'status-live',
  },
  HT: {
    label: 'DESCANSO',
    type: 'live',
    code: 'HT',
    className: 'status-half-time',
  },
  '2H': {
    label: 'EN VIVO',
    type: 'live',
    code: '2H',
    className: 'status-live',
  },
  ET: {
    label: 'TIEMPO EXTRA',
    type: 'live',
    code: 'ET',
    className: 'status-live',
  },
  BT: {
    label: 'DESCANSO',
    type: 'live',
    code: 'BT',
    className: 'status-half-time',
  },
  P: {
    label: 'PENALES',
    type: 'live',
    code: 'P',
    className: 'status-penalties',
  },
  SUSP: {
    label: 'SUSPENDIDO',
    type: 'live',
    code: 'SUSP',
    className: 'status-suspended',
  },
  INT: {
    label: 'INTERRUMPIDO',
    type: 'live',
    code: 'INT',
    className: 'status-interrupted',
  },
  LIVE: {
    label: 'EN VIVO',
    type: 'live',
    code: 'LIVE',
    className: 'status-live',
  },

  FT: {
    label: 'FINALIZADO',
    type: 'finished',
    code: 'FT',
    className: 'status-finished',
  },
  AET: {
    label: 'EXTRATIEMPO',
    type: 'finished',
    code: 'AET',
    className: 'status-finished',
  },
  PEN: {
    label: 'POR PENALES',
    type: 'finished',
    code: 'PEN',
    className: 'status-penalties',
  },

  PST: {
    label: 'POSTERGADO',
    type: 'postponed',
    code: 'PST',
    className: 'status-postponed',
  },
  CANC: {
    label: 'CANCELADO',
    type: 'cancelled',
    code: 'CANC',
    className: 'status-cancelled',
  },
  ABD: {
    label: 'ABANDONADO',
    type: 'abandoned',
    code: 'ABD',
    className: 'status-abandoned',
  },
  AWD: {
    label: 'PÉRDIDA TÉCNICA',
    type: 'technical-loss',
    code: 'AWD',
    className: 'status-technical-loss',
  },
  WO: {
    label: 'WALKOVER',
    type: 'walkover',
    code: 'WO',
    className: 'status-walkover',
  },
}

const specialStatusMap: Record<string, string> = {
  'Susp.': 'SUSP',
}

/**
 * Processes the match data to add the status configuration.
 * @param apiData - The raw data from the API.
 * @returns The processed data with the statusConfig property in each match.
 */
export const processMatchData = (apiData: GoalServeFixturesResponse): GoalServeFixturesResponse => {
  if (!apiData?.scores?.category) {
    return apiData
  }

  apiData.scores.category.forEach((category: any) => {
    if (!category?.matches?.match) {
      return
    }

    const matches = Array.isArray(category.matches.match)
      ? category.matches.match
      : [category.matches.match]

    matches.forEach((match: any) => {
      const statusString: string = match['@status']
      const timerString: string = match['@timer']
      let configKey: string | undefined

      if (specialStatusMap[statusString]) {
        configKey = specialStatusMap[statusString]
      } else if (STATUS_CONFIG[statusString]) {
        configKey = statusString
      } else if (/^\d{2}:\d{2}$/.test(statusString)) {
        configKey = 'NS'
      } else if (!isNaN(Number(statusString))) {
        configKey = 'LIVE'
      }

      match.statusConfig = STATUS_CONFIG[configKey || 'TBD']
    })
  })

  return apiData
}
