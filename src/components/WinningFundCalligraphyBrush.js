import { createElement, useEffect, useRef } from 'react'

const MODEL_WIDTH = 420
const MODEL_HEIGHT = 140
const DPR_LIMIT = 2
const SAMPLE_SPACING = 1.3

/*
 * STEP 05ZC — calligraphy V2
 *
 * Design contract:
 * - the trajectory curves only through descent / valley / turn
 * - after the turn, the trajectory transitions to a fixed rising angle
 * - pressure, width, wet core and bristle spread are independent channels
 * - the final rise loses pressure but does NOT visually die
 * - a text-protection mask attenuates the brush behind the Korean slogan
 */

const STROKE_A = Object.freeze({
  id: 'A',
  curveAnchors: Object.freeze([
    [30, 66],
    [43, 82],
    [58, 99],
    [82, 110],
    [105, 109],
    [124, 102],
    [140, 91],
  ]),
  riseAngleDeg: -35,
  transitionLength: 36,
  riseLength: 94,
  baseWidth: 31,
  bristleCount: 46,
  seed: 182,
  colors: Object.freeze([
    [0.00, [174, 238, 255]],
    [0.48, [105, 204, 245]],
    [0.78, [38, 157, 235]],
    [1.00, [0, 121, 250]],
  ]),
})

const STROKE_B = Object.freeze({
  id: 'B',
  curveAnchors: Object.freeze([
    [174, 70],
    [191, 90],
    [213, 105],
    [239, 112],
    [260, 109],
    [278, 101],
  ]),
  riseAngleDeg: -38,
  transitionLength: 38,
  riseLength: 132,
  baseWidth: 37,
  bristleCount: 54,
  seed: 417,
  colors: Object.freeze([
    [0.00, [105, 204, 245]],
    [0.38, [38, 157, 235]],
    [0.70, [0, 121, 250]],
    [1.00, [16, 52, 220]],
  ]),
})

const WIDTH_A = Object.freeze([
  [0.00, 0.18],
  [0.10, 0.30],
  [0.28, 0.44],
  [0.46, 0.56],
  [0.58, 0.82],
  [0.70, 0.68],
  [0.82, 0.44],
  [0.92, 0.20],
  [1.00, 0.06],
])

const WIDTH_B = Object.freeze([
  [0.00, 0.15],
  [0.10, 0.30],
  [0.28, 0.48],
  [0.45, 0.60],
  [0.57, 0.94],
  [0.69, 0.76],
  [0.80, 0.52],
  [0.90, 0.28],
  [0.96, 0.13],
  [1.00, 0.05],
])

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value))
}

function clamp01(value) {
  return clamp(value, 0, 1)
}

function lerp(start, end, progress) {
  return start + ((end - start) * progress)
}

function smoothstep(value) {
  const t = clamp01(value)
  return t * t * (3 - (2 * t))
}

function normalize(value, start, end) {
  return clamp01(
    (value - start)
    / Math.max(0.0001, end - start),
  )
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function angleDelta(from, to) {
  let delta = (to - from + Math.PI) % (Math.PI * 2) - Math.PI

  if (delta < -Math.PI) {
    delta += Math.PI * 2
  }

  return delta
}

function angleLerp(from, to, progress) {
  return from + (angleDelta(from, to) * clamp01(progress))
}

function sampleKeyframes(keyframes, t) {
  const progress = clamp01(t)

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const [startAt, startValue] = keyframes[index]
    const [endAt, endValue] = keyframes[index + 1]

    if (progress <= endAt) {
      const local =
        (progress - startAt)
        / Math.max(0.0001, endAt - startAt)

      return lerp(
        startValue,
        endValue,
        smoothstep(local),
      )
    }
  }

  return keyframes[keyframes.length - 1][1]
}

function createSeededRandom(seed) {
  let state = seed >>> 0

  return () => {
    state = (
      Math.imul(state, 1664525)
      + 1013904223
    ) >>> 0

    return state / 4294967296
  }
}

