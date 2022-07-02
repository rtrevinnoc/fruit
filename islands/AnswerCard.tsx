/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import Result from "../interfaces/Result.ts"

interface Answer {
  answer: string;
  corrected: string;
  small_summary: string;
}

export default function AnswerCard(props: Answer) {
  return (
      <div class={tw`items-center border rounded-xl px-5 py-3 my-5 mx-1`}>
      <h2 class={tw`text-lg font-medium mb-1`}>{ props.corrected }</h2>
      <p class={tw`text-sm`}>{ props.small_summary }</p>
      </div>
  );
}
