import React from "react";
import {FacebookShareButton, RedditShareButton, TwitterShareButton, TwitterIcon, FacebookIcon, RedditIcon} from "react-share";


const SocialShare = ({ url, title }) => {
    return (
        <span>
        <TwitterShareButton url={url} title={title + " #dalle"}>
          <TwitterIcon size={24} round />
        </TwitterShareButton>
        &nbsp;
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={24} round />
        </FacebookShareButton>
        &nbsp;
        <RedditShareButton url={url} title={title}>
          <RedditIcon size={24} round />
        </RedditShareButton>
        </span>
    );

}

export default SocialShare;
