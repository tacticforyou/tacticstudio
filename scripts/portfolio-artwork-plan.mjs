// Approved source: FigCraft, Portfo Images (page 6137).
// Frame coordinates exclude protruding artwork, matching the carousel's height rule.
const layer = (name, ids, motion = "panel", options = {}) => ({
  name,
  ids: Array.isArray(ids) ? ids : [ids],
  motion,
  ...options,
});

export const artworkPlan = [
  {
    slug: "puressis",
    frame: 6631,
    bounds: [359, 219.99, 2833, 2228.02],
    layers: [
      layer("symbol", [6676, 6677]),
      layer("story", [6649, 6650], "panel", { asset: "story-tall" }),
      layer("brand", [6638, 6639]),
      layer("letter-p", [6657, 6661]),
      layer("dog-symbol", [6658, 6664]),
      layer("care-card", [6659, 6668]),
      // Approved user-supplied vector; FigCraft's Boolean export loses the gap.
      layer("care-symbol", 6695, "accent", {
        source: "scripts/portfolio-source-assets/puressis-care-symbol.svg",
        delay: 0.3,
      }),
      layer("dog-card", 6680, "backdrop"),
      // FigCraft bakes the left body crop and diagonal alpha fade into one cutout.
      // The fixed window leaves room for the full ear throughout the rise.
      layer("dog", 6704, "masked-rise", {
        asset: "dog-alpha",
        delay: 0.22,
        clip: 6683,
      }),
      // Full FigCraft shadow bounds: 149px disc inside a 426.8px export.
      layer("plus-left", 6689, "accent", {
        delay: 0.4,
        exportPadding: [138.9, 112.9, 138.9, 164.9],
      }),
      layer("plus-right", 6692, "accent", {
        delay: 0.48,
        exportPadding: [138.9, 112.9, 138.9, 164.9],
      }),
    ],
  },
  {
    slug: "prevaisor",
    frame: 6487,
    bounds: [370, 225, 2819, 2217],
    layers: [
      layer("brand", [6500, 6502]),
      layer("story", [6492, 6529]),
      layer("type", [6493, 6494]),
      layer("symbols", [6498, 6522]),
      layer("billboard", [6501, 6521]),
      layer("phone-card", 6513, "backdrop"),
      layer("calendar", [6512, 6514]),
      layer("phone", 6520, "masked-rise", {
        asset: "phone-complete",
        delay: 0.22,
        clip: 6519,
        startBelowClip: true,
      }),
    ],
  },
  {
    slug: "doshi",
    frame: 6253,
    bounds: [370, 227, 2819, 2217],
    layers: [
      layer("brand", 6338),
      layer("bag-card", 6258, "backdrop"),
      layer("business-card", [6271, 6272]),
      layer("type", [6266, 6267]),
      layer("model", 6275),
      // Preserve the hand and bag's original overlapping rounded windows.
      layer("bag", 6261, "masked-rise", {
        asset: "bag-complete",
        delay: 0.22,
        clip: 6260,
      }),
      layer("bag-lower", 6264, "masked-rise", {
        delay: 0.22,
        clip: 6263,
        // Project-frame coordinates: exclude the forearm left of the card,
        // ending 16 source pixels above the first visible bag edge.
        sourceNotch: [0, 1660],
      }),
    ],
  },
  {
    slug: "radian",
    frame: 6541,
    bounds: [382, 227, 2812, 2217],
    layers: [
      layer("robot-card", [6545, 6578, 6581, 6583], "backdrop"),
      layer("texture", [6567, 6568]),
      layer("hand-card", 6558),
      layer("phone", [6557, 6584]),
      layer("construction", [6566, 6619, 6620]),
      layer("symbols", [6556, 6612]),
      layer("circle", 6610, "circle", { clip: 6609 }),
      layer("robot", 6611, "hero", { clip: 6609 }),
      layer("mark-top", 6546, "accent"),
      layer("mark-middle", 6552, "accent"),
      layer("mark-bottom", 6549, "accent"),
      layer("hand", 6565, "masked-rise", {
        asset: "hand-complete",
        delay: 0.22,
        clip: 6564,
        startBelowClip: true,
      }),
    ],
  },
  {
    slug: "north",
    frame: 6395,
    bounds: [370, 227, 2824, 2217],
    layers: [
      layer("story", [6399, 6458]),
      layer("story-track", 6417, "accent", { clip: 6400 }),
      layer("brand", [6419, 6420]),
      layer("sign", [6415, 6416, 6486]),
      layer("car-card", [6468, 6473], "backdrop"),
      layer("phone", [6412, 6475]),
      layer("type", 6479),
      layer("symbols", 6401),
      layer("car", 6470, "hero"),
    ],
  },
  {
    slug: "milan",
    frame: 6202,
    bounds: [370, 227, 2819, 2217],
    layers: [
      layer("brand", 6237),
      layer("slogan", 6223),
      layer("watch-card", 6218),
      layer("phone-card", 6208, "backdrop"),
      layer("type", 6246),
      layer("tag", 6249),
      layer("main-card", 6214, "lift", { delay: 0.1 }),
      layer("sculpture", 6217, "logo", {
        parent: "main-card",
        clip: 6216,
        delay: 0.32,
      }),
      // Complete phone artwork moving behind the fixed, expanded CSS window.
      layer("phones", 6211, "phone-emerge", { delay: 0.22, clip: 6210 }),
      layer("watch", 6219, "lift", { delay: 0.26 }),
      layer("wordmark-m", 6232, "write", { delay: 0.8 }),
      layer("wordmark-i", 6233, "write", { delay: 0.87 }),
      layer("wordmark-l", 6234, "write", { delay: 0.94 }),
      layer("wordmark-a", 6235, "write", { delay: 1.01 }),
      layer("wordmark-n", 6236, "write", { delay: 1.08 }),
    ],
  },
  {
    slug: "uninect",
    frame: 6346,
    bounds: [389, 227, 2800, 2217],
    layers: [
      layer("symbol", [6350, 6351]),
      layer("story", [6352, 6387]),
      layer("brand", [6353, 6363]),
      layer("letters", 6359),
      layer("portrait-card", 6374, "backdrop"),
      layer("hand-card", 6380),
      layer("sign", [6381, 6382]),
      layer("hand", 6386, "masked-rise", {
        asset: "hand-complete",
        delay: 0.22,
        clip: 6385,
        startBelowClip: true,
      }),
      layer("woman", 6377, "hero", { clip: 6376 }),
    ],
    poster: [6350, 6351, 6352, 6353, 6359, 6363, 6373, 6378, 6382, 6383, 6387],
  },
];
