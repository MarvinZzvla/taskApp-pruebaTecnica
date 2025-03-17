import { useState } from "react";

const toggleDrawer =
  (open: boolean, setOpenDrawer: (n: boolean) => void) =>
  (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };

export default toggleDrawer;
