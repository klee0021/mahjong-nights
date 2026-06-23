"use client";

import { MahjongTile } from "./MahjongTile";

type Props = {
  onPick: (tile: string) => void;
};

export function TilePalette({
  onPick,
}: Props) {
  const sections = [
    {
      title: "Characters",
      tiles: [
        "🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",
      ],
    },
    {
      title: "Bamboo",
      tiles: [
        "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",
      ],
    },
    {
      title: "Dots",
      tiles: [
        "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡",
      ],
    },
    {
      title: "Winds",
      tiles: [
        "🀀","🀁","🀂","🀃",
      ],
    },
    {
      title: "Dragons",
      tiles: [
        "🀄","🀅","🀆",
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <div className="mb-2 text-sm font-extrabold text-mj-green">
            {section.title}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {section.tiles.map((tile) => (
              <MahjongTile
                key={tile}
                char={tile}
                size="lg"
                onClick={() => onPick(tile)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}