import { NextResponse } from "next/server";

export async function POST() {
  await new Promise((resolve) =>
    setTimeout(resolve, 2000)
  );

  return NextResponse.json({
    meld1: ["🀇", "🀈", "🀉"],
    meld2: ["🀊", "🀋", "🀌"],
    meld3: ["🀐", "🀐", "🀐"],
    meld4: ["🀙", "🀙", "🀙"],
    pair: ["🀄", "🀄"],
  });
}