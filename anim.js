// Illustrations run slowly; hovering (or focusing) a card speeds its animations up smoothly.
(function () {
  if (!("getAnimations" in document)) return;
  var FAST = 3.5;
  document.querySelectorAll(".cell").forEach(function (card) {
    if (!card.querySelector(".ill")) return;
    function rate(r) {
      card.getAnimations({ subtree: true }).forEach(function (a) {
        if (a.updatePlaybackRate) a.updatePlaybackRate(r); else a.playbackRate = r;
      });
    }
    card.addEventListener("pointerenter", function () { rate(FAST); });
    card.addEventListener("pointerleave", function () { rate(1); });
    card.addEventListener("focusin", function () { rate(FAST); });
    card.addEventListener("focusout", function () { rate(1); });
  });
})();
