import axios from 'axios';

const GLPI_API_URL = process.env.GLPI_API_URL || 'http://192.168.67.95/apirest.php';
const GLPI_USER = process.env.GLPI_USER || 'glpi';
const GLPI_PASSWORD = process.env.GLPI_PASSWORD || 'glpi';
const GLPI_APP_TOKEN = process.env.GLPI_APP_TOKEN || '';
const GLPI_DEFAULT_PROFILE_ID = Number(process.env.GLPI_DEFAULT_PROFILE_ID || '1');

// Helper to set headers
function getHeaders(sessionToken?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (GLPI_APP_TOKEN) {
    headers['App-Token'] = GLPI_APP_TOKEN;
  }
  if (sessionToken) {
    headers['Session-Token'] = sessionToken;
  }
  return headers;
}

// 1. Initialize session in GLPI
async function initSession(): Promise<string> {
  const headers = getHeaders();
  const auth = Buffer.from(`${GLPI_USER}:${GLPI_PASSWORD}`).toString('base64');
  headers['Authorization'] = `Basic ${auth}`;

  try {
    const url = `${GLPI_API_URL}/initSession/`;
    console.log(`[GLPI] Initializing session at ${url}`);
    const res = await axios.get(url, { headers, timeout: 5000 });
    if (res.data && res.data.session_token) {
      return res.data.session_token;
    }
    throw new Error('No session token returned from GLPI');
  } catch (err: any) {
    console.error('[GLPI] Error initializing session:', err.response?.data || err.message);
    throw err;
  }
}

// 2. Kill session to release resources
async function killSession(sessionToken: string): Promise<void> {
  const headers = getHeaders(sessionToken);
  try {
    await axios.get(`${GLPI_API_URL}/killSession/`, { headers, timeout: 3000 });
    console.log('[GLPI] Session killed successfully');
  } catch (err: any) {
    console.warn('[GLPI] Error killing session:', err.message);
  }
}

// 3. Find or create Entity
async function findOrCreateEntity(sessionToken: string, name: string): Promise<number> {
  const headers = getHeaders(sessionToken);
  const cleanName = name.trim();
  if (!cleanName || cleanName.toLowerCase() === 'root') return 0; // Root entity in GLPI is 0

  try {
    // Search for entity using extended range
    const searchUrl = `${GLPI_API_URL}/Entity/?range=0-1000`;
    const res = await axios.get(searchUrl, { headers, timeout: 5000 });
    
    if (Array.isArray(res.data) && res.data.length > 0) {
      // Find exact match
      const found = res.data.find((e: any) => e.name.toLowerCase() === cleanName.toLowerCase());
      if (found) {
        console.log(`[GLPI] Found existing entity "${cleanName}" with ID ${found.id}`);
        return Number(found.id);
      }
    }

    // Create entity if not found
    console.log(`[GLPI] Entity "${cleanName}" not found. Creating...`);
    const createUrl = `${GLPI_API_URL}/Entity/`;
    const createRes = await axios.post(createUrl, {
      input: { name: cleanName }
    }, { headers, timeout: 5000 });

    if (createRes.data && createRes.data.id) {
      console.log(`[GLPI] Created entity "${cleanName}" with ID ${createRes.data.id}`);
      return Number(createRes.data.id);
    }
    throw new Error(`Failed to create entity ${cleanName}`);
  } catch (err: any) {
    console.error(`[GLPI] Error findOrCreateEntity for "${cleanName}":`, err.response?.data || err.message);
    return 0; // Fallback to root entity
  }
}

