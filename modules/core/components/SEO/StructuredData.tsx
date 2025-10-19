type Props = {
  data: Record<string, unknown>
}

export const StructuredData = ({ data }: Props) => {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
