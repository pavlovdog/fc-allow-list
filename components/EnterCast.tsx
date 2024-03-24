import React from 'react';
import { Button } from "frames.js/next";


export const Layout = ({
  allowListType,
  invalidCastUrl
}: {
  allowListType: string;
  invalidCastUrl: boolean;
}) => {
  return {
    image: (
      <div tw="flex flex-col">
        {
          invalidCastUrl && (
            <p>Invalid cast url</p>
          )
        }
        <p>Paste the cast url here</p>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        key={0}
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
    textInput: 'Cast URL'
  };
};
