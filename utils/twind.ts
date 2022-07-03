import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
import * as colors from 'twind/colors'
export * from "twind";
export const config: Configuration = {
  mode: "silent",
  theme: {
    extend: {
      colors,
    },
  },
};
if (IS_BROWSER) setup(config);
