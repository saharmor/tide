import React from "react";
import {FacebookShareButton, RedditShareButton, TwitterShareButton, TwitterIcon, FacebookIcon, RedditIcon} from "react-share";

import { trackEvent } from "./utils"

const SocialShare = ({ url, title,sessionId }) => {
    return (
        <span>
        <TwitterShareButton url={url} title={title + " #dalle"} beforeOnClick={(() => trackEvent('social', 'share_twitter', sessionId))}>
          <TwitterIcon size={24} round />
        </TwitterShareButton>
        &nbsp;
        <FacebookShareButton url={url} quote={title} beforeOnClick={(() => trackEvent('social', 'share_facebook', sessionId))}>
          <FacebookIcon size={24} round />
        </FacebookShareButton>
        &nbsp;
        <RedditShareButton url={url} title={title} beforeOnClick={(() => trackEvent('social', 'share_reddit', sessionId))}>
          <RedditIcon size={24} round />
        </RedditShareButton>
        </span>
    );

}

export default SocialShare;
