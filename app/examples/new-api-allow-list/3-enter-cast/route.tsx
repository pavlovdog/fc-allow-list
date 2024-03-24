/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/examples/new-api-allow-list",
});

export const layout = (allowListType: string, invalidCastUrl: boolean) => {
  return {
    image: (
      <div tw="flex flex-col">
        {
          invalidCastUrl && (
            <p>Invalid cast url</p>
          )
        }
        <p>Enter cast URL</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: {
            allowListType,
          },
          pathname: '4-submit'
        }}
      >
        Submit
      </Button>,
    ],
    textInput: 'Enter cast URL'
  }
};


// @ts-ignore
const handleRequest = frames(async (ctx) => {
  const { allowListType } = ctx.searchParams;

  return layout(String(allowListType), false);
});

export const GET = handleRequest;
export const POST = handleRequest;
