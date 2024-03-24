/* eslint-disable react/jsx-key */
import axios from "axios";
import { createFrames, Button } from "frames.js/next";
import { layout } from "../3-enter-cast/route";
import Knex from 'knex';

const frames = createFrames({
  basePath: "/examples/new-api-allow-list",
});


type Cast = {
  hash: string;
  author: {
    fid: number;
  }
}

const getCast = async function(
  type: 'url' | 'hash',
  identifier: string
): Promise<Cast | null> {
  try {
    const {
      data: {
        cast
      }
    } = await axios.get(
      'https://api.neynar.com/v2/farcaster/cast',
      {
        params: {
          type,
          identifier,
        },
        headers: {
          api_key: process.env.NEYNAR_TOKEN,
        },
      },
    );
  
    return cast;   
  } catch (error) {
    return null;
  }
}

const knex = Knex({
  client: 'pg',
  connection: {
    charset: 'utf8',
    timezone: 'UTC',
    user: process.env.REPLICATOR_DB_USER,
    password: process.env.REPLICATOR_DB_PASSWORD,
    host: process.env.REPLICATOR_DB_HOST,
    port: Number(process.env.REPLICATOR_DB_PORT),
    database: process.env.REPLICATOR_DB_DATABASE,
  }
});

// @ts-ignore
const handleRequest = frames(async (ctx) => {
  // Validate cast URL
  // - Cast url is invalid
  // @ts-ignore
  const castURL = ctx.message.inputText;
  console.log('cast url', castURL);
  console.log('Neynar token', process.env.NEYNAR_TOKEN);
  const cast = await getCast('url', castURL);
  console.log('cast');
  console.log(cast);

  if (cast === null) {
    return layout(String(ctx.searchParams.allowListType), true);
  }

  return {
    image: (
      <div tw="flex flex-col">
        <p>Your allow list is under construction</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: {},
          pathname: '1-start'
        }}
      >
        Start again
      </Button>,
      <Button
        action="link"
        target={"https://google.com"}
      >
        Download allow list
      </Button>,
  ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
