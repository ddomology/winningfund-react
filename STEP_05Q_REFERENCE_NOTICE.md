# STEP 05Q Reference Notice

Typing reference:
- CSS Typing Effect
- Marko / denic
- Original CodePen: https://codepen.io/denic/pen/GRoOxbM
- License: MIT

Reference behavior:
- fixed text width
- `steps(...)` typing animation
- right-side blinking caret
- monospace font

WinningFund adaptation:
- keeps the discrete `steps(19, end)` typing rhythm and caret idea
- does NOT use monospace
- does NOT animate layout width
- reveals the proportional Korean text with stepped background-clip
- moves a 2px caret across the actual rendered sentence width
- caret disappears after a short post-typing blink
- reduced-motion shows the final Korean sentence immediately

Additional STEP 05Q visual corrections:
- INVESTMENT / ECONOMICS / CLUB ghost and reveal layers share one text-slot
- CLUB right alignment is owned by that shared slot only
- a 64–88px desktop bridge gutter softens section rail -> hero transition
- the current section rail tick extends into that gutter and fades out
