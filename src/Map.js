import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";

function Map() {
  const auth = useAuth();

  return (
    <>
      <MainAppBar selectedNav="map" />
    </>
  );
}

export default Map;
