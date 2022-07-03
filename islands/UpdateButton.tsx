/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { PageProps } from "$fresh/server.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface UpdateButtonProps {
  currentPage: number;
}

export default function UpdateButton(props: UpdateButtonProps) {
  const updateResults = () => {
    let currentParams = new URLSearchParams(window.location.search);
    currentParams.set("page", props.currentPage + 1);
    window.location.search = currentParams;
  }

  return (
    <button class={tw`border-transparent mx-2 p-2 rounded`} type="button" disabled={!IS_BROWSER} onClick={updateResults}> Load More</button >
  );
}
