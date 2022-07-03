/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { Handlers, PageProps } from "$fresh/server.ts";
import UpdateButton from "../islands/UpdateButton.tsx";
import Result from "../interfaces/Result.ts"
import Answer from "../interfaces/Answer.ts"
import Data from "../interfaces/Data.ts"
import { lineClamp } from '@twind/line-clamp'

export const handler: Handlers<Data | null> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const page = parseInt(url.searchParams.get("page")) || 1;

    if (query != "") {
      const resp = await fetch(Deno.env.get("MASTER") + '/_answer?' + new URLSearchParams({ query, page }))
        .then(response => response.json())
        .then(data => data.result);
      if (resp.status === 404) {
        return ctx.render(null);
      }

      const answer: string = resp.answer;
      const corrected: string = resp.corrected;
      const summary: string = resp.small_summary;
      const results: Result[] = resp.urls;
      return ctx.render({ query, answer, corrected, summary, results, page });
    } else {
      return ctx.render({ query, answer: null, corrected: null, summary: null, results: [], page });
    }
  },
};

export function SearchBar(props: { text: string }) {
  return (
    <form class={tw`my-6 w-full`}>
      <div class={tw`flex items-center border rounded-xl p-2 dark:(border-gray-600)`}>
        <input autoFocus autoComplete="off" class={tw`appearance-none bg-transparent border-none w-full dark:(text-gray-200) ml-2 p-2 leading-tight focus:outline-none`} type="text" id="query" name="query" placeholder="Surf the web..." required value={ props.text } />
        <button class={tw`flex-shrink-0 border-transparent mx-2 p-2 rounded`} type="submit">Search</button>
      </div>
    </form>
  );
}

export function AnswerCard(props: Answer) {
  return (
    <div class={tw`items-center border rounded-xl px-5 py-3 my-5 mx-1 dark:(border-gray-600)`}>
      <h2 class={tw`text-lg font-medium mb-1`}>{props.corrected}</h2>
      <p class={tw`text-sm`}>{props.summary}</p>
    </div>
  );
}

export function ResultCard(props: Result) {
  return (
    <div class={tw`items-center border rounded-xl px-5 py-3 my-5 mx-1 dark:(border-gray-600)`}>
      <a href={props.url}>
        <div class={tw`mb-3`}>
          <h2 class={tw`text-lg font-medium`}>{props.header}</h2>
          <h6 class={tw`text-xs font-mono font-thin break-all`}>{props.url}</h6>
        </div>
        <p class={tw`text-sm ${lineClamp(3)}`}>{props.body}</p>
      </a>
    </div>
  );
}

export default function Home({ data }: PageProps<Data | null>) {
  let answerCard, updateButton;

  if (!data) {
    return <h1>Internal error</h1>;
  }

  const { query, answer, corrected, summary, results } = data;

  if (summary != null) {
    answerCard = <AnswerCard answer={answer} corrected={corrected} summary={summary} />
  }

  if (results.length > 0) {
    updateButton = <UpdateButton currentPage={data.page} />
  }

  return (
    <div class={tw`flex py-5 justify-center items-center w-full min-h-screen dark:(bg-gray-800 text-gray-300)`} >
      <title>pear</title>
      <div class={tw`max-w-screen-md w-full mx-3`}>
        <h1 class={tw`text-2xl`}>
          <a href="/">
            <img
              src="/logo.svg"
              class={tw`h-12 inline`}
              alt="pear logo: a pear"
            />
            <span class={tw`ml-5`}>
              pear
            </span>
          </a>
        </h1>
        <SearchBar text={query}/>
        <div>
          {answerCard}
        </div>
        <div>
          {results.map((result) => {
            return <ResultCard header={result.header} url={result.url} body={result.body} />
          })}
        </div>
        <div class={tw`w-full text-center`}>
          {updateButton}
        </div>
      </div>
    </div >
  );
}