function catmullRomPoint(point0, point1, point2, point3, t) {
  const t2 = t * t
  const t3 = t2 * t

  return [
    0.5 * (
      (2 * point1[0])
      + (-point0[0] + point2[0]) * t
      + (
        2 * point0[0]
        - 5 * point1[0]
        + 4 * point2[0]
        - point3[0]
      ) * t2
      + (
        -point0[0]
        + 3 * point1[0]
        - 3 * point2[0]
        + point3[0]
      ) * t3
    ),
    0.5 * (
      (2 * point1[1])
      + (-point0[1] + point2[1]) * t
      + (
        2 * point0[1]
        - 5 * point1[1]
        + 4 * point2[1]
        - point3[1]
      ) * t2
      + (
        -point0[1]
        + 3 * point1[1]
        - 3 * point2[1]
        + point3[1]
      ) * t3
    ),
  ]
}

function sampleCatmullRom(anchorPoints, samplesPerSegment = 22) {
  const points = []

  for (let index = 0; index < anchorPoints.length - 1; index += 1) {
    const point0 = anchorPoints[Math.max(0, index - 1)]
    const point1 = anchorPoints[index]
    const point2 = anchorPoints[index + 1]
    const point3 =
      anchorPoints[Math.min(anchorPoints.length - 1, index + 2)]

    for (
      let sampleIndex = 0;
      sampleIndex < samplesPerSegment;
      sampleIndex += 1
    ) {
      points.push(
        catmullRomPoint(
          point0,
          point1,
          point2,
          point3,
          sampleIndex / samplesPerSegment,
        ),
      )
    }
  }

  points.push(anchorPoints[anchorPoints.length - 1])
  return points
}

function distance(pointA, pointB) {
  return Math.hypot(
    pointB[0] - pointA[0],
    pointB[1] - pointA[1],
  )
}

function resampleByDistance(points, spacing = SAMPLE_SPACING) {
  if (points.length < 2) {
    return points
  }

  const output = [points[0]]
  let segmentStart = points[0]
  let carried = 0

  for (let index = 1; index < points.length; index += 1) {
    const segmentEnd = points[index]
    let segmentLength = distance(segmentStart, segmentEnd)

    if (segmentLength <= 0.0001) {
      segmentStart = segmentEnd
      continue
    }

    while ((carried + segmentLength) >= spacing) {
      const remaining = spacing - carried
      const ratio = remaining / segmentLength

      const nextPoint = [
        lerp(segmentStart[0], segmentEnd[0], ratio),
        lerp(segmentStart[1], segmentEnd[1], ratio),
      ]

      output.push(nextPoint)
      segmentStart = nextPoint
      segmentLength = distance(segmentStart, segmentEnd)
      carried = 0
    }

    carried += segmentLength
    segmentStart = segmentEnd
  }

  const lastPoint = points[points.length - 1]

  if (distance(output[output.length - 1], lastPoint) > 0.1) {
    output.push(lastPoint)
  }

  return output
}

function tangentAngle(points) {
  if (points.length < 2) {
    return 0
  }

  const previous = points[points.length - 2]
  const current = points[points.length - 1]

  return Math.atan2(
    current[1] - previous[1],
    current[0] - previous[0],
  )
}

function createAngleTransition(
  startPoint,
  startAngle,
  targetAngle,
  length,
  spacing = SAMPLE_SPACING,
) {
  const points = []
  let current = [...startPoint]
  const steps = Math.max(2, Math.ceil(length / spacing))

  for (let index = 1; index <= steps; index += 1) {
    const progress = smoothstep(index / steps)
    const angle = angleLerp(
      startAngle,
      targetAngle,
      progress,
    )

    current = [
      current[0] + (Math.cos(angle) * spacing),
      current[1] + (Math.sin(angle) * spacing),
    ]

    points.push(current)
  }

  return points
}

function createConstantRise(
  startPoint,
  angle,
  length,
  spacing = SAMPLE_SPACING,
) {
  const points = []
  const directionX = Math.cos(angle)
  const directionY = Math.sin(angle)
  const steps = Math.max(2, Math.ceil(length / spacing))

  for (let index = 1; index <= steps; index += 1) {
    points.push([
      startPoint[0] + (directionX * spacing * index),
      startPoint[1] + (directionY * spacing * index),
    ])
  }

  return points
}

