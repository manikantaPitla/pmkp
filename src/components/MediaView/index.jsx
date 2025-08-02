import React from "react";
import { MediaCard, MediaOpenItem } from "./styled-component";
import { Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { formatBytes, reduceContent } from "../../services";

function MediaView({ media, isReplyMsg = false }) {
  const { name, url, type, format, size, progress } = media;

  return (
    <MediaCard className="media-card">
      <>
        {type === "image" && <ImageIcon size={30} strokeWidth={1} />}
        {type === "video" && <VideoIcon size={30} strokeWidth={1} />}
      </>
      <div className="media-details">
        <p>{reduceContent(name)}</p>
        <p>
          {formatBytes(size)} . {format}
        </p>
      </div>
      {progress ? (
        <div className="media-uploading-status">
          <p>{`${progress}%`}</p>
        </div>
      ) : (
        !isReplyMsg && (
          <a href={url} target="blank" onClick={e => e.stopPropagation()}>
            <MediaOpenItem>
              <p>Open</p>
            </MediaOpenItem>
          </a>
        )
      )}
    </MediaCard>
  );
}

export default React.memo(MediaView);
