import React from 'react'

export default function StashEntry({ title, url }) {
  return (
    <div class="flexbox shade-087 font-size-medium font-weight-medium padding-vertical-tiny line-height-medium">
      <div class="inline-block pointer overflow-ellipsis" title={`${title} - ${url}`}>
        {title}
      </div>
    </div>
  );
}
