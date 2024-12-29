import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userInfo, login, logout } from "../api";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserInfo() {
      if (token && !user) {
        const data = await userInfo(token);
        if (data.id) {
          setUser(data);
        }
        if (data.error) {
          logoutAction();
        }
      }
    }
    fetchUserInfo();
  }, [token]);

  async function loginAction(credentials) {
    const data = await login(credentials.username, credentials.password);

    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    }

    return data;
  }

  function logoutAction() {
    logout(token);
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
