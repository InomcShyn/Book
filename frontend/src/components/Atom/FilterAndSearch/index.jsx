import { Drawer } from "antd";
import React from "react";

function FilterAndSearch({ children, open, setOpen, props }) {
  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title='Filter & Search'
      {...props}
    >
      {children}
    </Drawer>
  );
}

export default FilterAndSearch;
