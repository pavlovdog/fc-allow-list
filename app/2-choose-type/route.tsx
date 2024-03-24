/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div tw="flex flex-col">
        <p>Choose allow list type</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: {
            allowListType: "byLike",
          },
          pathname: '3-enter-cast'
        }}
      >
        By likes
      </Button>,
      <Button
      action="post"
      target={{
        query: {
          allowListType: "byComment",
        },
        pathname: '3-enter-cast'
      }}
    >
      By comments
    </Button>,
  ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
