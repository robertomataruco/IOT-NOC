import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';

const execPromise = util.promisify(exec);

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Double check admin role
  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const cmd = searchParams.get('cmd') || 'status';

  try {
    let commandLine = 'pm2 status';
    if (cmd === 'logs') {
      commandLine = 'pm2 logs trap-receiver --lines 50 --no-daemon';
    } else if (cmd === 'netstat') {
      commandLine = 'netstat -tuln | grep 162 || true';
    } else if (cmd === 'node-path') {
      commandLine = 'which node && ls -l $(which node)';
    }

    const { stdout, stderr } = await execPromise(commandLine);
    return NextResponse.json({
      success: true,
      command: commandLine,
      stdout,
      stderr
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      stdout: err.stdout,
      stderr: err.stderr
    });
  }
}