// 4. Find or create User, and link them to Entity
async function findOrCreateUser(
  sessionToken: string,
  username: string,
  realname: string,
  email: string | null,
  entityId: number
): Promise<number> {
  const headers = getHeaders(sessionToken);
  const cleanUsername = username.trim();
  if (!cleanUsername) throw new Error('Username cannot be empty');

  try {
    // Search for User using extended range
    const searchUrl = `${GLPI_API_URL}/User/?range=0-1000`;
    const res = await axios.get(searchUrl, { headers, timeout: 5000 });

    let userId: number | null = null;

    if (Array.isArray(res.data) && res.data.length > 0) {
      const found = res.data.find((u: any) => u.name.toLowerCase() === cleanUsername.toLowerCase());
      if (found) {
        console.log(`[GLPI] Found existing user "${cleanUsername}" with ID ${found.id}`);
        userId = Number(found.id);
      }
    }

    // Create User if not found
    if (!userId) {
      console.log(`[GLPI] User "${cleanUsername}" not found in GLPI. Creating...`);
      const createUrl = `${GLPI_API_URL}/User/`;
      
      // Split realname into firstname and realname (surname)
      const nameParts = realname.trim().split(/\s+/);
      const firstname = nameParts[0] || 'Operador';
      const surname = nameParts.slice(1).join(' ') || 'NOC';
      
      // Generate a strong temporary password to comply with GLPI internal user policies
      const tempPassword = Math.random().toString(36).substring(2, 11) + "X9!@";

      const createRes = await axios.post(createUrl, {
        input: {
          name: cleanUsername,
          password: tempPassword,
          realname: surname,
          firstname: firstname,
          is_active: 1
        }
      }, { headers, timeout: 5000 });

      if (createRes.data && createRes.data.id) {
        userId = Number(createRes.data.id);
        console.log(`[GLPI] Created user "${cleanUsername}" with ID ${userId}`);

        // Add email to user if provided
        if (email && email.trim()) {
          try {
            console.log(`[GLPI] Adding email ${email} to user ID ${userId}`);
            await axios.post(`${GLPI_API_URL}/User/${userId}/UserEmail/`, {
              input: {
                users_id: userId,
                email: email.trim(),
                is_default: 1
              }
            }, { headers, timeout: 3000 });
          } catch (mailErr: any) {
            console.warn('[GLPI] Failed to associate email with user:', mailErr.message);
          }
        }

        // Link User to Entity with Profile
        try {
          console.log(`[GLPI] Linking user ID ${userId} to Entity ${entityId} with Profile ID ${GLPI_DEFAULT_PROFILE_ID}`);
          await axios.post(`${GLPI_API_URL}/Profile_User/`, {
            input: {
              users_id: userId,
              profiles_id: GLPI_DEFAULT_PROFILE_ID,
              entities_id: entityId,
              is_recursive: 1
            }
          }, { headers, timeout: 3500 });
        } catch (profileErr: any) {
          console.warn('[GLPI] Failed to link user to profile/entity:', profileErr.message);
        }
      } else {
        throw new Error(`Failed to create user ${cleanUsername}`);
      }
    }

    return userId;
  } catch (err: any) {
    console.error(`[GLPI] Error findOrCreateUser for "${cleanUsername}":`, err.response?.data || err.message);
    throw err;
  }
}

// 5. High-level function to integrate OS creation with GLPI
export async function createGlpiTicketForOs(params: {
  osId: string;
  site: string;
  equipment: string;
  ip: string;
  description: string;
  urgency: string; // BAIXA, MEDIA, ALTA, CRITICA
  requesterUsername: string;
  requesterName: string;
  requesterEmail: string | null;
  companyName: string;
}) {
  let sessionToken = '';
  try {
    sessionToken = await initSession();
    
    // Map urgency level
    let glpiUrgency = 3; // Medium
    if (params.urgency === 'BAIXA') glpiUrgency = 2;
    else if (params.urgency === 'MEDIA') glpiUrgency = 3;
    else if (params.urgency === 'ALTA') glpiUrgency = 4;
    else if (params.urgency === 'CRITICA') glpiUrgency = 5;

    // Get or create Entity in GLPI matching the Client/Company
    const entityId = await findOrCreateEntity(sessionToken, params.companyName || 'Root');

    // Get or create User in GLPI matching the logged in user
    const userId = await findOrCreateUser(
      sessionToken,
      params.requesterUsername,
      params.requesterName,
      params.requesterEmail,
      entityId
    );

    // Garante que o usuário esteja vinculado à entidade caso ele já existisse anteriormente
    if (userId && entityId >= 0) {
      try {
        console.log(`[GLPI] Ensuring user ID ${userId} is linked to Entity ${entityId}`);
        await axios.post(`${GLPI_API_URL}/Profile_User/`, {
          input: {
            users_id: userId,
            profiles_id: GLPI_DEFAULT_PROFILE_ID,
            entities_id: entityId,
            is_recursive: 1
          }
        }, { headers, timeout: 3000 });
      } catch (linkErr: any) {
        // Ignora erro de relação já existente ou permissão
        console.log(`[GLPI] Note: Link user check: ${linkErr.message}`);
      }
    }

    // Prepare ticket title and description
    const ticketTitle = `[NOC OS] ${params.osId} - Site: ${params.site}`;
    
    // Convert newlines to breaks for HTML content in GLPI
    const formattedDesc = (params.description || 'Nenhuma descrição fornecida.').replace(/\n/g, '<br/>');

    const ticketContent = `
<h2>Ordem de Serviço Integrada</h2>
<p><strong>Nº OS:</strong> ${params.osId}</p>
<p><strong>Site:</strong> ${params.site}</p>
<p><strong>Equipamento:</strong> ${params.equipment} (${params.ip})</p>
<p><strong>Urgência:</strong> ${params.urgency}</p>
<hr/>
<p><strong>Descrição da Ocorrência:</strong></p>
<p>${formattedDesc}</p>
<br/>
<p><em>Enviado automaticamente pelo Portal NOC (Ricas Tecnologia).</em></p>
    `.trim();

    // Create the ticket in GLPI
    console.log(`[GLPI] Creating ticket for user ID ${userId} and entity ID ${entityId}`);
    const headers = getHeaders(sessionToken);
    const ticketRes = await axios.post(`${GLPI_API_URL}/Ticket/`, {
      input: {
        name: ticketTitle,
        content: ticketContent,
        urgency: glpiUrgency,
        entities_id: entityId,
        _users_id_requester: userId
      }
    }, { headers, timeout: 5000 });

    if (ticketRes.data && ticketRes.data.id) {
      const ticketId = Number(ticketRes.data.id);
      console.log(`[GLPI] Ticket created successfully with ID ${ticketId}`);

      // Vincula explicitamente o requerente na tabela de atores do chamado (Ticket_User, type: 1)
      try {
        console.log(`[GLPI] Linking requester actor user ID ${userId} to Ticket ID ${ticketId}`);
        await axios.post(`${GLPI_API_URL}/Ticket/${ticketId}/Ticket_User/`, {
          input: {
            tickets_id: ticketId,
            users_id: userId,
            type: 1 // 1 = Requester
          }
        }, { headers, timeout: 3000 });
        console.log(`[GLPI] Requester actor linked successfully.`);
      } catch (actorErr: any) {
        console.warn(`[GLPI] Warning: Failed to link requester actor:`, actorErr.response?.data || actorErr.message);
      }

      return { success: true, glpiTicketId: ticketId };
    }
    throw new Error('GLPI did not return a valid Ticket ID');
  } catch (err: any) {
    console.error('[GLPI Integration] Failed to create ticket:', err.response?.data || err.message);
    return { success: false, error: err.message };
  } finally {
    if (sessionToken) {
      await killSession(sessionToken).catch(() => {});
    }
  }
}

