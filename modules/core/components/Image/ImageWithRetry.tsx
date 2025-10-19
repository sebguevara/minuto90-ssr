'use client'

import Image, { type ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface ImageWithRetryProps extends ImageProps {
  retryOnError?: boolean
  maxRetries?: number
  retryDelay?: number
  fallbackSrc?: string
}

const placeholderImage = '/default.png'
export const ImageWithRetry = (props: ImageWithRetryProps) => {
  const {
    src,
    retryOnError = true,
    maxRetries = 3,
    retryDelay = 1000,
    fallbackSrc = placeholderImage,
    onError,
    ...rest
  } = props

  const [currentSrc, setCurrentSrc] = useState(src ?? fallbackSrc)
  const [retryCount, setRetryCount] = useState(0)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setCurrentSrc(src ?? fallbackSrc)
    setRetryCount(0)
    setHasError(false)
  }, [src, fallbackSrc])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (retryOnError && retryCount < maxRetries) {
      setTimeout(() => {
        const newSrc = `${src?.toString().split('?')[0]}?retry=${new Date().getTime()}`
        setCurrentSrc(newSrc)
        setRetryCount((prev) => prev + 1)
      }, retryDelay * (retryCount + 1))
    } else {
      setHasError(true)
      if (onError) {
        onError(e)
      }
    }
  }

  if (typeof src === 'string' && src.startsWith('/flags/')) {
    return <Image {...rest} src={src} onError={handleError} />
  }
  return <Image {...rest} src={hasError ? fallbackSrc : currentSrc} onError={handleError} />
}