function buildStrokeTrajectory(config) {
  const curved = resampleByDistance(
    sampleCatmullRom(config.curveAnchors),
  )

  const targetAngle =
    degreesToRadians(config.riseAngleDeg)

  const transition = createAngleTransition(
    curved[curved.length - 1],
    tangentAngle(curved),
    targetAngle,
    config.transitionLength,
  )

  const transitionEnd =
    transition[transition.length - 1]

  const constantRise = createConstantRise(
    transitionEnd,
    targetAngle,
    config.riseLength,
  )

  const centerline = [
    ...curved,
    ...transition,
    ...constantRise,
  ]

  return {
    centerline,
    constantRiseStartIndex:
      curved.length + transition.length,
    targetAngle,
  }
}

function pressureA(t) {
  if (t < 0.20) {
    return lerp(0.20, 0.54, t / 0.20)
  }

  if (t < 0.45) {
    return lerp(0.54, 0.72, (t - 0.20) / 0.25)
  }

  if (t < 0.58) {
    return lerp(0.72, 0.96, (t - 0.45) / 0.13)
  }

  if (t < 0.72) {
    return lerp(0.96, 0.66, (t - 0.58) / 0.14)
  }

  if (t < 0.86) {
    return lerp(0.66, 0.38, (t - 0.72) / 0.14)
  }

  return lerp(0.38, 0.08, (t - 0.86) / 0.14)
}

function pressureB(t) {
  if (t < 0.20) {
    return lerp(0.18, 0.58, t / 0.20)
  }

  if (t < 0.45) {
    return lerp(0.58, 0.76, (t - 0.20) / 0.25)
  }

  if (t < 0.57) {
    return lerp(0.76, 1.00, (t - 0.45) / 0.12)
  }

  if (t < 0.72) {
    return lerp(1.00, 0.74, (t - 0.57) / 0.15)
  }

  if (t < 0.86) {
    return lerp(0.74, 0.42, (t - 0.72) / 0.14)
  }

  return lerp(0.42, 0.07, (t - 0.86) / 0.14)
}

function velocityProfile(t) {
  if (t < 0.10) return 0.32
  if (t < 0.42) return 0.50
  if (t < 0.58) return 0.25
  if (t < 0.72) {
    return lerp(0.40, 0.70, (t - 0.58) / 0.14)
  }

  return lerp(0.70, 1.00, (t - 0.72) / 0.28)
}

function spreadEnvelope(t) {
  if (t < 0.20) return lerp(0.70, 0.78, t / 0.20)
  if (t < 0.48) return lerp(0.78, 0.84, (t - 0.20) / 0.28)
  if (t < 0.63) return lerp(0.84, 0.96, (t - 0.48) / 0.15)
  if (t < 0.78) return lerp(0.96, 0.78, (t - 0.63) / 0.15)
  if (t < 0.90) return lerp(0.78, 0.62, (t - 0.78) / 0.12)

  return lerp(0.62, 0.30, (t - 0.90) / 0.10)
}

function wetCoreRatio(t) {
  if (t < 0.15) return lerp(0.22, 0.26, t / 0.15)
  if (t < 0.50) return lerp(0.26, 0.31, (t - 0.15) / 0.35)
  if (t < 0.68) return lerp(0.31, 0.36, (t - 0.50) / 0.18)
  if (t < 0.84) return lerp(0.36, 0.26, (t - 0.68) / 0.16)

  return lerp(0.26, 0.04, (t - 0.84) / 0.16)
}

function dryEnvelope(t, velocity, inkLoad) {
  const tail =
    t < 0.76
      ? 0
      : normalize(t, 0.76, 1)

  return clamp01(
    (tail * 0.62)
    + (velocity * 0.10)
    + ((1 - inkLoad) * 0.30),
  )
}

function tipSharpness(t) {
  return t < 0.82
    ? 0
    : smoothstep(normalize(t, 0.82, 1))
}

function widthEnvelope(strokeId, t) {
  return sampleKeyframes(
    strokeId === 'A'
      ? WIDTH_A
      : WIDTH_B,
    t,
  )
}

function computeBrushWidth(runtime, t, pressure, velocity) {
  const profile =
    widthEnvelope(runtime.config.id, t)

  const pressureInfluence =
    lerp(0.88, 1.08, pressure)

  const speedInfluence =
    lerp(1.03, 0.86, velocity)

  return runtime.config.baseWidth
    * profile
    * pressureInfluence
    * speedInfluence
}

