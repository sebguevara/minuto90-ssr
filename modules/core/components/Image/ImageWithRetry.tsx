'use client'

import Image, { type ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface ImageWithRetryProps extends ImageProps {
  fallbackSrc?: string
}

const placeholderImage = '/default.png'

export const ImageWithRetry = (props: ImageWithRetryProps) => {
  const { src, fallbackSrc = placeholderImage, onError, ...rest } = props

  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onError) {
      onError(e)
    }
    setHasError(true)
  }

  const finalSrc = hasError || !src ? fallbackSrc : src

  return <Image {...rest} src={finalSrc} onError={handleError} />
}