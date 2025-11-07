chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToClipboard",
    title: "Copy to clipboard",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "saveToClipboard" && info.selectionText) {
    chrome.storage.local.get(["clipboard"], (res) => {
      let clips = res.clipboard || []
      clips.unshift({ text: info.selectionText })
      chrome.storage.local.set({ clipboard: clips })
    })
  }
})

// chrome.commands.onCommand.addListener((command) => {
//   if (command === "save-selection") {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         func: () => window.getSelection().toString()
//       }, (results) => {
//         if (!results || !results[0] || !results[0].result) return;
//         const selectedText = results[0].result;
//         if (selectedText) {
//           chrome.storage.local.get(["clipboard"], (result) => {
//             let clips = result.clipboard || [];
//             clips.unshift({ text: selectedText, timestamp: Date.now() });
//             clips = clips.slice(0, 20);
//             chrome.storage.local.set({ clipboard: clips });
//           });
//         }
//       });
//     });
//   }
// })


chrome.commands.onCommand.addListener((command) => {
  if (command === "save-selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const selectedText = window.getSelection().toString();
          if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
              chrome.runtime.sendMessage({ action: "saveClip", text: selectedText });
            }).catch((err) => {
              console.error("Erreur de copie : ", err);
            });
          }
        }
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveClip" && message.text) {
    chrome.storage.local.get(["clipboard"], (result) => {
      let clips = result.clipboard || [];
      clips.unshift({ text: message.text });
      chrome.storage.local.set({ clipboard: clips });
    });
  }
});