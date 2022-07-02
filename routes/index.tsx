/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import ResultsSection from "../islands/ResultsSection.tsx";

export default function Home() {
  return (
  <div class={tw`flex my-5 justify-center items-center w-full`}>
  <title>pear</title>
    <div class={tw`max-w-screen-md w-full mx-3`}>
      <h1 class={tw`text-2xl`}>
      <img
        src="/logo.svg"
        class={tw`h-12 inline`}
        alt="pear logo: a pear"
      />
      <span class={tw`ml-5`}>
      pear
      </span>
      </h1>
	<ResultsSection />
    </div>
</div>
  );
}
