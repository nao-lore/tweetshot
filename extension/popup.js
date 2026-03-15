const TWEETSHOT_APP_URL = "https://tweetshot.vercel.app";

const TWEET_URL_PATTERN = /^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/;

const statusEl = document.getElementById("status");
const urlInput = document.getElementById("urlInput");
const openBtn = document.getElementById("openBtn");

let detectedUrl = "";

function isTweetUrl(url) {
  return TWEET_URL_PATTERN.test(url);
}

function getActiveUrl() {
  return urlInput.value.trim() || detectedUrl;
}

function updateButtonState() {
  const url = getActiveUrl();
  openBtn.disabled = !isTweetUrl(url);
}

function openTweetShot() {
  const url = getActiveUrl();
  if (!isTweetUrl(url)) return;
  const appUrl = `${TWEETSHOT_APP_URL}?url=${encodeURIComponent(url)}`;
  chrome.tabs.create({ url: appUrl });
  window.close();
}

// Detect current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab && tab.url && isTweetUrl(tab.url)) {
    detectedUrl = tab.url;
    statusEl.className = "status detected";
    statusEl.innerHTML = `ツイートを検出しました<div class="tweet-url">${detectedUrl}</div>`;
    urlInput.value = detectedUrl;
    updateButtonState();
  }
});

urlInput.addEventListener("input", updateButtonState);

openBtn.addEventListener("click", openTweetShot);

// Enter key on input
urlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !openBtn.disabled) {
    openTweetShot();
  }
});
