import React from 'react';
import { Button } from "frames.js/next";


export const Layout = ({
  allowListType,
  invalidCastUrl
}: {
  allowListType: string;
  invalidCastUrl: boolean;
}) => {
  return (
    <div>
      <div tw="flex flex-col">
        {invalidCastUrl && <p>Invalid cast url</p>}
        <p>Enter cast URL</p>
      </div>
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
      </Button>
      <p>Enter cast URL</p>
    </div>
  );
};
