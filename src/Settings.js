import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";

function Settings() {
  const auth = useAuth();

  return (
    <>
      <MainAppBar selectedNav="settings" />
    </>
  );
}

export default Settings;
