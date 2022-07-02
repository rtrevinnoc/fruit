/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface UpdateButtonProps { }

export default function UpdateButton(props: UpdateButtonProps) {
  const updateResults = (page) => {
    console.log(window.location)
  }

  return (
    <button class={tw`flex-shrink-0 border-transparent mx-2 p-2 rounded bg-amber-300`} type="button" disabled={!IS_BROWSER} onClick={updateResults(2)}>Load More</button>
  );
}
