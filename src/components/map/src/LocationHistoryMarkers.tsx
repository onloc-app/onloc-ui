import { stringToHexColor } from "@/helpers/utils"
import type { Device, Location } from "@/types/types"
import React, { useCallback, useMemo } from "react"
import type { MapRef } from "react-map-gl/maplibre"
import type Supercluster from "supercluster"
import AccuracyMarker from "./AccuracyMarker"
import ClusterMarker from "./ClusterMarker"
import DirectionLines from "./DirectionLines"
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
  mapRef: MapRef | null
  mapAnimations: boolean
}

function LocationHistoryMarkers({
  clusters,
  clusterIndex,
  selectedDevice,
  selectedLocation,
  onLocationSelect,
  locations,
  mapRef,
  mapAnimations,
}: LocationHistoryMarkersProps) {
  const color = useMemo(
    () => selectedDevice.color ?? stringToHexColor(selectedDevice.name),
    [selectedDevice.color, selectedDevice.name],
  )

  const deviceLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          location.device_id.toString() === selectedDevice.id.toString(),
      ),
    [locations, selectedDevice.id],
  )

  const handleLocationSelect = useCallback(
    (location: Location) => {
      onLocationSelect(location)
    },
    [onLocationSelect],
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
                color={color}
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
            color={color}
            showCone={true}
            onClick={() => handleLocationSelect(location)}
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
            onClick={() => handleLocationSelect(location)}
          />
        )
      })}
    </>
  )
}

export default React.memo(LocationHistoryMarkers, (prev, next) => {
  return (
    prev.clusters === next.clusters &&
    prev.selectedDevice.latest_location?.id ===
      next.selectedDevice.latest_location?.id &&
    prev.selectedLocation?.id === next.selectedLocation?.id
  )
})
