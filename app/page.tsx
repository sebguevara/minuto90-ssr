import { StructuredData } from '@/modules/core/components/SEO/StructuredData'
import { fixtureService } from '@/modules/football/application/services/fixtureService'
import { FixturesView } from '@/modules/football/presentation/views/FixturesView'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.minuto90.co'

  return {
    title: 'Minuto 90 | Resultados en Vivo',
    description: 'Sigue los partidos de fútbol en tiempo real con Minuto90',
    openGraph: {
      title: 'Minuto 90 | Resultados en Vivo',
      description: 'Resultados de fútbol en tiempo real',
      url: baseUrl,
      images: [baseUrl + '/logo/90.svg'],
    },
  }
}

export default async function Home() {
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        url: 'https://www.minuto90.co',
        name: 'Minuto 90',
        description: 'Resultados y estadísticas de fútbol en tiempo real.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.minuto90.co/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SportsOrganization',
        name: 'Minuto 90',
        url: 'https://www.minuto90.co',
        logo: 'https://www.minuto90.co/logo/90.svg',
      },
    ],
  }

  const initialFixtures = await fixtureService.getAndMergeFixtures(['home', 'd1'])
  return (
    <>
      <StructuredData data={siteSchema} />
      <FixturesView initialFixtures={initialFixtures} dateParam='home' />
    </>
  )
}