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
  popStashEntry,
  toggleAdjacentTabSelection
} from "./util/actions";
import { PORT_NAME_DEFAULT } from "./util/constants";
import usePort from "./hooks/chrome/usePort";
import useSwitch from "./hooks/useSwitch";
import useDocumentKeydown from "./hooks/useDocumentKeydown";
import copyLinkAddress from "./usecases/content/copyLinkAddress";

function Content() {
  const port = usePort(PORT_NAME_DEFAULT);
  const [stashModalIsOpen, openStashModal, closeStashModal] = useSwitch();
  useDocumentKeydown(({ code, shiftKey, ctrlKey, altKey, metaKey }) => {
    console.debug(code)
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
    else if (
      (code == "BracketRight" || code == "BracketLeft") &&
      ctrlKey &&
      metaKey
    ) port.postMessage(toggleAdjacentTabSelection(code == "BracketRight" ? 1 : -1))
    else if (code == "KeyP" && ctrlKey && altKey && metaKey) openStashModal();
    else if (code == "KeyC" && ctrlKey && metaKey) copyLinkAddress();
  });
  return (
    <StashModal
      isOpen={stashModalIsOpen}
      onRequestClose={closeStashModal}
      onRequestRestore={stashKey => {
        if (port != null) port.postMessage(popStashEntry(stashKey));
      }}
    />
  );
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
