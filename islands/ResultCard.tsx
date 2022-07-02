/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { lineClamp } from '@twind/line-clamp'
import Result from "../interfaces/Result.ts"

export default function ResultCard(props: Result) {
  return (
      <div class={tw`items-center border rounded-xl px-5 py-3 my-5 mx-1`}>
      <a href={ props.url }>
      <div class={tw`mb-3`}>
      <h2 class={tw`text-lg font-medium`}>{ props.header }</h2>
      <h6 class={tw`text-xs font-mono font-thin break-all`}>{ props.url }</h6>
      </div>
      <p class={tw`text-sm ${lineClamp(3)}`}>{ props.body }</p>
      </a>
      </div>
  );
}
