import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";

const Products = () => {
  return <Outlet />;
};

export default observer(Products);
