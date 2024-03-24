/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div tw="flex flex-col">
        <p>Hola, welcome to allow list builder</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: {},
          pathname: '2-choose-type'
        }}
      >
        Create an allowlist
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
