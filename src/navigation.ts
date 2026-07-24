import { getPermalink } from './utils/permalinks';

const WHATSAPP = '51991505772';
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const headerData = {
  links: [
    { text: 'Inicio', href: getPermalink('/') },
    { text: 'Catálogo', href: getPermalink('/#catalogo') },
    { text: 'Peluches', href: getPermalink('/#peluches') },
    { text: 'Novedades', href: getPermalink('/#novedades') },
    { text: 'Contacto', href: getPermalink('/#contacto') },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Tienda',
      links: [
        { text: '🧸 Peluches', href: getPermalink('/#catalogo') },
        { text: '✨ Novedades', href: getPermalink('/#catalogo') },
        { text: '🔥 Lo más viral', href: getPermalink('/#catalogo') },
      ],
    },
    {
      title: 'Ayuda',
      links: [
        { text: 'Cómo comprar', href: getPermalink('/#contacto') },
        { text: 'Delivery en Huánuco', href: getPermalink('/#contacto') },
        { text: 'Envíos a todo el Perú', href: getPermalink('/#contacto') },
        { text: 'Pedir por WhatsApp', href: waLink('Hola ABC Tendencia 🐼'), target: '_blank' },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/abc.tendencia' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/share/1cAL7LMnkk/' },
    { ariaLabel: 'TikTok', icon: 'tabler:brand-tiktok', href: 'https://www.tiktok.com/@abc.tendencia' },
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: waLink('Hola ABC Tendencia 🐼') },
  ],
  footNote: `
    <span class="opacity-80">© 2026 ABC Tendencia · Peluches y novedades en Huánuco, Perú · Delivery en Huánuco y envíos a todo el Perú 🇵🇪</span>
  `,
};
