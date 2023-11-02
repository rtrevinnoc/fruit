import { Handlers, PageProps } from "$fresh/server.ts";
import Result from "../interfaces/Result.ts"
import Answer from "../interfaces/Answer.ts"
import Data from "../interfaces/Data.ts"

export const handler: Handlers<Data | null> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const currentPage = parseInt(url.searchParams.get("page")) || 1;

    if (query != "") {

      const response = await fetch(Deno.env.get("PEAR_LIST"))
      if (!response.ok) {
        return ctx.render(null);
      }
      const peers = await response.json()
        .then(json => json.peers)

      const result_promises = peers.map(peer => fetch(`${peer.address}/_results?${new URLSearchParams({ query, page: currentPage })}`).catch(_ => null));
      result_promises.map((promise) => {
        const timeout = new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, parseInt(Deno.env.get("PEAR_TIMEOUT")));
        });

        const timeout_promise = Promise.race([promise, timeout]).catch(
          _ => {
            return;
          }
        );

        return timeout_promise;
      });

      const json_result_promises = await Promise.all(result_promises)
        .then(responses => responses.filter(response => (response !== null && response.ok)))
        .then(responses => responses.map(response => response.json()))
      const results: Result[] = await Promise.all(json_result_promises).then(responses => responses.map(response => response.urls).flat().sort((a, b) => b.score - a.score).slice(0, 5))

      const data = await Promise.any(peers.map(peer => fetch(`${peer.address}/_summary?${new URLSearchParams({ query })}`).then((response) =>
        response.json().then((data) => {
          if (!response.ok) {
            throw Error(data.err || 'HTTP error');
          }
          return data;
        }),
      )));

      const answer: string = data.small_summary ?? "";
      const corrected: string = data.corrected ?? query;
      const summary: string = data.small_summary ?? "";
      const nextPage: number = currentPage + 1;
      return ctx.render({ query, answer, corrected, summary, results, nextPage });
    } else {
      return ctx.render({ query, answer: null, corrected: null, summary: null, results: [], nextPage: 1 });
    }
  },
};

export function SearchBar(props: { text: string }) {
  return (
    <form class="my-6 w-full">
      <div class="flex items-center border rounded-xl p-2 dark:(border-gray-600)">
        <input autoFocus autoComplete="off" class="appearance-none bg-transparent border-none w-full dark:(text-gray-200) ml-2 p-2 leading-tight focus:outline-none" type="text" id="query" name="query" placeholder="Surf the web..." required value={props.text} />
        <button class="flex-shrink-0 border-transparent mx-2 p-2 rounded" type="submit">Search</button>
      </div>
    </form>
  );
}

export function AnswerCard(props: Answer) {
  return (
    <div class="items-center border rounded-xl px-5 py-3 my-5 mx-1 dark:(border-gray-600)">
      <h2 class="text-lg font-medium mb-1">{props.corrected}</h2>
      <p class="text-sm">{props.summary}</p>
    </div>
  );
}

export function ResultCard(props: Result) {
  return (
    <div class="items-center border rounded-xl px-5 py-3 my-5 mx-1 dark:(border-gray-600)">
      <a href={props.url}>
        <div class="mb-3">
          <h2 class="text-lg font-medium">{props.header}</h2>
          <h6 class="text-xs font-mono font-thin break-all">{props.url}</h6>
        </div>
        <p class="text-sm line-clamp-3">{props.body}</p>
      </a>
    </div>
  );
}

export function UpdateButton(props: { currentQuery: string; nextPage: number }) {
  return (
    <form class="w-full text-center">
      <input class="hidden" type="input" name="query" required value={props.currentQuery} />
      <input class="hidden" type="number" name="page" required value={props.nextPage} />
      <button class="border-transparent mx-2 p-2 rounded" type="submit"> Load More</button >
    </form>
  );
}

export default function Home({ data }: PageProps<Data | null>) {
  let answerCard, updateButton;

  if (!data) {
    return <h1>Internal error</h1>;
  }

  const { query, answer, corrected, summary, results, nextPage } = data;

  if (summary != null) {
    answerCard = <AnswerCard answer={answer} corrected={corrected} summary={summary} />
  }

  if (results.length > 0) {
    updateButton = <UpdateButton currentQuery={corrected} nextPage={nextPage} />
  }

  return (
    <div class="flex py-5 justify-center items-center w-full min-h-screen dark:(bg-gray-800 text-gray-300)" >
      <title>pear</title>
      <div class="max-w-screen-md w-full mx-3">
        <h1 class="text-2xl">
          <a href="/">
            <img
              src="/logo.svg"
              class="h-12 inline"
              alt="pear logo: a pear"
            />
            <span class="ml-5">
              pear
            </span>
          </a>
        </h1>
        <SearchBar text={corrected} />
        <div>
          {answerCard}
        </div>
        <div>
          {results.map((result) => {
            return <ResultCard header={result.header} url={result.url} body={result.description} />
          })}
        </div>
        <div>
          {updateButton}
        </div>
      </div>
    </div >
  );
}
