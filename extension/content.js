const TWEETSHOT_APP_URL = "https://tweetshot.vercel.app";

const PROCESSED_ATTR = "data-tweetshot-added";

function extractTweetUrl(actionBar) {
  const article = actionBar.closest("article");
  if (!article) return null;

  // Try: <time> element's parent <a> which contains /status/
  const timeEl = article.querySelector("time");
  if (timeEl) {
    const link = timeEl.closest("a");
    if (link && link.href && link.href.includes("/status/")) {
      return link.href;
    }
  }

  // Fallback: any <a> with /status/ in href
  const links = article.querySelectorAll('a[href*="/status/"]');
  for (const link of links) {
    if (/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/.test(link.href)) {
      return link.href;
    }
  }

  return null;
}

function createTweetShotButton() {
  const container = document.createElement("div");
  container.setAttribute("role", "button");
  container.setAttribute("tabindex", "0");
  container.setAttribute("aria-label", "TweetShot");
  container.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34.75px;
    height: 34.75px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
  `;

  const inner = document.createElement("div");
  inner.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 15px;
    line-height: 1;
    color: rgb(113, 118, 123);
    transition: color 0.2s;
  `;
  inner.textContent = "\uD83D\uDCF8";

  container.appendChild(inner);

  // Hover effects matching Twitter style
  container.addEventListener("mouseenter", () => {
    container.style.backgroundColor = "rgba(102, 126, 234, 0.1)";
    inner.style.color = "#667eea";
  });

  container.addEventListener("mouseleave", () => {
    container.style.backgroundColor = "transparent";
    inner.style.color = "rgb(113, 118, 123)";
  });

  return container;
}

function addButtonToActionBar(actionBar) {
  if (actionBar.hasAttribute(PROCESSED_ATTR)) return;
  actionBar.setAttribute(PROCESSED_ATTR, "true");

  const tweetUrl = extractTweetUrl(actionBar);
  if (!tweetUrl) return;

  const btn = createTweetShotButton();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = extractTweetUrl(actionBar) || tweetUrl;
    const appUrl = `${TWEETSHOT_APP_URL}?url=${encodeURIComponent(url)}`;
    window.open(appUrl, "_blank");
  });

  // Wrap in a container similar to Twitter's action button wrappers
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    flex-shrink: 0;
  `;
  wrapper.appendChild(btn);

  actionBar.appendChild(wrapper);
}

function processExistingTweets() {
  const actionBars = document.querySelectorAll('article [role="group"]:last-of-type');
  actionBars.forEach((bar) => {
    // Only target the bottom action bar (reply, retweet, like, share, etc.)
    if (bar.children.length >= 4) {
      addButtonToActionBar(bar);
    }
  });
}

// Initial scan
processExistingTweets();

// Observe DOM changes for dynamically loaded tweets
const observer = new MutationObserver((mutations) => {
  let shouldProcess = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldProcess = true;
      break;
    }
  }
  if (shouldProcess) {
    processExistingTweets();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
