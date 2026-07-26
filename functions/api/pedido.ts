/// <reference types="@cloudflare/workers-types" />
import { crearRegistro, json, type Env } from '../_shared/airtable';

interface ItemPedido {
  id: string;
  nombre: string;
  precio: number;
  qty: number;
}

const MAX_ITEMS = 50;
const MAX_TEXTO = 8000;

const ENVIO_OPCIONES = ['Delivery Huánuco', 'Envío nacional - Olva Courier', 'Envío nacional - Shalom'];
const PAGO_OPCIONES = ['Yape', 'Plin', 'Transferencia', 'Contra entrega'];

function validarItems(items: unknown): items is ItemPedido[] {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) return false;
  return items.every(
    (i) =>
      i &&
      typeof i.nombre === 'string' &&
      i.nombre.length > 0 &&
      i.nombre.length <= 120 &&
      typeof i.precio === 'number' &&
      Number.isFinite(i.precio) &&
      i.precio > 0 &&
      typeof i.qty === 'number' &&
      Number.isFinite(i.qty) &&
      i.qty > 0
  );
}

function texto(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

const money = (n: number) => 'S/ ' + (Math.round(n * 100) / 100).toFixed(2);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const raw = await request.text();
  if (raw.length > MAX_TEXTO) return json({ ok: false }, 400);

  let body: {
    cliente?: unknown;
    whatsapp?: unknown;
    direccion?: unknown;
    distrito?: unknown;
    referencia?: unknown;
    envio?: unknown;
    pago?: unknown;
    items?: unknown;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false }, 400);
  }

  if (!validarItems(body.items)) return json({ ok: false, error: 'Items inválidos' }, 400);
  const items = body.items;

  const cliente = texto(body.cliente, 120);
  const whatsapp = texto(body.whatsapp, 20);
  const direccion = texto(body.direccion, 200);
  const distrito = texto(body.distrito, 100);
  const referencia = texto(body.referencia, 200);
  const envio = texto(body.envio, 60);
  const pago = texto(body.pago, 40);

  if (!cliente || !whatsapp || !direccion || !distrito) {
    return json({ ok: false, error: 'Faltan datos de contacto/envío' }, 400);
  }
  if (!ENVIO_OPCIONES.includes(envio) || !PAGO_OPCIONES.includes(pago)) {
    return json({ ok: false, error: 'Opción de envío o pago inválida' }, 400);
  }
  if (pago === 'Contra entrega' && envio !== 'Delivery Huánuco') {
    return json({ ok: false, error: 'Contra entrega solo disponible en Huánuco' }, 400);
  }

  const total = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const itemsTexto = items.map((i) => `${i.qty}x ${i.nombre} — ${money(i.precio * i.qty)}`).join('\n');

  try {
    await crearRegistro(env, 'Pedidos', {
      Cliente: cliente,
      WhatsApp: whatsapp,
      Items: itemsTexto,
      Total: Math.round(total * 100) / 100,
      Estado: 'Nuevo',
      Origen: 'Web - Carrito',
      Dirección: direccion,
      Distrito: distrito,
      Referencia: referencia || undefined,
      Envío: envio,
      Pago: pago,
    });
  } catch (err) {
    console.error('Error guardando pedido en Airtable', err);
    return json({ ok: false }, 502);
  }

  return json({ ok: true });
};
