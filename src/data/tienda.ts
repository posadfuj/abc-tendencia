export const WHATSAPP = '51991505772';
export const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
export const descuento = (precio: number, antes?: number) =>
  antes && antes > precio ? Math.round((1 - precio / antes) * 100) : null;