export async function syncUserPasswordToGlpi(
  username: string,
  plainTextPassword?: string,
  realname?: string,
  email?: string | null,
  companyName?: string
) {
  let sessionToken = '';
  try {
    sessionToken = await initSession();
    const headers = getHeaders(sessionToken);
    
    const cleanUsername = username.trim();
    if (!cleanUsername) return;

    // 1. Resolve entity ID
    const entityId = await findOrCreateEntity(sessionToken, companyName || 'Root');

    // 2. Search for existing user in GLPI
    const searchUrl = `${GLPI_API_URL}/User/?range=0-1000`;
    const res = await axios.get(searchUrl, { headers, timeout: 5000 });

    let userId: number | null = null;

    if (Array.isArray(res.data) && res.data.length > 0) {
      const found = res.data.find((u: any) => u.name.toLowerCase() === cleanUsername.toLowerCase());
      if (found) {
        userId = Number(found.id);
      }
    }

    const nameParts = (realname || cleanUsername).trim().split(/\s+/);
    const firstname = nameParts[0] || 'Operador';
    const surname = nameParts.slice(1).join(' ') || 'NOC';

    if (!userId) {
      // Create user
      console.log(`[GLPI Sync] Creating new user "${cleanUsername}" in GLPI with synced password`);
      const createUrl = `${GLPI_API_URL}/User/`;
      const createRes = await axios.post(createUrl, {
        input: {
          name: cleanUsername,
          password: plainTextPassword || 'DefaultNocPass123!',
          realname: surname,
          firstname: firstname,
          is_active: 1
        }
      }, { headers, timeout: 5000 });

      if (createRes.data && createRes.data.id) {
        userId = Number(createRes.data.id);
        console.log(`[GLPI Sync] Created user "${cleanUsername}" with ID ${userId}`);

        // Add email
        if (email && email.trim()) {
          try {
            await axios.post(`${GLPI_API_URL}/User/${userId}/UserEmail/`, {
              input: {
                users_id: userId,
                email: email.trim(),
                is_default: 1
              }
            }, { headers, timeout: 3000 });
          } catch (mailErr: any) {
            console.warn('[GLPI Sync] Failed to associate email:', mailErr.message);
          }
        }
      }
    } else {
      // User already exists, update their password if plainTextPassword is provided
      if (plainTextPassword) {
        console.log(`[GLPI Sync] Updating password for existing user "${cleanUsername}" (ID: ${userId})`);
        try {
          await axios.put(`${GLPI_API_URL}/User/${userId}`, {
            input: {
              id: userId,
              password: plainTextPassword
            }
          }, { headers, timeout: 5000 });
          console.log(`[GLPI Sync] Password updated successfully for user ID ${userId}`);
        } catch (updateErr: any) {
          console.error(`[GLPI Sync] Error updating password for user ID ${userId}:`, updateErr.response?.data || updateErr.message);
        }
      }
    }

    // Link user to Entity and Profile (recursive)
    if (userId && entityId >= 0) {
      try {
        console.log(`[GLPI Sync] Linking/updating user ID ${userId} to Entity ${entityId}`);
        await axios.post(`${GLPI_API_URL}/Profile_User/`, {
          input: {
            users_id: userId,
            profiles_id: GLPI_DEFAULT_PROFILE_ID,
            entities_id: entityId,
            is_recursive: 1
          }
        }, { headers, timeout: 3000 });
      } catch (linkErr: any) {
        // Ignore already linked error
      }
    }

  } catch (err: any) {
    console.error(`[GLPI Sync] Error syncing user password for "${username}":`, err.response?.data || err.message);
  } finally {
    if (sessionToken) {
      await killSession(sessionToken).catch(() => {});
    }
  }
}

