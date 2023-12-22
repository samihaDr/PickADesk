import React, { useContext } from "react";
import { GlobalContext } from "./services/GlobalState";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";

const Layout = ({ children }) => {
  const { userConnected } = useContext(GlobalContext);

  return (
    <>
      {userConnected && <Navbar />}
      {userConnected && <Menu />}
      {children}
    </>
  );
};

export default Layout;
