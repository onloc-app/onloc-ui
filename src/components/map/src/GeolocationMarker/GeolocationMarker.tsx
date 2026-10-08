import { getGeolocation } from "@/helpers/locations"
import { useMantineTheme } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { circle } from "@turf/turf"
import { Layer, Marker, Source } from "react-map-gl/maplibre"
import classes from "./GeolocationMarker.module.css"

interface GeolocationMarkerProps {
  onClick?: () => void
}

export default function GeolocationMarker({ onClick }: GeolocationMarkerProps) {
  const theme = useMantineTheme()

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  const color = theme.colors.brand[3]
  const sourceId = `accuracy-circle-geolocation`
  const fillLayerId = `accuracy-circle-fill-geolocation`
  const outlineLayerId = `accuracy-circle-outline-geolocation`

  if (userGeolocation) {
    const { longitude, latitude, accuracy } = userGeolocation.coords
    return (
      <>
        <Marker longitude={longitude} latitude={latitude} onClick={onClick}>
          <div className={classes["marker"]}>
            <div className={classes["pulse"]} />
          </div>
        </Marker>
        {accuracy && (
          <>
            <Source
              id={sourceId}
              type="geojson"
              data={circle([longitude, latitude], accuracy, {
                steps: 128,
                units: "meters",
              })}
            />
            <Layer
              id={fillLayerId}
              type="fill"
              source={sourceId}
              paint={{
                "fill-color": color,
                "fill-opacity": 0.2,
              }}
            />
            <Layer
              id={outlineLayerId}
              type="line"
              source={sourceId}
              paint={{
                "line-color": color,
                "line-width": 2,
              }}
            />
          </>
        )}
      </>
    )
  }
}
