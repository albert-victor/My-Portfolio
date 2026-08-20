"""Export Syne ExtraBold A as standalone SVG favicon path."""
from __future__ import annotations

from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[3]
FONT = ROOT / "assets" / "fonts" / "syne" / "Syne-Variable.ttf"
OUT = ROOT / "assets" / "images" / "brand" / "favicon.svg"
ACCENT = "#00a898"
VIEW = 64
PADDING = 6


def main() -> None:
    font = TTFont(str(FONT))
    font = instantiateVariableFont(font, {"wght": 800})

    glyph_set = font.getGlyphSet()
    bounds_pen = BoundsPen(glyph_set)
    glyph_set["A"].draw(bounds_pen)
    x_min, y_min, x_max, y_max = bounds_pen.bounds

    width = x_max - x_min
    height = y_max - y_min
    inner = VIEW - (PADDING * 2)
    scale = min(inner / width, inner / height)

    # Font Y-up -> SVG Y-down, centered in viewBox
    x_center = (x_min + x_max) / 2
    y_center = (y_min + y_max) / 2
    transform = (
        Transform()
        .translate(VIEW / 2, VIEW / 2)
        .scale(scale, -scale)
        .translate(-x_center, -y_center)
    )

    path_pen = SVGPathPen(glyph_set)
    t_pen = TransformPen(path_pen, transform)
    glyph_set["A"].draw(t_pen)
    path_data = path_pen.getCommands()

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEW} {VIEW}" role="img" aria-label="Albart V Mwamalumbili">
  <path fill="{ACCENT}" d="{path_data}" />
</svg>
"""
    OUT.write_text(svg, encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
