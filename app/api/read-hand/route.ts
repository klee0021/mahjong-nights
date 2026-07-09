import { NextResponse } from "next/server";
import OpenAI from "openai";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const photo = formData.get("photo");

    if (!(photo instanceof File)) {
      return NextResponse.json(
        { error: "No photo uploaded." },
        { status: 400 }
      );
    }

    const bytes = await photo.arrayBuffer();

const resizedBuffer = await sharp(Buffer.from(bytes))
  .rotate()
  .resize({
    width: 1600,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true,
  })
  .jpeg({
    quality: 90,
  })
  .toBuffer();

const base64 = resizedBuffer.toString("base64");
const enhancedBuffer = await sharp(resizedBuffer)
  .normalize()
  .sharpen()
  .modulate({
    brightness: 1.05,
    saturation: 1.15,
  })
  .jpeg({
    quality: 90,
  })
  .toBuffer();

const enhancedBase64 = enhancedBuffer.toString("base64");

    const response = await openai.responses.create({
  model: "gpt-4.1",
  temperature: 0,
  input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `

You are identifying the tiles in a Chinese Classical Mahjong winning hand.

Your only task is to recognise the tiles exactly as they appear.

Ignore everything outside the winning hand.

The hand contains:
- four melds
- one pair

A meld may be:
- Chow (3 consecutive tiles)
- Pung (3 identical tiles)
- Kong (4 identical tiles)

The total number of tiles therefore depends on whether the hand contains any Kongs.

For every tile:

1. Visually identify the tile.
2. Verify it matches one of the legal Mahjong tiles below.
3. Convert it to the correct Mahjong Unicode character.

Pay particular attention to distinguishing:

- East / South / West / North
- Red Dragon / Green Dragon / White Dragon

The only legal tiles are:

Characters
🀇 🀈 🀉 🀊 🀋 🀌 🀍 🀎 🀏

Bamboo
🀐 🀑 🀒 🀓 🀔 🀕 🀖 🀗 🀘

Dots
🀙 🀚 🀛 🀜 🀝 🀞 🀟 🀠 🀡

Winds
🀀
🀁
🀂
🀃

Dragons
🀄
🀅
🀆

Preserve the existing grouping exactly as shown.

Do not regroup tiles.

Do not optimise the hand.

If one tile is difficult to read, make your best visual judgement without changing any neighbouring tiles.

Return ONLY valid JSON:

{
  "meld1": [],
  "meld2": [],
  "meld3": [],
  "meld4": [],
  "pair": []
}

Do not output markdown.

Do not explain anything.

Output only JSON.
`,
            },
            {
  type: "input_image",
  image_url: `data:image/jpeg;base64,${base64}`,
},
{
  type: "input_image",
  image_url: `data:image/jpeg;base64,${enhancedBase64}`,
},
          ],
        },
      ],
    });

    try {
  const json = JSON.parse(response.output_text);

  return NextResponse.json(json);
} catch {
  console.error("Model returned:", response.output_text);

  return NextResponse.json(
    {
      error: "AI returned invalid JSON.",
      raw: response.output_text,
    },
    { status: 500 }
  );
}
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to process image." },
      { status: 500 }
    );
  }
}