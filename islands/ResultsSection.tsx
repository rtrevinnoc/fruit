/** @jsx h */
import { h } from "preact";
import { useState, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import SearchBar from "../islands/SearchBar.tsx";
import ResultCard from "../islands/ResultCard.tsx";
import AnswerCard from "../islands/AnswerCard.tsx";
import Result from "../interfaces/Result.ts"

interface ResultsSectionProps {
  answer: AnswerCard[];
  results: ResultCard[];
}

export default function ResultsSection(props: ResultsSectionProps) {
  const [answer, setAnswer] = useState(props.answer);
  const [results, setResults] = useState(props.results);

  const onSubmit = async (e) => {
	e.preventDefault();
	const data = new FormData(e.target);
  	let query = data.get("searchbar")

	const results = await fetch('https://wearebuildingthefuture.com/_answer?' + new URLSearchParams({ query: query, page: 1 }))
		.then(response => response.json())
		.then(data => data.result)

	setAnswer(
		<AnswerCard answer={ results.answer } corrected={ results.corrected } small_summary={ results.small_summary }/>
	)

	setResults(results.urls.map((url) => {
		return <ResultCard header={ url.header } url={ url.url } body={ url.body } />
	}))
  };

  return (
  <div>
      <form class={tw`my-6 w-full`} onSubmit={ onSubmit } >
      <SearchBar />
      </form>
      <div>
      { answer }
      { results }
      </div> 
</div>
  );
}
