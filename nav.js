// Cross-page section links (e.g. about -> home#contact): load the page at the top,
// then glide down to the section instead of jumping straight to it.
(function () {
  var KEY = "scroll-to";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Leaving a page: mark where we want to land, then go to the page without the hash.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href*='#']");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
    var url;
    try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
    var samePage = url.pathname === location.pathname;
    if (samePage || url.origin !== location.origin || !url.hash) return;
    try { sessionStorage.setItem(KEY, url.hash.slice(1)); } catch (err) { return; }
    e.preventDefault();
    location.href = url.pathname + url.search;
  });

  // 2) Arriving: if a section was requested, start at the top and scroll to it smoothly.
  var id = null;
  try { id = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (err) {}
  if (!id) return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  window.addEventListener("load", function () {
    var el = document.getElementById(id);
    if (!el) return;
    window.scrollTo(0, 0);
    var go = function () {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      try { history.replaceState(null, "", "#" + id); } catch (err) {}
    };
    // Let the page-to-page fade finish before the scroll starts.
    setTimeout(go, reduce ? 0 : 320);
  });
})();
