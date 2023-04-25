import classNames from "classnames";

import React, { ReactElement } from "react";

import { Grid, GridProps } from "../grids/Grid.view";

export default function AppGrid(
  props: Omit<GridProps, "isWithBackground" | "isWithSplash" | "onClose">
) {
  return (
    <Grid
      {...props}
      isWithBackground={false}
      isWithSplash={false}
    />
  );
}
