import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";

function Devices() {
  const auth = useAuth();

  return (
    <>
      <MainAppBar selectedNav="devices" />
    </>
  );
}

export default Devices;
