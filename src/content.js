/*global chrome*/

import React from "react";
import ReactDOM from "react-dom";
import StashModal from "./components/StashModal";
import { StashEntrySourceProvider } from "./di/providers";
import "./css/content.css";
import {
  detachTab,
  moveTab,
  duplicate,
  navigateUnpinned,
  stash,
  popStashEntry
} from "./util/actions";
import { PORT_NAME_DEFAULT } from "./util/constants";
import usePort from "./hooks/chrome/usePort";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";

function Content() {
  const port = usePort(PORT_NAME_DEFAULT);
  const [stashModalIsOpen, openStashModal, closeStashModal] = useSwitch();
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
    else if (code == "KeyS" && ctrlKey && altKey && metaKey)
      port.postMessage(stash());
    else if (code == "KeyP" && ctrlKey && altKey && metaKey) openStashModal();
    else if (code == "KeyC" && ctrlKey && metaKey) copyLinkAddress()
  });
  return (
    <StashModal
      isOpen={stashModalIsOpen}
      onRequestClose={closeStashModal}
      onRequestRestore={(stashKey) => {
        if (port != null)
          port.postMessage(popStashEntry(stashKey));
      }}
    />
  );
}

function copyLinkAddress() {
  function getSelectedLinkAddress() {
    const fragmentChildren = window.getSelection()
      .getRangeAt(0)
      .cloneContents()
      .children
    for (var i = -1; ++i < fragmentChildren.length;) {
      const child = fragmentChildren[i]
      if (child.tagName === "A" && child.href) {
        return child.href
      }
    }
    return null
  }
  const link = getSelectedLinkAddress()
  if (link === null) return
  navigator.clipboard.writeText(link)
    .then(
      () => console.debug(`Successfully copied '${link}!'`),
      () => console.debug(`Failed to copy '${link}'`)
    )
}

const app = document.createElement("div");
app.id = "winager-extension-root";
document.body.appendChild(app);
ReactDOM.render(
  <StashEntrySourceProvider>
    <Content />
  </StashEntrySourceProvider>,
  app
);
