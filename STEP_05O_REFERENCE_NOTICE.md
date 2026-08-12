# STEP 05O Reference Notice

Reference:
- Text scroll and hover effect with GSAP and clip
- Juxtopposed
- Original CodePen: https://codepen.io/Juxtopposed/pen/mdQaNbG
- License: MIT

What STEP 05O uses:
- The reference hover layer starts as:
  clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%)
- On hover the reference expands that layer to the full row.

WinningFund adaptation:
- That hover clip behavior is now a one-time entrance animation.
- No 투자 / 경제 / 학회 secondary hover text is rendered.
- INVESTMENT / ECONOMICS / CLUB stay the only large row labels.
- A pale band expands from each row's horizontal center, briefly reveals dark English text, then dissolves to the permanent white English final state.
- Rows are staggered.
- No GSAP / ScrollTrigger dependency is added.
- Reduced motion skips the entrance and immediately shows the final state.
