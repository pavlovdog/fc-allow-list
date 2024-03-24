/* eslint-disable react/jsx-key */
import axios from "axios";
import { createFrames, Button } from "frames.js/next";
import { S3 } from '@aws-sdk/client-s3';
import { AllowList, AllowListRecord } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { Layout } from "../../components/EnterCast";


const frames = createFrames({
  basePath: "/",
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

const allowList = new AllowList();

const createAllowList = async (
  castHash: string,
  castFid: number,
  type: string,
) => {
  const records = await allowList.fetch(castHash, castFid, type);
}


const s3 = new S3({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
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
    return Layout({
      allowListType: String(ctx.searchParams.allowListType),
      invalidCastUrl: true
    });
  }

  const id = uuidv4();

  const key = `public/allow-lists/${id}.json`;

  allowList.fetch(
    cast.hash,
    cast.author.fid,
    String(ctx.searchParams.allowListType)
  ).then(async (records: AllowListRecord[]) => {
    console.log(`found ${records.length} records`);

    // Upload list to S3
    const uploadResult = await s3.putObject({
      Bucket: process.env.S3_BUCKET,
      Body: JSON.stringify(records),
      Key: key,
      ContentType: 'application/json',
      ACL: 'public-read',
    });

    console.log('upload result', uploadResult);
  });

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
        target={`https://snaphost.nyc3.cdn.digitaloceanspaces.com/${key}`}
      >
        Download allow list
      </Button>,
  ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
