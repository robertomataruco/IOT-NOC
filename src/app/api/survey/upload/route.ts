import { NextRequest, NextResponse } from "next/server";
import { exec, execSync } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import zlib from "zlib";

const execAsync = promisify(exec);

// --- Pure JS High-Performance ZIP Archive Parser for iBwave (.ibw) Files ---
interface ZipFileEntry {
  name: string;
  data: Buffer;
}

function extractZipFiles(buffer: Buffer): ZipFileEntry[] {
  const files: ZipFileEntry[] = [];
  let pos = 0;
  
  while (pos < buffer.length - 30) {
    if (
      buffer[pos] === 0x50 &&
      buffer[pos + 1] === 0x4b &&
      buffer[pos + 2] === 0x03 &&
      buffer[pos + 3] === 0x04
    ) {
      try {
        const compMethod = buffer.readUInt16LE(pos + 8);
        const compressedSize = buffer.readUInt32LE(pos + 18);
        const fileNameLen = buffer.readUInt16LE(pos + 26);
        const extraFieldLen = buffer.readUInt16LE(pos + 28);
        
        const nameStart = pos + 30;
        const nameEnd = nameStart + fileNameLen;
        if (nameEnd > buffer.length) break;
        
        const fileName = buffer.subarray(nameStart, nameEnd).toString("utf-8");
        
        const dataStart = nameEnd + extraFieldLen;
        const dataEnd = dataStart + compressedSize;
        if (dataEnd > buffer.length) break;
        
        if (fileName && !fileName.endsWith("/")) {
          const rawData = buffer.subarray(dataStart, dataEnd);
          let decompressedData = rawData;
          
          if (compMethod === 8) {
            try {
              decompressedData = zlib.inflateRawSync(rawData);
            } catch (inflateErr) {
              console.error(`[ZIP Parser] Failed to decompress ${fileName}:`, inflateErr);
            }
          }
          
          files.push({
            name: fileName,
            data: decompressedData
          });
        }
        pos = dataEnd;
      } catch (err) {
        console.error("[ZIP Parser] Header parsing crash:", err);
        pos += 4;
      }
    } else {
      const nextSig = buffer.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), pos + 1);
      if (nextSig === -1) break;
      pos = nextSig;
    }
  }
  return files;
}

