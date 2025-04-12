import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error fontverter is not typed
import { convert } from "fontverter";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("font") as File;
    const formats = formData.getAll("formats") as string[];

    if (!file || formats.length === 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const zip = new JSZip();
    const sourceBuffer = Buffer.from(buffer);

    for (const format of formats) {
      try {
        if (!["ttf", "woff", "woff2"].includes(format)) {
          console.warn(`Unsupported format: ${format}`);
          continue;
        }

        const converted = await convert(
          sourceBuffer,
          format as "ttf" | "woff" | "woff2"
        );
        zip.file(`converted.${format}`, Buffer.from(converted));
      } catch (error) {
        console.error(`Error converting to ${format}:`, error);
        // Continue with other formats even if one fails
      }
    }

    const zipContent = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=converted_fonts.zip",
      },
    });
  } catch (error) {
    console.error("Font conversion failed:", error);
    return NextResponse.json(
      { error: "Font conversion failed" },
      { status: 500 }
    );
  }
}
