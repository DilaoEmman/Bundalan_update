import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";

const Orders = () => {
  return <Outlet />;
};

export default observer(Orders);
