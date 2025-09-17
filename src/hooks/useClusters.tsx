import { useMemo } from "react"
import type { Location } from "@/types/types"
import Supercluster from "supercluster"

export default function useClusters(
  locations: Location[],
  bounds: number[],
  zoom: number
) {
  const points = useMemo(() => {
    return locations.map((location) => ({
      type: "Feature" as const,
      properties: location,
      geometry: {
        type: "Point" as const,
        coordinates: [location.longitude, location.latitude],
      },
    }))
  }, [locations])

  const index = useMemo(() => {
    const supercluster = new Supercluster({ radius: 40, maxZoom: 16 })
    supercluster.load(points)
    return supercluster
  }, [points])

  const clusters = useMemo(() => {
    let verifiedBounds = [-180, -85, 180, 85] as [
      number,
      number,
      number,
      number
    ]

    if (bounds.length === 4) {
      verifiedBounds = bounds as [number, number, number, number]
    }

    return index.getClusters(verifiedBounds, Math.round(zoom))
  }, [index, bounds, zoom])

  return { clusters, index }
}
