import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error fontverter is not typed
import { convert } from 'fontverter';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('font') as File;
  const formats = formData.getAll('formats') as string[];

  if (!file || formats.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const zip = new JSZip();

  for (const format of formats) {
    try {
      const converted = await convert(new Uint8Array(buffer), format as 'ttf' | 'woff' | 'woff2');
      zip.file(`converted.${format}`, converted);
    } catch (error) {
      console.error(`Error converting to ${format}:`, error);
    }
  }

  const zipContent = await zip.generateAsync({ type: 'arraybuffer' });

  return new NextResponse(zipContent, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=converted_fonts.zip',
    },
  });
}