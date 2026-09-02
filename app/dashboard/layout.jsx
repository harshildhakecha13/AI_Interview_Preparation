"use client";
import React, { createContext, useState } from "react";
import Header from "./_components/Header";
import logo from "../../public/logo.svg";

export const WebCamContext = createContext();

const DashboardLayout = ({ children }) => {
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  return (
    <div>
      <Header logo={logo} />
      <div className="mx-5 md:mx-20 lg:mx-36">
        <WebCamContext.Provider value={{ webCamEnabled, setWebCamEnabled }}>
          {children}
        </WebCamContext.Provider>
      </div>
    </div>
  );
};

export default DashboardLayout;
