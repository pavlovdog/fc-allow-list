/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { Layout } from "../../components/EnterCast";

const frames = createFrames({
  basePath: "/",
});


// @ts-ignore
const handleRequest = frames(async (ctx) => {
  const { allowListType } = ctx.searchParams;

  return Layout({
    allowListType: allowListType || "byLike",
    invalidCastUrl: false,
  });
});

export const GET = handleRequest;
export const POST = handleRequest;