// --- High-Performance DWG/DXF Binary Embedded Image Extractor ---
function extractEmbeddedImages(buffer: Buffer): { imageData: string; mime: string }[] {
  const extractedImages: { data: Buffer; mime: string }[] = [];
  
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const pngFooter = Buffer.from([0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
  let pngPos = 0;
  
  while (true) {
    const startIdx = buffer.indexOf(pngHeader, pngPos);
    if (startIdx === -1) break;
    
    const endIdx = buffer.indexOf(pngFooter, startIdx + 8);
    if (endIdx !== -1) {
      const fullEnd = endIdx + 8;
      const pngData = buffer.subarray(startIdx, fullEnd);
      if (pngData.length > 2000) {
        extractedImages.push({ data: pngData, mime: "image/png" });
      }
      pngPos = fullEnd;
    } else {
      pngPos = startIdx + 8;
    }
  }

  const jpgHeader = Buffer.from([0xff, 0xd8, 0xff]);
  const jpgFooter = Buffer.from([0xff, 0xd9]);
  let jpgPos = 0;
  
  while (true) {
    const startIdx = buffer.indexOf(jpgHeader, jpgPos);
    if (startIdx === -1) break;
    
    const endIdx = buffer.indexOf(jpgFooter, startIdx + 3);
    if (endIdx !== -1) {
      const fullEnd = endIdx + 2;
      const jpgData = buffer.subarray(startIdx, fullEnd);
      if (jpgData.length > 2000 && jpgData.length < 2000000) {
        extractedImages.push({ data: jpgData, mime: "image/jpeg" });
      }
      jpgPos = fullEnd;
    } else {
      jpgPos = startIdx + 3;
    }
  }

  return extractedImages
    .sort((a, b) => b.data.length - a.data.length)
    .map(img => ({
      imageData: `data:${img.mime};base64,${img.data.toString("base64")}`,
      mime: img.mime
    }));
}

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const conversionLog: string[] = [];
  const log = (msg: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const line = `[${timestamp}] ${msg}`;
    console.log(`[Site Survey API] ${line}`);
    conversionLog.push(line);
  };

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Nenhum arquivo enviado no corpo da requisição." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const uniqueId = Date.now();
    const savedFileName = `cad_${uniqueId}.${fileExt}`;
    const savedFilePath = path.join(uploadsDir, savedFileName);
    
    await fs.writeFile(savedFilePath, buffer);
    log(`Arquivo recebido com sucesso: "${file.name}" (${buffer.length} bytes)`);

    let imageData: string | null = null;
    let dxfUrl: string | null = null;
    let mimeType = "image/png";
    let debugMethod = "";

    // === MÉTODOS SÍNCRONOS RÁPIDOS (< 10ms) ===

    // 1. Descompressão de ZIP / iBwave
    if (fileExt === "ibw" || fileExt === "zip") {
      debugMethod = "IBW Zip Decompressor";
      try {
        log(`Iniciando descompressão síncrona de iBwave/ZIP...`);
        const extractedFiles = extractZipFiles(buffer);
        let bestImageEntry: ZipFileEntry | null = null;
        
        for (const f of extractedFiles) {
          const ext = f.name.split(".").pop()?.toLowerCase();
          if (["png", "jpg", "jpeg", "svg", "gif", "bmp"].includes(ext || "")) {
            if (!bestImageEntry) {
              bestImageEntry = f;
            } else {
              const nameLower = f.name.toLowerCase();
              const bestLower = bestImageEntry.name.toLowerCase();
              const hasFloor = nameLower.includes("floor") || nameLower.includes("plan") || nameLower.includes("layout") || nameLower.includes("planta");
              const bestHasFloor = bestLower.includes("floor") || bestLower.includes("plan") || bestLower.includes("layout") || bestLower.includes("planta");
              
              if (hasFloor && !bestHasFloor) {
                bestImageEntry = f;
              } else if (hasFloor === bestHasFloor && f.data.length > bestImageEntry.data.length) {
                bestImageEntry = f;
              }
            }
          }
        }
        
        if (bestImageEntry) {
          const ext = bestImageEntry.name.split(".").pop()?.toLowerCase() || "png";
          const mime = ext === "svg" ? "image/svg+xml" : `image/${ext}`;
          const extractedFileName = `extracted_${uniqueId}.${ext}`;
          const extractedFilePath = path.join(uploadsDir, extractedFileName);
          await fs.writeFile(extractedFilePath, bestImageEntry.data);
          
          dxfUrl = `/uploads/${extractedFileName}`;
          imageData = dxfUrl;
          mimeType = mime;
          log(`[SINCRO] Planta de fundo ZIP extraída: "${bestImageEntry.name}"`);
        }
      } catch (zipErr: any) {
        log(`[SINCRO] Erro ZIP: ${zipErr.message}`);
      }
    }

    // 2. Bypass DXF direto
    if (!imageData && fileExt === "dxf") {
      dxfUrl = `/uploads/${savedFileName}`;
      imageData = dxfUrl;
      mimeType = "application/dxf";
      debugMethod = "Direct Native DXF Access";
      log(`[SINCRO] Bypass DXF ativo: servindo original diretamente.`);
    }

    // 3. AutoCAD Binary Signature Scanner (Recupera JPEG/PNG do header em 5ms!)
    if (!imageData && (fileExt === "dwg" || fileExt === "dxf" || fileExt === "ibw")) {
      log(`[SINCRO] Escaneando binários de AutoCAD por miniatura de layout...`);
      const images = extractEmbeddedImages(buffer);
      if (images && images.length > 0) {
        const ext = images[0].mime === "image/png" ? "png" : "jpg";
        const thumbName = `thumb_${uniqueId}.${ext}`;
        const thumbPath = path.join(uploadsDir, thumbName);
        const rawImgBuffer = Buffer.from(images[0].imageData.split(",")[1], 'base64');
        await fs.writeFile(thumbPath, rawImgBuffer);
        
        dxfUrl = `/uploads/${thumbName}`;
        imageData = dxfUrl;
        mimeType = images[0].mime;
        debugMethod = "AutoCAD Binary Signature Scanner";
        log(`[SINCRO] Miniatura de alta resolução extraída do DWG instantaneamente: ${dxfUrl}`);
      }
    }

    // Retorno síncrono imediato caso tenhamos obtido a imagem por meios rápidos!
    if (imageData) {
      try {
        const debugLogPath = path.join(process.cwd(), "scratch", "conversion_debug.log");
        await fs.writeFile(debugLogPath, conversionLog.join("\n"), "utf-8");
      } catch {}

      return NextResponse.json({
        success: true,
        pending: false,
        fileName: file.name,
        imageData,
        dxfUrl,
        mimeType,
        method: debugMethod
      });
    }

    // === PROCESSAMENTO ASSÍNCRONO EM SEGUNDO PLANO (ODA & QCAD) ===
    const fileId = `cad_${uniqueId}`;
    const statusFilePath = path.join(uploadsDir, `${fileId}_status.json`);
    
    // Status inicial
    await fs.writeFile(statusFilePath, JSON.stringify({ 
      status: "processing", 
      progress: 15,
      statusText: "Inicializando conversor de engenharia..." 
    }), "utf-8");

    // Inicia Promise paralela sem dar await para retornar resposta imediata
    (async () => {
      let bgImageData: string | null = null;
      let bgDxfUrl: string | null = null;
      let bgMimeType = "image/png";
      let bgDebugMethod = "AutoCAD QCAD dwg2svg Converter";

      try {
        // Proativa limpeza de processos órfãos anteriores no Windows/Linux
        try {
          if (process.platform === "win32") {
            try { await execAsync("taskkill /F /IM qcad.exe"); } catch {}
            try { await execAsync("taskkill /F /IM qcadcmd.exe"); } catch {}
            try { await execAsync("taskkill /F /IM OdaFileConverter.exe"); } catch {}
          } else {
            try { await execAsync("killall -9 qcad || true"); } catch {}
            try { await execAsync("killall -9 OdaFileConverter || true"); } catch {}
          }
        } catch {}

        const svgFileName = `${fileId}.png`;
        const svgFilePath = path.join(uploadsDir, svgFileName);

        // A. ODA Converter
        if (fileExt === "dwg") {
          try {
            await fs.writeFile(statusFilePath, JSON.stringify({ 
              status: "processing", 
              progress: 35,
              statusText: "Otimizando vetores dwg2dxf..." 
            }), "utf-8");

            log(`[ODA] Iniciando conversão de DWG para DXF...`);
            const odaInDir = path.join(os.tmpdir(), `oda_in_${uniqueId}`);
            const odaOutDir = path.join(os.tmpdir(), `oda_out_${uniqueId}`);
            await fs.mkdir(odaInDir, { recursive: true });
            await fs.mkdir(odaOutDir, { recursive: true });
            
            const tempDwgPath = path.join(odaInDir, `cad_${uniqueId}.dwg`);
            await fs.copyFile(savedFilePath, tempDwgPath);
            
            const command = `xvfb-run -a ODAFileConverter "${odaInDir}" "${odaOutDir}" "ACAD2018" "DXF" "0" "1"`;
            await execAsync(command);
            
            const convertedDxfPath = path.join(odaOutDir, `cad_${uniqueId}.dxf`);
            const targetDxfPath = path.join(uploadsDir, `cad_${uniqueId}.dxf`);
            await fs.access(convertedDxfPath);
            await fs.copyFile(convertedDxfPath, targetDxfPath);
            await fs.rm(odaInDir, { recursive: true, force: true });
            await fs.rm(odaOutDir, { recursive: true, force: true });
            
            bgDxfUrl = `/uploads/cad_${uniqueId}.dxf`;
            bgImageData = bgDxfUrl;
            bgMimeType = "application/dxf";
            bgDebugMethod = "ODA File Converter Success";
            log(`[ODA] Sucesso! DXF gerado em: ${bgDxfUrl}`);
          } catch (e: any) {
            log(`[ODA] Ignorado ou falhou: ${e.message}`);
          }
        }

        // B. LibreDWG
        if (!bgImageData) {
          try {
            await fs.writeFile(statusFilePath, JSON.stringify({ 
              status: "processing", 
              progress: 55,
              statusText: "Extraindo malha de camadas lineares..." 
            }), "utf-8");

            log(`[LibreDWG] Tentando dwg2SVG...`);
            const command = `dwg2SVG "${savedFilePath}" > "${svgFilePath}"`;
            await execAsync(command);
            
            const stat = await fs.stat(svgFilePath);
            if (stat.size > 500) {
              bgDxfUrl = `/uploads/${svgFileName}`;
              bgImageData = bgDxfUrl;
              bgMimeType = "image/svg+xml";
              bgDebugMethod = "LibreDWG dwg2SVG Success";
              log(`[LibreDWG] Sucesso! SVG gerado com ${stat.size} bytes.`);
            }
          } catch (e: any) {
            log(`[LibreDWG] Ignorado ou falhou: ${e.message}`);
          }
        }

        // C. QCAD dwg2bmp (Converte DWG para PNG com altíssima fidelidade e contraste)
        if (!bgImageData) {
          try {
            await fs.writeFile(statusFilePath, JSON.stringify({ 
              status: "processing", 
              progress: 75,
              statusText: "Processando motor QCAD de Alto Contraste (PNG)..." 
            }), "utf-8");

            const tempPngFilePath = path.join(os.tmpdir(), `${fileId}.png`);
            log(`[QCAD] Tentando converter com parâmetros otimizados para PNG...`);
            try {
              await fs.unlink(tempPngFilePath);
            } catch {}

            let command = `dwg2bmp -f -a -b black -zoom-all -width=2400 -o "${tempPngFilePath}" "${savedFilePath}"`;
            let execOptions: any = {};
            let foundPath = "";
            let foundDwgInfoPath = "";
            
            if (process.platform === "win32") {
              const possiblePaths = [
                "C:\\Program Files\\QCAD\\dwg2bmp.bat",
                "C:\\qcad\\dwg2bmp.bat"
              ];
              for (const p of possiblePaths) {
                try {
                  await fs.access(p);
                  foundPath = p;
                  break;
                } catch {}
              }
              if (foundPath) {
                log(`QCAD Windows (dwg2bmp) detectado em ${foundPath}`);
                execOptions.cwd = path.dirname(foundPath);
                foundDwgInfoPath = foundPath.replace("dwg2bmp.bat", "dwginfo.bat");
              }
            } else {
              const linuxPaths = ["/opt/qcad/dwg2bmp", "/usr/bin/dwg2bmp"];
              for (const p of linuxPaths) {
                try {
                  await fs.access(p);
                  foundPath = p;
                  break;
                } catch {}
              }
              if (foundPath) {
                log(`QCAD Linux (dwg2bmp) detectado em ${foundPath}`);
                execOptions.cwd = path.dirname(foundPath);
                foundDwgInfoPath = foundPath.replace("dwg2bmp", "dwginfo");
              }
            }

            // EXTREME DISCOVERY: Executar dwginfo para listar os blocos (layouts) do desenho!
            let dwgBlocks: string[] = [];
            if (foundPath && foundDwgInfoPath) {
              try {
                log(`[QCAD] Executando dwginfo para detectar layouts: ${foundDwgInfoPath}`);
                let infoCommand = `"${foundDwgInfoPath}" -b "${savedFilePath}"`;
                if (process.platform !== "win32") {
                  infoCommand = `xvfb-run -a "${foundDwgInfoPath}" -platform offscreen -b "${savedFilePath}"`;
                }
                const rawBlocks = execSync(infoCommand, execOptions).toString();
                dwgBlocks = rawBlocks.split("\n")
                  .map(s => s.trim())
                  .filter(s => {
                    if (!s) return false;
                    // Ignorar cabeçalhos do QCAD Trial
                    if (s.includes("QCAD") || s.includes("Usage") || s.includes("Options") || s.includes("Min") || s.includes("Error") || s.includes("trial") || s.includes("purchase") || s.includes("license") || s.includes("Online Shop") || s.includes("Thank you") || s.includes("seconds")) {
                      return false;
                    }
                    // Ignorar sub-blocos XREF (que contêm $) ou blocos anônimos inúteis (que começam com *U)
                    if (s.includes("$") || (s.startsWith("*") && !s.startsWith("*Paper_Space") && !s.startsWith("*Model_Space"))) {
                      return false;
                    }
                    return true;
                  });
                log(`[QCAD] Blocos parsed e filtrados com sucesso: ${JSON.stringify(dwgBlocks)}`);
              } catch (infoErr: any) {
                log(`[QCAD] Falha ao listar blocos com dwginfo: ${infoErr.message}`);
              }
            }

            // Auto-detectar o bloco/layout prioritário para renderização
            let targetBlock = "";
            if (dwgBlocks.length > 0) {
              // 1. Procurar por nomes de blocos/layouts contendo termos comuns de plantas
              const keywords = ["riser", "prancha", "planta", "layout", "pavimento", "survey", "site", "cobertura", "terreo", "térreo", "folha", "quadro"];
              for (const kw of keywords) {
                const found = dwgBlocks.find(b => b.toLowerCase().includes(kw) && !b.startsWith("*"));
                if (found) {
                  targetBlock = found;
                  log(`[QCAD] Auto-detectado bloco de layout prioritário: "${targetBlock}" (keyword: "${kw}")`);
                  break;
                }
              }
              
              // 2. Fallback para Layouts padrão
              if (!targetBlock) {
                const standardLayouts = ["layout1", "layout2", "folha1", "folha"];
                for (const sl of standardLayouts) {
                  const found = dwgBlocks.find(b => b.toLowerCase() === sl);
                  if (found) {
                    targetBlock = found;
                    log(`[QCAD] Auto-detectado layout padrão: "${targetBlock}"`);
                    break;
                  }
                }
              }

              // 3. Fallback para Paper Space genérico
              if (!targetBlock) {
                const paperSpace = dwgBlocks.find(b => b.startsWith("*Paper_Space"));
                if (paperSpace) {
                  targetBlock = paperSpace;
                  log(`[QCAD] Auto-detectado Paper Space genérico: "${targetBlock}"`);
                }
              }
            }

            if (foundPath) {
              if (targetBlock) {
                log(`[QCAD] Configurando exportação focada no bloco/layout: "${targetBlock}"`);
                if (process.platform === "win32") {
                  command = `"${foundPath}" -f -a -b black -block="${targetBlock}" -zoom-all -width=2400 -o "${tempPngFilePath}" "${savedFilePath}"`;
                } else {
                  command = `xvfb-run -a "${foundPath}" -platform offscreen -f -a -b black -block="${targetBlock}" -zoom-all -width=2400 -o "${tempPngFilePath}" "${savedFilePath}"`;
                }
              } else {
                log(`[QCAD] Nenhuma folha de layout encontrada. Renderizando Model Space padrão...`);
                if (process.platform === "win32") {
                  command = `"${foundPath}" -f -a -b black -zoom-all -width=2400 -o "${tempPngFilePath}" "${savedFilePath}"`;
                } else {
                  command = `xvfb-run -a "${foundPath}" -platform offscreen -f -a -b black -zoom-all -width=2400 -o "${tempPngFilePath}" "${savedFilePath}"`;
                }
              }
            }

            // Cálculo de timeout dinâmico proporcional ao tamanho do DWG (60s base + 45s por MB, limite de 8 minutos)
            const fileSizeMB = buffer.length / (1024 * 1024);
            const dynamicTimeoutMs = Math.min(Math.max(Math.round(60 + fileSizeMB * 45) * 1000, 120000), 480000);
            log(`[QCAD] Tamanho do DWG: ${fileSizeMB.toFixed(2)} MB. Definindo timeout de segurança dinâmico de ${(dynamicTimeoutMs / 1000)}s.`);
            log(`[QCAD] Executando comando com monitoramento ativo de estabilidade: ${command}`);
            
            try {
              await new Promise<void>((resolve, reject) => {
                let safetyTimeout: any;
                let checkInterval: any;
                
                const cleanResolve = () => {
                  clearInterval(checkInterval);
                  clearTimeout(safetyTimeout);
                  resolve();
                };
                
                const cleanReject = (err: Error) => {
                  clearInterval(checkInterval);
                  clearTimeout(safetyTimeout);
                  reject(err);
                };

                const childProcess = exec(command, execOptions, (error, stdout, stderr) => {
                  log(`[QCAD] Processo finalizado naturalmente.`);
                  cleanResolve();
                });

                let lastSize = 0;
                let stableCount = 0;
                
                const killProcess = () => {
                  try {
                    if (process.platform === "win32") {
                      execSync(`taskkill /pid ${childProcess.pid} /f /t`);
                    } else {
                      childProcess.kill("SIGKILL");
                    }
                    log(`[QCAD Monitor] taskkill concluído com sucesso no PID ${childProcess.pid}.`);
                  } catch (e: any) {
                    log(`[QCAD Monitor] Erro ao matar processo QCAD Trial: ${e.message}`);
                  }
                };

                checkInterval = setInterval(async () => {
                  try {
                    const exists = await fs.access(tempPngFilePath).then(() => true).catch(() => false);
                    if (exists) {
                      const stat = await fs.stat(tempPngFilePath);
                      log(`[QCAD Monitor] PNG em disco: ${stat.size} bytes...`);
                      if (stat.size > 1000 && stat.size === lastSize) {
                        stableCount++;
                        if (stableCount >= 3) {
                          log(`[QCAD Monitor] Gravação do PNG concluída com sucesso com ${stat.size} bytes. Liberando processo.`);
                          killProcess();
                          cleanResolve();
                        }
                      } else {
                        lastSize = stat.size;
                        stableCount = 0;
                      }
                    }
                  } catch (err) {}
                }, 2000);

                safetyTimeout = setTimeout(() => {
                  log(`[QCAD Monitor] Timeout de segurança de ${(dynamicTimeoutMs / 1000)}s atingido.`);
                  killProcess();
                  cleanReject(new Error(`Timeout de ${(dynamicTimeoutMs / 1000)}s atingido durante a conversão do QCAD.`));
                }, dynamicTimeoutMs);
              });
            } catch (execErr: any) {
              log(`[QCAD] Falha ou Timeout na execução: ${execErr.message}`);
              try {
                await fs.unlink(tempPngFilePath);
                log(`[QCAD] Arquivo PNG malformado/truncado removido do disco.`);
              } catch {}
            }

            const stat = await fs.stat(tempPngFilePath);
            log(`[QCAD] Tamanho do PNG gerado após execução: ${stat.size} bytes.`);
            if (stat.size > 100) {
              // Copiar arquivo da pasta temporária para a pasta final
              await fs.copyFile(tempPngFilePath, svgFilePath);
              try {
                await fs.unlink(tempPngFilePath);
              } catch {}

              bgDxfUrl = `/uploads/${svgFileName}`;
              bgImageData = bgDxfUrl;
              bgMimeType = "image/png";
              bgDebugMethod = "AutoCAD QCAD dwg2bmp PNG Converter";
              log(`[QCAD] SUCESSO! PNG gerado e verificado com ${stat.size} bytes.`);
            }
          } catch (e: any) {
            log(`[QCAD] Falhou completamente: ${e.message}`);
          }
        }

        // D. Fallback Final
        if (!bgImageData) {
          bgDxfUrl = `/uploads/${savedFileName}`;
          bgImageData = bgDxfUrl;
          bgMimeType = file.type || "image/png";
          bgDebugMethod = "Direct File Asset Access";
          log(`[Background Fallback] Servindo arquivo original.`);
        }

        // Escrever status completo final de sucesso!
        await fs.writeFile(statusFilePath, JSON.stringify({ 
          status: "completed", 
          url: bgDxfUrl, 
          mimeType: bgMimeType, 
          method: bgDebugMethod 
        }), "utf-8");

      } catch (bgCrash: any) {
        log(`[Background Crash] Falha grave: ${bgCrash.message}`);
        try {
          await fs.writeFile(statusFilePath, JSON.stringify({ 
            status: "failed", 
            error: bgCrash.message || "Falha grave interna." 
          }), "utf-8");
        } catch {}
      } finally {
        try {
          const debugLogPath = path.join(process.cwd(), "scratch", "conversion_debug.log");
          await fs.writeFile(debugLogPath, conversionLog.join("\n"), "utf-8");
        } catch {}
      }
    })();

    // Retorno imediato
    return NextResponse.json({
      success: true,
      pending: true,
      fileId,
      fileName: file.name
    });

  } catch (error: any) {
    console.error("[Site Survey API] Processing crash:", error);
    try {
      const debugLogPath = path.join(process.cwd(), "scratch", "conversion_debug.log");
      await fs.writeFile(debugLogPath, [...conversionLog, `CRASH: ${error.message || error}`].join("\n"), "utf-8");
    } catch (err) {}
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Erro desconhecido ao processar arquivo.",
        conversionLog
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID inválido ou não fornecido." }, { status: 400 });
    }
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const statusPath = path.join(uploadsDir, `${id}_status.json`);
    
    try {
      const statusContent = await fs.readFile(statusPath, "utf-8");
      return NextResponse.json(JSON.parse(statusContent));
    } catch {
      // Fallback
      const svgPath = path.join(uploadsDir, `${id}.svg`);
      const dxfPath = path.join(uploadsDir, `${id}.dxf`);
      
      try {
        await fs.access(svgPath);
        return NextResponse.json({ status: "completed", url: `/uploads/${id}.svg` });
      } catch {
        try {
          await fs.access(dxfPath);
          return NextResponse.json({ status: "completed", url: `/uploads/${id}.dxf` });
        } catch {
          return NextResponse.json({ status: "processing", progress: 20 });
        }
      }
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
