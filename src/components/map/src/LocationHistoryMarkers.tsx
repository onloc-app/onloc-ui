import { isAllowedHour, stringToHexColor } from "@/helpers/utils"
import type { Device, Location } from "@/types/types"
import type { MapRef } from "react-map-gl/maplibre"
import type Supercluster from "supercluster"
import DirectionLines from "./DirectionLines"
import ClusterMarker from "./ClusterMarker"
import AccuracyMarker from "./AccuracyMarker"
import PastLocationMarker from "./PastLocationMarker"

interface LocationHistoryMarkersProps {
  clusters: (
    | Supercluster.ClusterFeature<Supercluster.AnyProps>
    | Supercluster.PointFeature<Supercluster.AnyProps>
  )[]
  clusterIndex: Supercluster<Supercluster.AnyProps, Supercluster.AnyProps>
  selectedDevice: Device
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
  locations: Location[]
  restrictedHours: [number, number] | null
  mapRef: MapRef | null
  mapAnimations: boolean
}

export default function LocationHistoryMarkers({
  clusters,
  clusterIndex,
  selectedDevice,
  selectedLocation,
  onLocationSelect,
  locations,
  restrictedHours,
  mapRef,
  mapAnimations,
}: LocationHistoryMarkersProps) {
  const deviceLocations = locations
    .filter((location) => location.device_id === selectedDevice.id)
    .filter(
      (location) =>
        location.created_at &&
        isAllowedHour(location.created_at, restrictedHours),
    )

  return (
    <>
      {/* Draw the lines */}
      {selectedDevice.id && (
        <DirectionLines
          key={selectedDevice.id}
          id={selectedDevice.id}
          locations={deviceLocations}
          color={selectedDevice.color ?? stringToHexColor(selectedDevice.name)}
        />
      )}

      {/* Draw the markers */}
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates

        if (cluster.properties.cluster) {
          const count = cluster.properties.point_count

          if (cluster.id) {
            return (
              <ClusterMarker
                key={cluster.id}
                id={cluster.id}
                longitude={longitude}
                latitude={latitude}
                count={count}
                color={
                  selectedDevice.color ?? stringToHexColor(selectedDevice.name)
                }
                onClick={() => {
                  if (typeof cluster.id === "number") {
                    const expansionZoom = clusterIndex.getClusterExpansionZoom(
                      cluster.id,
                    )
                    mapRef?.flyTo({
                      center: [longitude, latitude],
                      zoom: expansionZoom,
                      bearing: 0,
                      pitch: 0,
                      animate: mapAnimations,
                    })
                  }
                }}
              />
            )
          }
        }

        const location = cluster.properties as Location

        return selectedDevice.latest_location?.id === location.id ? (
          <AccuracyMarker
            key={location.id}
            id={location.id}
            location={location}
            color={
              selectedDevice.color ?? stringToHexColor(selectedDevice.name)
            }
            showCone={true}
            onClick={() => onLocationSelect(location)}
          />
        ) : (
          <PastLocationMarker
            key={location.id}
            id={location.id}
            location={location}
            showAccuracy={selectedLocation?.id === location.id}
            color={
              selectedDevice.color ?? stringToHexColor(selectedDevice.name)
            }
            onClick={() => onLocationSelect(location)}
          />
        )
      })}
    </>
  )
}
