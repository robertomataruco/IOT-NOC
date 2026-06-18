import fs from 'fs';
import path from 'path';

const imagePath = 'C:\\Users\\rmataruco\\.gemini\\antigravity\\brain\\c66f15ed-ca3e-4577-a110-89c434d61ecc\\media__1781282019857.png';
const outputPath = 'c:\\Users\\rmataruco\\OneDrive\\Projeto NOVO ZABBIX\\zabbix-dashboard\\public\\process-logo.html';

try {
  const base64 = fs.readFileSync(imagePath, { encoding: 'base64' });
  const srcBase64 = `data:image/png;base64,${base64}`;
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Process Logo</title>
</head>
<body style="background: #0f172a; color: white; font-family: sans-serif; display: flex; flex-col; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <div style="text-align: center;">
    <h2>Processador de Logo - Ricas IOT NOC</h2>
    <canvas id="canvas" style="border: 1px solid #334155; margin-bottom: 20px; max-width: 100%;"></canvas>
    <div id="status">Processando...</div>
  </div>
  <script>
    const img = new Image();
    img.src = "${srcBase64}";
    img.onload = function() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          
          if (y < 6 || y > canvas.height - 10 || x < 4 || x > canvas.width - 4) {
            // Remove borders/artifacts completely
            data[i+3] = 0;
          } else {
            // Alpha set to Red value (perfect white extraction)
            data[i+3] = r;
          }
          
          // Force color to white
          data[i] = 255;
          data[i+1] = 255;
          data[i+2] = 255;
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      const processedBase64 = canvas.toDataURL('image/png');
      
      document.getElementById('status').innerText = "Salvando no servidor...";
      
      fetch('/api/temp-save-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: processedBase64 })
      })
      .then(res => res.json())
      .then(res => {
        console.log("Logo saved!", res);
        document.getElementById('status').innerHTML = "<h3 style='color: #22c55e;'>Logo processado e salvo com sucesso!</h3>";
      })
      .catch(err => {
        document.getElementById('status').innerHTML = "<h3 style='color: #ef4444;'>Erro ao salvar: " + err.message + "</h3>";
      });
    };
  </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, htmlContent);
  console.log(`Successfully generated HTML processor at: ${outputPath}`);
} catch (err) {
  console.error("Error generating HTML processor:", err);
}
