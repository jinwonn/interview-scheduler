import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import "index.scss";

import Button from "components/Button";
import Appointment from "components/Appointment/index.js";
import Header from "components/Appointment/Header.js"
import Empty from "components/Appointment/Empty.js"
import Show from "components/Appointment/Show.js"

storiesOf("Button", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  })
  .add("Base", () => <Button>Base</Button>)
  .add("Confirm", () => <Button confirm>Confirm</Button>)
  .add("Danger", () => <Button danger>Cancel</Button>)
  .add("Clickable", () => (
    <Button onClick={action("button-clicked")}>Clickable</Button>
  ))
  .add("Disabled", () => (
    <Button disabled onClick={action("button-clicked")}>
      Disabled
    </Button>
  ));

  storiesOf("Appointment", module)
    .addParameters({
      backgrounds: [{ name: "white", value: "#fff", default: true}]
    })
    .add("Appointment", () => <Appointment/>)
    .add("Appointment with Time", () => <Appointment time="12pm" />)
    .add("Header", () => <Header time="12pm"/>)
    .add("Empty", () => <Empty onAdd={action("onAdd")}/>)
    .add("Show", () => <Show />)