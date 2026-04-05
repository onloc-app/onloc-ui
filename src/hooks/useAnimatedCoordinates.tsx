import { useEffect, useRef, useState } from "react"

interface Coordinates {
  longitude: number
  latitude: number
}

export default function useAnimatedCoordinates(
  longitude: number,
  latitude: number,
  animate: boolean,
  duration = 2000,
): Coordinates {
  const prev = useRef<Coordinates | null>(null)

  const [animated, setAnimated] = useState<Coordinates>({
    longitude,
    latitude,
  })

  useEffect(() => {
    if (!animate) {
      setAnimated({ longitude, latitude })
      prev.current = { longitude, latitude }
      return
    }

    const start = prev.current ?? { longitude, latitude }
    const end = { longitude, latitude }

    const startTime = performance.now()

    function frame(now: number) {
      const t = Math.min((now - startTime) / duration, 1)

      const lng = start.longitude + (end.longitude - start.longitude) * t
      const lat = start.latitude + (end.latitude - start.latitude) * t

      setAnimated({ longitude: lng, latitude: lat })

      if (t < 1) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)

    prev.current = end
  }, [longitude, latitude, animate, duration])

  return animated
}
