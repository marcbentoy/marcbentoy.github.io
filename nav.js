// Flash a section once the scroll to it settles, so it is easy to spot
// (the contact section sits at the very bottom, where the page barely moves).
window.flashSection = function (el) {
  if (!el) return;
  var done = false;
  var fire = function () {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", onEnd);
    el.classList.remove("flash");
    void el.offsetWidth; // restart the animation on repeat clicks
    el.classList.add("flash");
  };
  // scrollend fires when a smooth scroll finishes. As a backup (browsers without
  // it, or a page already scrolled as far as it goes), fire once the scroll
  // position has stayed put for a moment, giving up after a few seconds.
  var inView = function () { return el.getBoundingClientRect().top < window.innerHeight * 0.8; };
  var onEnd = function () { if (inView()) fire(); };
  window.addEventListener("scrollend", onEnd);
  var lastY = window.scrollY, still = 0, start = Date.now();
  var timer = setInterval(function () {
    if (done) return clearInterval(timer);
    if (window.scrollY === lastY) still++; else { still = 0; lastY = window.scrollY; }
    if ((still >= 4 && inView()) || Date.now() - start > 4000) { clearInterval(timer); fire(); }
  }, 50);
};
document.addEventListener("animationend", function (e) {
  if (e.target.classList && e.target.classList.contains("flash") && e.animationName === "section-flash") e.target.classList.remove("flash");
});

// Same-page section links: let the browser scroll, then flash the target.
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a[href^='#']");
  if (!a || a.getAttribute("href").length < 2) return;
  window.flashSection(document.getElementById(a.getAttribute("href").slice(1)));
});

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
      window.flashSection(el);
    };
    // Let the page-to-page fade finish before the scroll starts.
    setTimeout(go, reduce ? 0 : 320);
  });
})();
