import React from "react";
import { createPortal } from "react-dom";

import { Grid, GridProps } from "../grids/Grid.view";

export default function Modal(props: Omit<GridProps, "isWithBackground">) {
  return createPortal(
    <Grid
      {...props}
      isWithBackground={true}
    />,

    document.querySelector(`[js-data="portal-root"]`)!
  );
}
