import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./css/content.css";
import {
  detachTab,
  moveTab,
  duplicate,
  navigateUnpinned,
  stash
} from "./util/actions";
import { PORT_NAME_DEFAULT } from "./util/constants";
import usePort from "./hooks/chrome/usePort";
import useDocumentKeydown from "./hooks/useDocumentKeydown";

function Content() {
  const port = usePort(PORT_NAME_DEFAULT);
  useDocumentKeydown(({ code, shiftKey, ctrlKey, altKey, metaKey }) => {
    if (port === null) return;
    if (code == "ArrowDown" && shiftKey && ctrlKey) {
      port.postMessage(detachTab());
    } else if (
      (code == "BracketRight" || code == "BracketLeft") &&
      ctrlKey &&
      altKey &&
      metaKey
    ) {
      port.postMessage(moveTab(code == "BracketRight" ? 1 : -1));
    } else if (code == "KeyD" && altKey) port.postMessage(duplicate());
    else if (code.startsWith("Digit") && ctrlKey && altKey && metaKey)
      port.postMessage(navigateUnpinned(parseInt(code[5]) - 1));
    else if (code == "KeyS" && ctrlKey && altKey && metaKey) {
      port.postMessage(stash());
    }
  });
  return <StashListModal />;
}

function StashListModal() {
  return <StashList />;
}

function StashList() {
  return (
    <div
      className={"flexbox flexbox-direction-column padding-horizontal-larger"}
    >
      <StashDate />
      <StashEntries />
      <StashEntries />
      <StashDate />
      <StashEntries />
    </div>
  );
}

function StashDate() {
  return (
    <div className={"flexbox flexbox-justify-center"}>
      <div
        className={
          "shade-087 font-size-huge font-weight-bold line-height-huge padding-top-extra-larger"
        }
      >
        Today - Friday, July 24
      </div>
    </div>
  );
}

function StashEntries() {
  return (
    <div className={"padding-top-smaller padding-bottom-medium"}>
      <StashCaption />
      <StashEntry />
      <StashEntry />
      <RestoreButton />
    </div>
  );
}

function StashCaption() {
  return (
    <div className={"padding-vertical-medium"}>
      <div class="shade-087 font-size-larger font-weight-bold line-height-medium">
        10:00 PM
      </div>
      <div class="shade-056 font-size-small font-weight-medium line-height-medium">
        3 items
      </div>
    </div>
  );
}

function StashEntry() {
  return (
    <div class="shade-087 font-size-medium font-weight-medium padding-vertical-smaller line-height-medium">
      <div
        class="pointer overflow-hidden white-space-nowrap text-ellipsis"
        title="Git - git-stash Documentation - https://git-scm.com/docs/git-stash"
      >
        Git - git-stash Documentation
      </div>
    </div>
  );
}

function RestoreButton() {
  return (
    <div class="inline-block padding-top-larger padding-bottom-medium">
      <div class="pointer underline font-size-medium font-weight-bold line-height-medium winager-primary">
        Restore all 3 items
      </div>
    </div>
  );
}

const app = document.createElement("div");
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Content />, app);
