import React from "react";
import { Menu } from "semantic-ui-react";

export default function Header() {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Menu.Item name="CrowdCoin" />
      <Menu.Menu position="right">
        <Menu.Item name="Campaigns" />
        <Menu.Item>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
