/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

const frames = createFrames({
  basePath: "/examples/new-api-allow-list",
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);

  const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

  return {
    image: (
      <div tw="flex flex-col">
        <p>hola, welcome to allow list builder</p>
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
        Build allow list
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
