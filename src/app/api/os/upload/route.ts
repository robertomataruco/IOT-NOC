import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const osId = formData.get('osId') as string | null;

    if (!file || !osId) {
      return NextResponse.json({ success: false, error: 'Faltando arquivo ou ID da OS' }, { status: 400 });
    }

    // Converter para buffer do Node
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Definir diretório público de uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'os');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Gerar nome de arquivo seguro e único
    const originalName = (file as any).name || 'upload.bin';
    const cleanOriginalName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileExtension = path.extname(cleanOriginalName);
    const uniqueName = `os-${osId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Salvar o arquivo no disco
    fs.writeFileSync(filePath, buffer);

    // Caminho da rota pública
    const publicPath = `/uploads/os/${uniqueName}`;

    // Atualizar no banco de dados JSON da OS
    const dbPath = path.join(process.cwd(), 'prisma', 'os.json');
    let list = [];
    if (fs.existsSync(dbPath)) {
      const dbContent = fs.readFileSync(dbPath, 'utf-8');
      list = JSON.parse(dbContent || '[]');
    }

    const index = list.findIndex((item: any) => item.osId === osId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Ordem de Serviço não encontrada' }, { status: 404 });
    }

    const item = list[index];
    if (!item.attachments) {
      item.attachments = [];
    }

    const newAttachment = {
      id: Math.random().toString(36).substring(2, 9),
      filename: originalName,
      path: publicPath,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString()
    };

    item.attachments.push(newAttachment);
    
    // Registrar na linha do tempo da OS
    if (!item.logs) item.logs = [];
    item.logs.push({
      timestamp: new Date().toISOString(),
      text: `Anexo adicionado: ${originalName}`
    });

    list[index] = item;
    fs.writeFileSync(dbPath, JSON.stringify(list, null, 2));

    return NextResponse.json({ success: true, data: item, attachment: newAttachment });
  } catch (error: any) {
    console.error('Erro no upload de anexo de OS:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
