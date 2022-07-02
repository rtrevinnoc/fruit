/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface SearchBarProps {
  text: string;
}

export default function SearchBar(props: SearchBarProps) {
  const [text, setText] = useState(props.text);

  return (
    <form class={tw`my-6 w-full`}>
      <div class={tw`flex items-center border rounded-xl p-2`}>
        <input autoFocus class={tw`appearance-none bg-transparent border-none w-full text-gray-700 ml-2 p-2 leading-tight focus:outline-none`} type="text" id="query" name="query" placeholder="Surf the web..." required value={text} onChange={(e) => setText(e.target.value)} />
        <button class={tw`flex-shrink-0 border-transparent mx-2 p-2 rounded bg-amber-300`} type="submit" disabled={!IS_BROWSER}>Search</button>
      </div>
    </form>
  );
}
