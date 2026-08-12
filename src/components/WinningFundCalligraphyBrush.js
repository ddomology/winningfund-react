import { createElement, useEffect, useRef } from 'react'

const MODEL_WIDTH = 420
const MODEL_HEIGHT = 140
const DPR_LIMIT = 2

/*
 * STEP 05ZB — custom Canvas calligraphy engine.
 *
 * Two open trajectories are derived from the supplied WinningFund logo.
 * Both deliberately follow descend -> valley -> rise. There are no loops.
 */
const CHECK_A_ANCHORS = Object.freeze([
  [32, 68],
  [46, 88],
  [64, 104],
  [88, 111],
  [112, 109],
  [132, 98],
  [148, 80],
  [162, 60],
  [176, 44],
  [198, 35],
  [228, 34],
])

const CHECK_B_ANCHORS = Object.freeze([
  [184, 72],
  [202, 94],
  [224, 108],
  [248, 112],
  [270, 104],
  [290, 88],
  [309, 66],
  [328, 44],
  [350, 24],
  [376, 14],
  [402, 12],
])

const CHECK_A_COLORS = Object.freeze([
  [0.00, [174, 238, 255]],
  [0.52, [105, 204, 245]],
  [0.80, [38, 157, 235]],
  [1.00, [0, 121, 250]],
])

