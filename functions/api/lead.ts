/// <reference types="@cloudflare/workers-types" />
import { crearRegistro, json, type Env } from '../_shared/airtable';

const MAX_TEXTO = 4000;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const raw = await request.text();
  if (raw.length > MAX_TEXTO) return json({ ok: false }, 400);

  let body: { nombre?: unknown; whatsapp?: unknown; mensaje?: unknown; sitio_web?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false }, 400);
  }

  // Honeypot: si un bot llenó este campo oculto, fingimos éxito sin escribir nada.
  if (typeof body.sitio_web === 'string' && body.sitio_web.trim() !== '') {
    return json({ ok: true });
  }

  const nombre = typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 120) : '';
  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.trim().slice(0, 20) : '';
  const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim().slice(0, 500) : '';

  if (!nombre || !whatsapp) return json({ ok: false, error: 'Faltan datos' }, 400);

  try {
    await crearRegistro(env, 'Leads', {
      Nombre: nombre,
      WhatsApp: whatsapp,
      Mensaje: mensaje || undefined,
      Estado: 'Nuevo',
    });
  } catch (err) {
    console.error('Error guardando lead en Airtable', err);
    return json({ ok: false }, 502);
  }

  return json({ ok: true });
};
