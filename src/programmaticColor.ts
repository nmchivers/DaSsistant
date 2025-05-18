import { oklch, formatHex, inGamut } from 'culori';



export function generatePalette(baseHex: string, tokenPrefix: string, type: "vibrant" | "neutral", hueAdj?: "red" | "green") {
    const gamutCheck = inGamut('rgb');

    const { l: l0, c: c0 } = oklch(baseHex)!;

    function idealChroma(l: number) {
      if (type == "vibrant") {
        // return 0.5 * (1 - Math.pow(2 * Math.abs(l - 0.5), 2));
        const diff = l - l0;
        // if you’re darker than the anchor, use σ_dark:
        const sigmaDark = l0 / 2;
        // if you’re lighter, use σ_light:
        const sigmaLight = (1 - l0) / 2;
        const sigma = diff < 0 ? sigmaDark : sigmaLight;
        // if σ is zero (edge cases), just return 0 or c₀ if diff=0
        if (sigma === 0) return diff === 0 ? c0 : 0;
        // Gaussian
        return Math.max(0, c0 * Math.exp(-(diff * diff) / (2 * sigma * sigma)));
      } else {
        const peak = .09; //adjusts how saturated the mids can get.
        const expDark = 1.25; //larger number means less saturation in the darks
        const expLight = 1.25; //larger number means less saturation in the lights
        return Math.max(0, peak * Math.pow(l, expDark) * Math.pow(1-l, expLight));
      }
    }
    function newLightness(l: number) {
        
        return (l * -0.0819333 + 100) / 100;
    }

    const base = oklch(baseHex);
    if (!base || base.mode !== "oklch") throw new Error("Invalid color");

    let baseHue = base.h ?? 0;

    if (hueAdj == "red") {
        //make this from 350 to 30. the 40's are looking too orange.
        //also look into making this a for loop with a break.
        while (baseHue < 0 || baseHue > 40) {
           baseHue -= 30; 
        }
        console.log("The red hue is " + baseHue.toString());
    } else if (hueAdj == "green") {
        while (baseHue < 140 || baseHue > 180) {
           baseHue -= 30; 
        }
        console.log("The green hue is " + baseHue.toString());
    } else {
        baseHue = base.h ?? 0;
    }

    let palette: {prop:string, value:string}[] = [];

    for (let step = 0; step < 1001; step += 50) {
        let c = idealChroma(step/1000);
        const l = newLightness(step);

        while (c >= 0) {
            const color = oklch({ mode: 'oklch', l, c, h: baseHue });

            if (gamutCheck(color)) {
                palette.push({prop: tokenPrefix + "-" + String(step).padStart(4, "0"), value: formatHex({ mode: 'oklch', l, c, h: baseHue })});
                break;
            } else {
                c -= .001
            }
        }
    }

    return palette;
}