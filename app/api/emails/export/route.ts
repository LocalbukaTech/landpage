import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllEmailTemplates } from '@/lib/email';

export async function GET() {
  try {
    const templates = getAllEmailTemplates();
    const outDir = path.join(process.cwd(), 'public', 'email-templates');
    fs.mkdirSync(outDir, { recursive: true });

    const generated = [];
    for (const t of templates) {
      const filePath = path.join(outDir, `${t.id}.html`);
      fs.writeFileSync(filePath, t.html, 'utf8');
      generated.push(`${t.id}.html`);
    }

    return NextResponse.json({ success: true, count: generated.length, files: generated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