function animationCurve(value) {
  const t = clamp01(value)
  return 1 - ((1 - t) ** 3)
}

function colorAtProgress(stops, t) {
  const progress = clamp01(t)

  for (let index = 0; index < stops.length - 1; index += 1) {
    const [startAt, startColor] = stops[index]
    const [endAt, endColor] = stops[index + 1]

    if (progress <= endAt) {
      const local =
        (progress - startAt)
        / Math.max(0.0001, endAt - startAt)

      return [
        Math.round(lerp(startColor[0], endColor[0], local)),
        Math.round(lerp(startColor[1], endColor[1], local)),
        Math.round(lerp(startColor[2], endColor[2], local)),
      ]
    }
  }

  return stops[stops.length - 1][1]
}

function rgba(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${clamp01(alpha)})`
}

function createBristles(seed, count) {
  const random = createSeededRandom(seed)
  const bristles = []

  for (let index = 0; index < count; index += 1) {
    let lateral

    if (index < 8) {
      const side =
        index % 2 === 0
          ? -1
          : 1

      lateral =
        side
        * lerp(0.44, 0.58, random())
    }
    else {
      const centered =
        (
          random()
          + random()
          + random()
          + random()
          - 2
        ) / 2

      lateral = centered * 0.46
    }

    const stiffness =
      lerp(0.67, 0.93, random())

    const inkAffinity =
      lerp(0.72, 1.00, random())

    const survival =
      (
        Math.abs(lateral) * 0.42
        + stiffness * 0.30
        + inkAffinity * 0.22
        + random() * 0.06
      )

    bristles.push({
      lateral,
      drag: lerp(-0.13, 0.10, random()),
      thickness: lerp(0.68, 1.52, random()),
      stiffness,
      inkAffinity,
      dropoutBias: lerp(0.78, 1.16, random()),
      survival,
      tailRank: 1,
      previous: null,
    })
  }

  const sorted = [...bristles].sort(
    (left, right) =>
      right.survival - left.survival,
  )

  sorted.forEach((bristle, index) => {
    bristle.tailRank =
      index / Math.max(1, sorted.length - 1)
  })

  return {
    random,
    bristles,
  }
}

function createStrokeRuntime(config) {
  const trajectory =
    buildStrokeTrajectory(config)

  const brush =
    createBristles(
      config.seed,
      config.bristleCount,
    )

  const centerline =
    trajectory.centerline

  const initialAngle = Math.atan2(
    centerline[1][1] - centerline[0][1],
    centerline[1][0] - centerline[0][0],
  )

  return {
    config,
    centerline,
    constantRiseStartIndex:
      trajectory.constantRiseStartIndex,
    targetAngle:
      trajectory.targetAngle,
    random:
      brush.random,
    bristles:
      brush.bristles,
    pressure:
      config.id === 'A'
        ? pressureA
        : pressureB,
    nextIndex: 1,
    previousCenter: centerline[0],
    brushAngle: initialAngle,
    inkLoad:
      config.id === 'A'
        ? 0.92
        : 0.98,
  }
}

function drawSegment(
  context,
  pointA,
  pointB,
  width,
  color,
  alpha,
) {
  if (
    width <= 0
    || alpha <= 0
    || !Number.isFinite(width)
  ) {
    return
  }

  context.beginPath()
  context.moveTo(pointA[0], pointA[1])
  context.lineTo(pointB[0], pointB[1])
  context.lineWidth = width
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle =
    rgba(color, alpha)
  context.stroke()
}

function renderBrushSample(
  context,
  runtime,
  index,
) {
  const points = runtime.centerline
  const current = points[index]
  const previous = runtime.previousCenter
  const lastIndex =
    Math.max(1, points.length - 1)

  const t = index / lastIndex

  const before =
    points[Math.max(0, index - 1)]

  const after =
    points[Math.min(lastIndex, index + 1)]

  const tangentAngleNow = Math.atan2(
    after[1] - before[1],
    after[0] - before[0],
  )

  const pressure =
    runtime.pressure(t)

  const velocity =
    velocityProfile(t)

  const width =
    computeBrushWidth(
      runtime,
      t,
      pressure,
      velocity,
    )

  const sharpness =
    tipSharpness(t)

  const dryAmount =
    dryEnvelope(
      t,
      velocity,
      runtime.inkLoad,
    )

  const color =
    colorAtProgress(
      runtime.config.colors,
      t,
    )

  const angleResponse =
    lerp(0.10, 0.28, velocity)

  runtime.brushAngle =
    angleLerp(
      runtime.brushAngle,
      tangentAngleNow,
      angleResponse,
    )

  const tangentX =
    Math.cos(runtime.brushAngle)

  const tangentY =
    Math.sin(runtime.brushAngle)

  const normalX =
    -tangentY

  const normalY =
    tangentX

  const coreRatio =
    wetCoreRatio(t)

  let coreAlpha =
    lerp(0.14, 0.105, velocity)

  if (t >= 0.42 && t <= 0.52) {
    coreAlpha *= 0.76
  }

  if (t > 0.52 && t <= 0.68) {
    coreAlpha *= 1.08
  }

  if (t >= 0.82) {
    coreAlpha *=
      lerp(
        1,
        0,
        normalize(t, 0.82, 0.97),
      )
  }

  /*
   * Moisture is intentionally faint. It follows effective width,
   * not pressure directly.
   */
  drawSegment(
    context,
    previous,
    current,
    width * 0.76,
    color,
    0.028 * (1 - (dryAmount * 0.72)),
  )

  /*
   * The wet core is capped below 36% of the effective brush width.
   * This prevents the valley from becoming a fat U-shaped ribbon.
   */
  drawSegment(
    context,
    previous,
    current,
    Math.max(1.5, width * coreRatio),
    color,
    coreAlpha,
  )

  let spread =
    width
    * spreadEnvelope(t)

  spread *=
    lerp(
      1,
      0.48,
      sharpness,
    )

  const tail =
    t < 0.82
      ? 0
      : normalize(t, 0.82, 1)

  const activeFraction =
    lerp(1, 0.28, tail)

  for (const bristle of runtime.bristles) {
    /*
     * Centre filler hairs are shed first. Higher-survival edge hairs
     * remain visible through the final lift-off tip.
     */
    if (bristle.tailRank > activeFraction) {
      continue
    }

    const edgeProtection =
      1 - (Math.abs(bristle.lateral) * 0.30)

    const dropoutChance =
      dryAmount
      * 0.44
      * bristle.dropoutBias
      * edgeProtection

    if (runtime.random() < dropoutChance) {
      continue
    }

    const lateral =
      bristle.lateral
      * spread

    const drag =
      bristle.drag
      * runtime.config.baseWidth
      * lerp(1, 1.34, sharpness)

    const flutter =
      (runtime.random() - 0.5)
      * (
        0.34
        + (dryAmount * 1.85)
      )

    const target = [
      current[0]
        + (normalX * (lateral + flutter))
        - (tangentX * drag),
      current[1]
        + (normalY * (lateral + flutter))
        - (tangentY * drag),
    ]

    let bristlePoint = target

    if (bristle.previous) {
      bristlePoint = [
        lerp(
          bristle.previous[0],
          target[0],
          bristle.stiffness,
        ),
        lerp(
          bristle.previous[1],
          target[1],
          bristle.stiffness,
        ),
      ]

      const strandWidth =
        bristle.thickness
        * lerp(
          0.78,
          1.44,
          widthEnvelope(runtime.config.id, t),
        )
        * lerp(1, 0.70, sharpness)

      let strandAlpha =
        (
          0.22
          + (bristle.inkAffinity * 0.19)
        )
        * runtime.inkLoad
        * (1 - (dryAmount * 0.34))

      /*
       * Unlike the old tail, the final fibres do not fade to zero.
       * They remain optically alive while becoming fewer and thinner.
       */
      if (t >= 0.82) {
        strandAlpha *=
          lerp(1, 0.68, tail)
      }

      strandAlpha =
        Math.max(
          t >= 0.90
            ? 0.13
            : 0,
          strandAlpha,
        )

      drawSegment(
        context,
        bristle.previous,
        bristlePoint,
        Math.max(0.44, strandWidth),
        color,
        strandAlpha,
      )
    }

    bristle.previous = bristlePoint
  }

  runtime.inkLoad =
    Math.max(
      0.34,
      runtime.inkLoad
      - (
        0.00072
        * pressure
        * (0.78 + velocity)
      ),
    )

  runtime.previousCenter =
    current
}

function renderUntil(
  context,
  runtime,
  progress,
) {
  const targetIndex =
    Math.min(
      runtime.centerline.length - 1,
      Math.max(
        1,
        Math.floor(
          clamp01(progress)
          * (runtime.centerline.length - 1),
        ),
      ),
    )

  while (runtime.nextIndex <= targetIndex) {
    renderBrushSample(
      context,
      runtime,
      runtime.nextIndex,
    )

    runtime.nextIndex += 1
  }
}

function configureSurface(canvas) {
  const rectangle =
    canvas.getBoundingClientRect()

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      DPR_LIMIT,
    )

  const pixelWidth =
    Math.max(
      1,
      Math.round(rectangle.width * dpr),
    )

  const pixelHeight =
    Math.max(
      1,
      Math.round(rectangle.height * dpr),
    )

  canvas.width = pixelWidth
  canvas.height = pixelHeight

  const visibleContext =
    canvas.getContext('2d')

  if (!visibleContext) {
    return null
  }

  const inkCanvas =
    document.createElement('canvas')

  inkCanvas.width = pixelWidth
  inkCanvas.height = pixelHeight

  const inkContext =
    inkCanvas.getContext('2d')

  if (!inkContext) {
    return null
  }

  const modelScale =
    Math.min(
      rectangle.width / MODEL_WIDTH,
      rectangle.height / MODEL_HEIGHT,
    )

  const offsetX =
    (rectangle.width - (MODEL_WIDTH * modelScale)) / 2

  /*
   * Slightly lower placement leaves the brush mass below the text
   * while allowing the constant rising tails to pass behind it.
   */
  const offsetY =
    (
      rectangle.height
      - (MODEL_HEIGHT * modelScale)
    ) / 2
    + 6

  inkContext.setTransform(
    dpr * modelScale,
    0,
    0,
    dpr * modelScale,
    dpr * offsetX,
    dpr * offsetY,
  )

  inkContext.globalCompositeOperation =
    'source-over'

  return {
    canvas,
    visibleContext,
    inkCanvas,
    inkContext,
    rectangle,
    dpr,
  }
}

function drawProtectionMask(
  context,
  bounds,
) {
  const layers = [
    [18, 0.045],
    [14, 0.060],
    [10, 0.085],
    [7, 0.100],
    [4, 0.115],
    [0, 0.145],
  ]

  for (const [margin, alpha] of layers) {
    context.fillStyle =
      `rgba(0, 0, 0, ${alpha})`

    context.fillRect(
      bounds.left - margin,
      bounds.top - margin,
      bounds.width + (margin * 2),
      bounds.height + (margin * 2),
    )
  }
}

function measureProtectionBounds(
  canvas,
  textElement,
) {
  if (!textElement) {
    return null
  }

  const canvasRect =
    canvas.getBoundingClientRect()

  const textRect =
    textElement.getBoundingClientRect()

  const scaleX =
    canvas.width
    / Math.max(1, canvasRect.width)

  const scaleY =
    canvas.height
    / Math.max(1, canvasRect.height)

  const left =
    (textRect.left - canvasRect.left)
    * scaleX

  const top =
    (textRect.top - canvasRect.top)
    * scaleY

  return {
    left: left - (10 * scaleX),
    top: top - (5 * scaleY),
    width:
      textRect.width * scaleX
      + (20 * scaleX),
    height:
      textRect.height * scaleY
      + (10 * scaleY),
  }
}

function compositeVisible(
  surface,
  textElement,
) {
  const context =
    surface.visibleContext

  context.setTransform(
    1,
    0,
    0,
    1,
    0,
    0,
  )

  context.clearRect(
    0,
    0,
    surface.canvas.width,
    surface.canvas.height,
  )

  context.globalCompositeOperation =
    'source-over'

  context.drawImage(
    surface.inkCanvas,
    0,
    0,
  )

  const protection =
    measureProtectionBounds(
      surface.canvas,
      textElement,
    )

  if (protection) {
    context.save()

    context.globalCompositeOperation =
      'destination-out'

    drawProtectionMask(
      context,
      protection,
    )

    context.restore()
  }
}

function renderFinalState(
  surface,
  textElement,
) {
  const strokeA =
    createStrokeRuntime(STROKE_A)

  const strokeB =
    createStrokeRuntime(STROKE_B)

  renderUntil(
    surface.inkContext,
    strokeA,
    1,
  )

  renderUntil(
    surface.inkContext,
    strokeB,
    1,
  )

  compositeVisible(
    surface,
    textElement,
  )
}

function assertTrajectoryContracts() {
  /*
   * Development-time invariant documentation. The values are deterministic
   * and are intentionally kept next to the renderer.
   */
  const strokeA =
    buildStrokeTrajectory(STROKE_A)

  const strokeB =
    buildStrokeTrajectory(STROKE_B)

  for (const trajectory of [strokeA, strokeB]) {
    const points =
      trajectory.centerline

    const start =
      trajectory.constantRiseStartIndex

    let minimumAngle =
      Infinity

    let maximumAngle =
      -Infinity

    for (
      let index = start + 1;
      index < points.length;
      index += 1
    ) {
      const previous =
        points[index - 1]

      const current =
        points[index]

      const angle =
        Math.atan2(
          current[1] - previous[1],
          current[0] - previous[0],
        )

      minimumAngle =
        Math.min(minimumAngle, angle)

      maximumAngle =
        Math.max(maximumAngle, angle)
    }

    if (
      Number.isFinite(minimumAngle)
      && (
        maximumAngle - minimumAngle
      ) > degreesToRadians(2.1)
    ) {
      console.warn(
        'WinningFund brush constant-rise angle drifted beyond contract.',
      )
    }
  }
}

assertTrajectoryContracts()

export default function WinningFundCalligraphyBrush() {
  const canvasRef =
    useRef(null)

  useEffect(() => {
    const canvas =
      canvasRef.current

    if (!canvas) {
      return undefined
    }

    let frameId = 0
    let cancelled = false
    let completed = false

    const textElement =
      canvas.parentElement
        ?.querySelector(
          '.wf-home-kinetic-slogan__text',
        )

    const surface =
      configureSurface(canvas)

    if (!surface) {
      return undefined
    }

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      renderFinalState(
        surface,
        textElement,
      )

      return undefined
    }

    const strokeA =
      createStrokeRuntime(STROKE_A)

    const strokeB =
      createStrokeRuntime(STROKE_B)

    const startedAt =
      performance.now()

    const checkAStart = 1260
    const checkADuration = 900

    /*
     * Brush B starts while A is still moving, but late enough for the
     * two calligraphic gestures to remain distinguishable.
     */
    const checkBStart = 1710
    const checkBDuration = 1040

    const animate = (now) => {
      if (cancelled) {
        return
      }

      const elapsed =
        now - startedAt

      const rawA =
        (elapsed - checkAStart)
        / checkADuration

      const rawB =
        (elapsed - checkBStart)
        / checkBDuration

      if (rawA > 0) {
        renderUntil(
          surface.inkContext,
          strokeA,
          animationCurve(rawA),
        )
      }

      if (rawB > 0) {
        renderUntil(
          surface.inkContext,
          strokeB,
          animationCurve(rawB),
        )
      }

      compositeVisible(
        surface,
        textElement,
      )

      if (rawA < 1 || rawB < 1) {
        frameId =
          requestAnimationFrame(animate)

        return
      }

      completed = true
    }

    frameId =
      requestAnimationFrame(animate)

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            if (
              cancelled
              || !completed
            ) {
              return
            }

            const resizedSurface =
              configureSurface(canvas)

            if (resizedSurface) {
              renderFinalState(
                resizedSurface,
                canvas.parentElement
                  ?.querySelector(
                    '.wf-home-kinetic-slogan__text',
                  ),
              )
            }
          })

    resizeObserver?.observe(canvas)

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      resizeObserver?.disconnect()
    }
  }, [])

  return createElement('canvas', {
    ref: canvasRef,
    className:
      'wf-home-kinetic-slogan__brush wf-home-kinetic-slogan__brush--canvas wf-home-kinetic-slogan__brush--calligraphy-v2',
    width: MODEL_WIDTH,
    height: MODEL_HEIGHT,
    'aria-hidden': 'true',
  })
}
