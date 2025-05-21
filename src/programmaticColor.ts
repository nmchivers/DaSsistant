import { oklch, formatHex, inGamut } from 'culori';

function generateSinglePalette(baseHex: string, tokenPrefix: string, type: "vibrant" | "neutral") {
    const gamutCheck = inGamut('rgb');

    const { l: baseL, c: BaseC, h: baseH } = oklch(baseHex)!;

    function idealChroma(level: number) {
      if (type == "vibrant") {
        // return 0.5 * (1 - Math.pow(2 * Math.abs(l - 0.5), 2));
        const diff = level - baseL;
        // if you’re darker than the anchor, use σ_dark:
        const sigmaDark = baseL / 2;
        // if you’re lighter, use σ_light:
        const sigmaLight = (1 - baseL) / 2;
        const sigma = diff < 0 ? sigmaDark : sigmaLight;
        // if σ is zero (edge cases), just return 0 or c₀ if diff=0
        if (sigma === 0) return diff === 0 ? BaseC : 0;
        // Gaussian
        return Math.max(0, BaseC * Math.exp(-(diff * diff) / (2 * sigma * sigma)));
      } else {
        const peak = .09; //adjusts how saturated the mids can get.
        const expDark = 1.25; //larger number means less saturation in the darks
        const expLight = 1.25; //larger number means less saturation in the lights
        return Math.max(0, peak * Math.pow(level, expDark) * Math.pow(1-level, expLight));
      }
    }
    function newLightness(level: number) {
        return (level * -0.0819333 + 100) / 100;
    }

    let palette: {prop:string, value:string}[] = [];

    for (let step = 0; step < 1001; step += 50) {
        let c = idealChroma(step/1000);
        const l = newLightness(step);

        while (c >= 0) {
            const color = oklch({ mode: 'oklch', l, c, h: baseH });

            if (gamutCheck(color)) {
                palette.push({prop: tokenPrefix + "-" + String(step).padStart(4, "0"), value: formatHex({ mode: 'oklch', l, c, h: baseH })});
                break;
            } else {
                c -= .001
            }
        }
    };

    return palette;
}

function getNewHue(baseHue:number, hueAdj: string) {
    let newHue = baseHue;

    if (hueAdj == "red") {
        for (let index = 0; index < 12; index++) {
            if (newHue >= -10 && newHue <= 30) break;
            newHue -= 30;    
        };
        if (newHue < 0) {newHue += 360};
    } else if (hueAdj == "green") {
        for (let index = 0; index < 12; index++) {
            if (newHue >= 140 && newHue <= 180) break;
            newHue -= 30;    
        };
    }

    return newHue;
}

function findMaxChroma(lightness:number, hue:number) {
    const gamutCheck = inGamut('rgb');
    let maxC = 0.5;
    while (maxC >= 0) {
        const color = oklch({
        mode: "oklch",
        l: lightness,
        c: maxC,
        h: hue,
        });
        if (gamutCheck(color)) {
        break;
        } else {
        maxC -= 0.001;
        }
    }
    return maxC;
}

export function generateFullPalette (baseHex: string) {
    const { l: baseL, c: BaseC, h: baseH } = oklch(baseHex)!;
    
    const redHue = getNewHue(baseH || 0, "red");
    const greenHue = getNewHue(baseH || 0, "green");
    const baseMaxC = findMaxChroma(baseL, baseH || 0);
    const redMaxC = findMaxChroma(baseL, redHue);
    const greenMaxC = findMaxChroma(baseL, greenHue);
    const redHex = formatHex({mode: "oklch", l: baseL, c: redMaxC*(BaseC/baseMaxC), h: redHue});
    const greenHex = formatHex({mode: "oklch", l: baseL, c: greenMaxC*(BaseC/baseMaxC), h: greenHue});

    const primaryPalette = generateSinglePalette(baseHex, "--mn-color-primary", "vibrant");
    const neutralPalette = generateSinglePalette(baseHex, "--mn-color-neutral", "neutral");
    const redPalette = generateSinglePalette(redHex, "--mn-color-red", "vibrant");
    const greenPalette = generateSinglePalette(greenHex, "--mn-color-green", "vibrant");
    const newPalette = [...primaryPalette, ...neutralPalette, ...redPalette, ...greenPalette];

    const root = document.documentElement;
    for (const {prop, value} of newPalette) {
      root.style.setProperty(prop, value);
    }
}