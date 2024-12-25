import "./App.css";
import { useAuth } from "./contexts/AuthProvider";
import { Button } from "@mui/material";

function App() {
  const auth = useAuth();

  if (!auth.user) {
    return <p>Loading...</p>
  }

  if (auth.user) {
    return (
      <div className="App">
        <p>{auth.user.username}</p>
        <Button
          variant="outlined"
          onClick={auth.logoutAction}
        >
          Logout
        </Button>
      </div>
    );
  } else {
    return <p>No user logged in</p>;
  }

}

export default App;
