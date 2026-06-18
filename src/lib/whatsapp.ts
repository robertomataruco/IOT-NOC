import axios from 'axios';

export async function sendWhatsAppMessage(phone: string, text: string) {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const instanceName = process.env.EVOLUTION_API_INSTANCE;
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!apiUrl || !instanceName || !apiKey) {
    console.warn('⚠️ Credenciais da Evolution API ausentes no .env.local. Notificação via WhatsApp ignorada.');
    return;
  }

  // Remove qualquer caractere que não seja dígito do telefone
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone) return;

  const endpoint = `${apiUrl}/message/sendText/${instanceName}`;

  try {
    const response = await axios.post(
      endpoint,
      {
        number: cleanPhone,
        text: text
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey
        }
      }
    );

    console.log(`✅ Notificação WhatsApp enviada para ${cleanPhone}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Erro ao enviar WhatsApp para ${cleanPhone}:`, error.message || error);
    if (error.response) {
      console.error('Detalhes Evolution API:', error.response.data);
    }
  }
}