const CHECK_B_COLORS = Object.freeze([
  [0.00, [105, 204, 245]],
  [0.40, [38, 157, 235]],
  [0.70, [0, 121, 250]],
  [1.00, [16, 52, 220]],
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
        2 * point0[0] - 5 * point1[0]
        + 4 * point2[0] - point3[0]
      ) * t2
      + (
        -point0[0] + 3 * point1[0]
        - 3 * point2[0] + point3[0]
      ) * t3
    ),
    0.5 * (
      (2 * point1[1])
      + (-point0[1] + point2[1]) * t
      + (
        2 * point0[1] - 5 * point1[1]
        + 4 * point2[1] - point3[1]
      ) * t2
      + (
        -point0[1] + 3 * point1[1]
        - 3 * point2[1] + point3[1]
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
    const point3 = anchorPoints[Math.min(anchorPoints.length - 1, index + 2)]

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

function resampleByDistance(points, spacing = 1.35) {
  if (points.length < 2) return points

  const output = [points[0]]
  let previous = points[0]
  let carried = 0

  for (let index = 1; index < points.length; index += 1) {
    let segmentStart = previous
    const segmentEnd = points[index]
    let segmentLength = distance(segmentStart, segmentEnd)

    if (segmentLength <= 0.0001) continue

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
    previous = segmentEnd
  }

  const lastPoint = points[points.length - 1]
  if (distance(output[output.length - 1], lastPoint) > 0.1) {
    output.push(lastPoint)
  }

  return output
}

function pressureCheckA(t) {
  if (t < 0.10) return lerp(0.18, 0.56, t / 0.10)
  if (t < 0.44) return lerp(0.56, 0.98, (t - 0.10) / 0.34)
  if (t < 0.58) return lerp(0.98, 0.92, (t - 0.44) / 0.14)
  if (t < 0.82) return lerp(0.92, 0.52, (t - 0.58) / 0.24)
  return lerp(0.52, 0.05, (t - 0.82) / 0.18)
}

function pressureCheckB(t) {
  if (t < 0.12) return lerp(0.20, 0.64, t / 0.12)
  if (t < 0.43) return lerp(0.64, 1.00, (t - 0.12) / 0.31)
  if (t < 0.60) return lerp(1.00, 0.94, (t - 0.43) / 0.17)
  if (t < 0.82) return lerp(0.94, 0.46, (t - 0.60) / 0.22)
  return lerp(0.46, 0.03, (t - 0.82) / 0.18)
}

function velocityProfile(t) {
  if (t < 0.10) return 0.34
  if (t < 0.42) return 0.54
  if (t < 0.60) return 0.27
  if (t < 0.82) return 0.82
  return 1
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
      const local = (progress - startAt) / Math.max(0.0001, endAt - startAt)
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

function createBristles(seed, count = 54) {
  const random = createSeededRandom(seed)
  const bristles = []

  for (let index = 0; index < count; index += 1) {
    let lateral

    if (index < 8) {
      const side = index % 2 === 0 ? -1 : 1
      lateral = side * lerp(0.44, 0.57, random())
    }
    else {
      const gaussianLike = (
        random() + random() + random() + random() - 2
      ) / 2
      lateral = gaussianLike * 0.48
    }

    bristles.push({
      lateral,
      drag: lerp(-0.14, 0.12, random()),
      thickness: lerp(0.72, 1.62, random()),
      stiffness: lerp(0.68, 0.94, random()),
      inkAffinity: lerp(0.70, 1.00, random()),
      dropoutBias: lerp(0.78, 1.18, random()),
      previous: null,
    })
  }

  return { random, bristles }
}

function createStrokeRuntime({ anchors, pressure, colors, seed, baseWidth }) {
  const centerline = resampleByDistance(sampleCatmullRom(anchors), 1.35)
  const brush = createBristles(seed)

  return {
    centerline,
    pressure,
    colors,
    baseWidth,
    random: brush.random,
    bristles: brush.bristles,
    nextIndex: 1,
    previousCenter: centerline[0],
    inkLoad: 1,
  }
}

function calculateDryAmount(t, velocity, inkLoad) {
  const tailDry = t <= 0.62 ? 0 : ((t - 0.62) / 0.38) * 0.68

  return clamp01(
    tailDry
    + (velocity * 0.18)
    + ((1 - inkLoad) * 0.42),
  )
}

function drawSegment(context, pointA, pointB, width, color, alpha) {
  if (width <= 0 || alpha <= 0) return

  context.beginPath()
  context.moveTo(pointA[0], pointA[1])
  context.lineTo(pointB[0], pointB[1])
  context.lineWidth = width
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle = rgba(color, alpha)
  context.stroke()
}

function renderBrushSample(context, runtime, index) {
  const points = runtime.centerline
  const current = points[index]
  const previous = runtime.previousCenter
  const lastIndex = Math.max(1, points.length - 1)
  const t = index / lastIndex

  const before = points[Math.max(0, index - 1)]
  const after = points[Math.min(lastIndex, index + 1)]

  let tangentX = after[0] - before[0]
  let tangentY = after[1] - before[1]
  const tangentLength = Math.hypot(tangentX, tangentY) || 1
  tangentX /= tangentLength
  tangentY /= tangentLength

  const normalX = -tangentY
  const normalY = tangentX
  const pressure = runtime.pressure(t)
  const velocity = velocityProfile(t)
  const dryAmount = calculateDryAmount(t, velocity, runtime.inkLoad)
  const color = colorAtProgress(runtime.colors, t)

  // Moisture bloom: intentionally faint, never the silhouette owner.
  drawSegment(
    context,
    previous,
    current,
    runtime.baseWidth * pressure * 0.68,
    color,
    0.055 * (1 - (dryAmount * 0.88)),
  )

  // Wet core: repeated low-alpha deposits build natural valley density.
  drawSegment(
    context,
    previous,
    current,
    Math.max(2.2, runtime.baseWidth * pressure * 0.43),
    color,
    (0.23 + ((1 - velocity) * 0.06)) * (1 - (dryAmount * 0.82)),
  )

  const spread = runtime.baseWidth * pressure * (velocity > 0.80 ? 0.86 : 1)

  for (const bristle of runtime.bristles) {
    const dropoutChance = dryAmount * 0.62 * bristle.dropoutBias
    if (runtime.random() < dropoutChance) continue

    const lateral = bristle.lateral * spread
    const drag = bristle.drag * runtime.baseWidth
    const flutter = (runtime.random() - 0.5) * (0.45 + (dryAmount * 2.4))

    const target = [
      current[0] + (normalX * (lateral + flutter)) - (tangentX * drag),
      current[1] + (normalY * (lateral + flutter)) - (tangentY * drag),
    ]

    let bristlePoint = target

    if (bristle.previous) {
      bristlePoint = [
        lerp(bristle.previous[0], target[0], bristle.stiffness),
        lerp(bristle.previous[1], target[1], bristle.stiffness),
      ]

      const strandWidth = bristle.thickness
        * (0.62 + (pressure * 1.22))
        * (1 - (dryAmount * 0.32))

      const strandAlpha = (0.20 + (bristle.inkAffinity * 0.20))
        * (1 - (dryAmount * 0.58))
        * runtime.inkLoad

      drawSegment(
        context,
        bristle.previous,
        bristlePoint,
        Math.max(0.52, strandWidth),
        color,
        strandAlpha,
      )
    }

    bristle.previous = bristlePoint
  }

  runtime.inkLoad = Math.max(
    0.26,
    runtime.inkLoad - (0.00135 * pressure * (0.76 + velocity)),
  )
  runtime.previousCenter = current
}

function renderUntil(context, runtime, progress) {
  const targetIndex = Math.min(
    runtime.centerline.length - 1,
    Math.max(1, Math.floor(clamp01(progress) * (runtime.centerline.length - 1))),
  )

  while (runtime.nextIndex <= targetIndex) {
    renderBrushSample(context, runtime, runtime.nextIndex)
    runtime.nextIndex += 1
  }
}

function configureCanvas(canvas) {
  const rectangle = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT)

  canvas.width = Math.max(1, Math.round(rectangle.width * dpr))
  canvas.height = Math.max(1, Math.round(rectangle.height * dpr))

  const context = canvas.getContext('2d')
  if (!context) return null

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)

  const scale = Math.min(
    rectangle.width / MODEL_WIDTH,
    rectangle.height / MODEL_HEIGHT,
  )
  const offsetX = (rectangle.width - (MODEL_WIDTH * scale)) / 2
  const offsetY = (rectangle.height - (MODEL_HEIGHT * scale)) / 2

  context.setTransform(
    dpr * scale,
    0,
    0,
    dpr * scale,
    dpr * offsetX,
    dpr * offsetY,
  )
  context.globalCompositeOperation = 'source-over'
  return context
}

function createStrokeA() {
  return createStrokeRuntime({
    anchors: CHECK_A_ANCHORS,
    pressure: pressureCheckA,
    colors: CHECK_A_COLORS,
    seed: 182,
    baseWidth: 45,
  })
}

function createStrokeB() {
  return createStrokeRuntime({
    anchors: CHECK_B_ANCHORS,
    pressure: pressureCheckB,
    colors: CHECK_B_COLORS,
    seed: 417,
    baseWidth: 49,
  })
}

function renderFinalState(context) {
  const strokeA = createStrokeA()
  const strokeB = createStrokeB()
  renderUntil(context, strokeA, 1)
  renderUntil(context, strokeB, 1)
}

export default function WinningFundCalligraphyBrush() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = configureCanvas(canvas)
    if (!context) return undefined

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reducedMotion) {
      renderFinalState(context)
      return undefined
    }

    const strokeA = createStrokeA()
    const strokeB = createStrokeB()
    let frameId = 0
    let cancelled = false
    const startedAt = performance.now()

    const checkAStart = 1280
    const checkADuration = 860
    const checkBStart = 1720
    const checkBDuration = 980

    const animate = (now) => {
      if (cancelled) return

      const elapsed = now - startedAt
      const rawA = (elapsed - checkAStart) / checkADuration
      const rawB = (elapsed - checkBStart) / checkBDuration

      if (rawA > 0) {
        renderUntil(context, strokeA, animationCurve(rawA))
      }
      if (rawB > 0) {
        renderUntil(context, strokeB, animationCurve(rawB))
      }

      if (rawA < 1 || rawB < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
    }
  }, [])

  return createElement('canvas', {
    ref: canvasRef,
    className:
      'wf-home-kinetic-slogan__brush wf-home-kinetic-slogan__brush--canvas',
    width: MODEL_WIDTH,
    height: MODEL_HEIGHT,
    'aria-hidden': 'true',
  })
}
