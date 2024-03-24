import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
  getFrameMessage,
} from "frames.js/next/server";
import Link from "next/link";
import { DEFAULT_DEBUGGER_HUB_URL } from "../../debug";
import axios from 'axios';

enum Page {
  Home = 'Home',
  ChooseType = 'ChooseType',
  EnterCast = 'EnterCast',
  Result = 'Result',
}


enum AllowListType {
  None = 'None',
  ByLike = 'ByLike',
  ByComment = 'ByComment',
}

type State = {
  allowListType: AllowListType;
  cast: `0x${string}`;
  allowListUrl: string;
  page: Page;
}


const initialState: State = {
  allowListType: AllowListType.None,
  cast: '0x',
  allowListUrl: '',
  page: Page.Home,
};



const reducer: FrameReducer<State> = (state, action) => {
  console.log('action');
  console.log(action);

  let page = state.page;
  let allowListType = state.allowListType;
  let cast = state.cast;

  if (
    state.page === Page.Home &&
    action.postBody?.untrustedData.buttonIndex === 1
  ) {
    page = Page.ChooseType;
  } else if (
    state.page === Page.ChooseType &&
    (
      action.postBody?.untrustedData.buttonIndex === 1 ||
      action.postBody?.untrustedData.buttonIndex === 2
    )
  ) {
    page = Page.EnterCast;
    allowListType = action.postBody?.untrustedData.buttonIndex === 1 ? AllowListType.ByLike : AllowListType.ByComment;
  } else if (
    state.page === Page.EnterCast
  ) {
    page = Page.Result;
    // Validate cast URL
  } else if (
    state.page === Page.Result
  ) {
    return initialState;
  }

  return {
    allowListType,
    cast,
    allowListUrl: state.allowListUrl,
    page,
  };
}


export default async function Home({ searchParams }: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  console.log('previous frame')
  console.log(previousFrame);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    // hubHttpUrl: "https://hub.freefarcasterhub.com:3281",
    // fetchHubContext: true,
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  if (frameMessage) {
    console.log("info: frameMessage is:", frameMessage);
  }

  return (
    <div className="p-4">
      Farcaster frame for gathering allow list, based on the cast.

      <FrameContainer
        pathname="/examples/allow-list"
        postUrl="/examples/allow-list/frames"
        state={state}
        previousFrame={previousFrame}
      >
        {
          state.page === Page.Home ? ([
            <FrameImage>
              <div>
                Hola
              </div>
            </FrameImage>,
            <FrameButton>
              Build allow list
            </FrameButton>
          ]) :
          
          state.page === Page.ChooseType ? ([
            <FrameImage>
              <div>
                Choose the type of allow list
              </div>
            </FrameImage>,
            <FrameButton>
              By likes
            </FrameButton>,
            <FrameButton>
              By comments
            </FrameButton>
          ]) :
          
          state.page === Page.EnterCast ? ([
            <FrameImage>
              <div>
                Enter the cast URL
              </div>
            </FrameImage>,
            <FrameInput text="Enter cast URL" />,
            <FrameButton>
              Submit
            </FrameButton>
          ]) :

          state.page === Page.Result ? ([
            <FrameImage>
              <div>
                Your allow list is under construction, refresh the link in 1 min
              </div>
            </FrameImage>,  
            <FrameButton action="link" target={`https://www.google.com`}>
              Open allow list
            </FrameButton>,
            <FrameButton>
              Start again
            </FrameButton>          
          ]) : <></>
        }
      </FrameContainer>
    </div>
  );
}