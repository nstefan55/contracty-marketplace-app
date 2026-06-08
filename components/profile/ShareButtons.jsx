"use client";
import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  XShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

export default function ShareButtons({ contractorId }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
      <h3 className="text-base font-bold text-slate-800 mb-3">Share Profile</h3>
      <div className="flex gap-2 flex-wrap">
        <FacebookShareButton url={url}>
          <FacebookIcon size={40} round quote={contractorId.name} />
        </FacebookShareButton>
        <XShareButton url={url}>
          <XIcon size={40} round />
        </XShareButton>
        <WhatsappShareButton url={url}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
        <EmailShareButton
          url={url}
          subject="Check out this contractor on Contracty"
        >
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>
    </div>
  );
}
