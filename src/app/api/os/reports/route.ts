import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'prisma', 'os.json');

function readDb(): any[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    const list = readDb();

    // ─── Monthly breakdown ──────────────────────────────────────────────
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      label: new Date(year, i, 1).toLocaleString('pt-BR', { month: 'short' }).toUpperCase(),
      opened: 0,
      resolved: 0,
      pending: 0,
    }));

    // ─── Category counters ──────────────────────────────────────────────
    const categoryMap: Record<string, number> = {};

    // ─── Site counters ──────────────────────────────────────────────────
    const siteMap: Record<string, { site: string; total: number; resolved: number; open: number }> = {};

    // ─── Technician performance ─────────────────────────────────────────
    const techMap: Record<string, { name: string; total: number; resolved: number }> = {};

    for (const item of list) {
      const createdDate = new Date(item.createdAt || item.oldestDate || 0);
      if (createdDate.getFullYear() !== year) continue;

      const monthIdx = createdDate.getMonth(); // 0-based
      months[monthIdx].opened += 1;

      if (item.status === 'CONCLUIDA') {
        months[monthIdx].resolved += 1;
      } else {
        months[monthIdx].pending += 1;
      }

      // Category
      const cat = item.category || 'Outros';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;

      // Site
      const siteName = item.site || 'Desconhecido';
      if (!siteMap[siteName]) {
        siteMap[siteName] = { site: siteName, total: 0, resolved: 0, open: 0 };
      }
      siteMap[siteName].total += 1;
      if (item.status === 'CONCLUIDA') siteMap[siteName].resolved += 1;
      else siteMap[siteName].open += 1;

      // Technician
      const techName = item.technician || 'Não atribuído';
      if (!techMap[techName]) {
        techMap[techName] = { name: techName, total: 0, resolved: 0 };
      }
      techMap[techName].total += 1;
      if (item.status === 'CONCLUIDA') techMap[techName].resolved += 1;
    }

    // TOP 5 sites by problem count
    const top5Sites = Object.values(siteMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Category sorted
    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Technicians sorted
    const technicians = Object.values(techMap)
      .filter(t => t.name !== 'Não atribuído')
      .sort((a, b) => b.total - a.total);

    // Overall totals for the year
    const totalOpened = months.reduce((s, m) => s + m.opened, 0);
    const totalResolved = months.reduce((s, m) => s + m.resolved, 0);
    const totalPending = months.reduce((s, m) => s + m.pending, 0);
    const resolutionRate = totalOpened > 0 ? Math.round((totalResolved / totalOpened) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        year,
        summary: { totalOpened, totalResolved, totalPending, resolutionRate },
        months,
        top5Sites,
        categories,
        technicians,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
