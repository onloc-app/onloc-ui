import type { Device, Location, User } from "@/types/types"
import { Box } from "@mantine/core"
import type { MapRef } from "react-map-gl/maplibre"
import type Supercluster from "supercluster"
import GroupClusterMarker from "./GroupClusterMarker"
import InfoMarker from "./InfoMarker"
import { stringToHexColor } from "@/helpers/utils"
import AccuracyMarker from "./AccuracyMarker"

interface DeviceMarkersProps {
  clusters: (
    | Supercluster.ClusterFeature<Supercluster.AnyProps>
    | Supercluster.PointFeature<Supercluster.AnyProps>
  )[]
  clusterIndex: Supercluster<Supercluster.AnyProps, Supercluster.AnyProps>
  devices: Device[]
  sharedDevices: Device[]
  sharedUsers: User[]
  showAvatars: boolean
  mapRef: MapRef | null
  mapAnimations: boolean
  onDeviceSelect: (device: Device) => void
}

export default function DeviceMarkers({
  clusters,
  clusterIndex,
  devices,
  sharedDevices,
  sharedUsers,
  showAvatars,
  mapRef,
  mapAnimations,
  onDeviceSelect,
}: DeviceMarkersProps) {
  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates

        if (cluster.properties.cluster) {
          if (!cluster.id) return

          const leaves = clusterIndex.getLeaves(cluster.id as number, Infinity)
          const clusterDevices = leaves
            .map((leaf) => {
              const locations = leaf.properties as Location
              return [...devices, ...sharedDevices].find(
                (d) => d.id === locations.device_id,
              )
            })
            .filter(Boolean) as Device[]

          return (
            <Box key={cluster.id}>
              <GroupClusterMarker
                id={cluster.id}
                devices={clusterDevices}
                sharedDevices={sharedDevices}
                sharedUsers={sharedUsers}
                showAvatars={showAvatars}
                longitude={longitude}
                latitude={latitude}
                onDeviceClick={onDeviceSelect}
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
              <InfoMarker
                devices={clusterDevices}
                location={{
                  id: -1n,
                  device_id: -1n,
                  latitude: latitude,
                  longitude: longitude,
                }}
              />
            </Box>
          )
        }

        const location = cluster.properties as Location
        const device = [...devices, ...sharedDevices].find(
          (d) => d.id === location.device_id,
        )
        if (!device) return

        const isShared = sharedDevices.some((d) => d.id === device.id)
        const user = isShared
          ? sharedUsers.find((u) => u?.id === device?.user_id)
          : null
        const color = device?.color ?? stringToHexColor(device.name)

        return (
          <Box key={device.id}>
            <AccuracyMarker
              id={device.id}
              location={location}
              color={color}
              shape={isShared ? "triangle" : "circle"}
              avatar={isShared && showAvatars ? user?.avatar : null}
              showCone={true}
              onClick={() => onDeviceSelect(device)}
            />
            <InfoMarker devices={[device]} location={location} />
          </Box>
        )
      })}
    </>
  )
}
