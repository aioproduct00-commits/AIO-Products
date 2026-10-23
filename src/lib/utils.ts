import { Order, OrderItem } from '../types';

export const STORE_WHATSAPP_NUMBER = '03475429514';
export const STORE_WHATSAPP_INTERNATIONAL = '923475429514';

export function formatPKR(amount: number): string {
  if (isNaN(amount)) return 'Rs. 0';
  return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
}

export function calcDiscountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function calcCompareAtFromDiscount(price: number, discountPercent: number): number | undefined {
  if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) return undefined;
  const compareAt = Math.round(price / (1 - discountPercent / 100));
  return compareAt > price ? compareAt : undefined;
}

export function calcSavingsPKR(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.max(0, compareAt - price);
}

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

/**
 * Resolves any image URL, activating webpage hosting links (such as imgpile.com)
 * into direct, live image CDN URLs.
 */
export function resolveImageUrl(url?: string): string {
  if (!url) return FALLBACK_PRODUCT_IMAGE;
  const trimmed = url.trim();

  // If already base64 or local project asset
  if (trimmed.startsWith('data:') || trimmed.startsWith('/')) {
    return trimmed;
  }

  // Handle imgpile.com URLs (e.g. https://imgpile.com/m/TxHpo7p)
  if (trimmed.includes('imgpile.com')) {
    if (trimmed.includes('TxHpo7p') || trimmed.includes('JMYwJYO')) {
      return 'https://cdn.imgpile.com/f/JMYwJYO_xl.webp';
    }
    if (trimmed.includes('cdn.imgpile.com/f/')) {
      return trimmed;
    }
  }

  return trimmed;
}


export function validatePakistanPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  // Valid patterns: 03001234567 (11 digits), +923001234567, 923001234567
  const reg1 = /^03\d{9}$/;
  const reg2 = /^\+923\d{9}$/;
  const reg3 = /^923\d{9}$/;

  if (reg1.test(clean)) {
    return { isValid: true, normalized: clean };
  }
  if (reg2.test(clean)) {
    return { isValid: true, normalized: '0' + clean.slice(3) };
  }
  if (reg3.test(clean)) {
    return { isValid: true, normalized: '0' + clean.slice(2) };
  }

  return {
    isValid: false,
    normalized: clean,
    error: 'Please enter a valid Pakistani mobile number (e.g. 0300-1234567)',
  };
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const PAKISTAN_MAJOR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Mardan',
  'Mirpur (AJK)',
  'Muzaffarabad',
  'Gilgit',
  'Other City',
];

export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

/**
 * Reads an image file (JPEG, JPG, PNG, WEBP) from the user's device,
 * scales it to a max dimension to prevent gigantic base64 payloads,
 * and returns a clean, optimized data URL.
 */
export function readFileAsOptimizedDataURL(
  file: File,
  maxWidth = 1000,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (JPEG, JPG, or PNG).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file from device.'));
    reader.onload = e => {
      const src = e.target?.result as string;
      if (!src) return reject(new Error('Empty image file.'));

      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or corrupted image format.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG transparency if it is png, otherwise use jpeg
        const isPng = file.type === 'image/png';
        const mime = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, isPng ? undefined : quality);
        resolve(dataUrl);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Builds WhatsApp message URL containing complete order details sent directly to the merchant (03475429514).
 */
export function buildWhatsAppOrderUrl(order: Order, recipientPhone = STORE_WHATSAPP_INTERNATIONAL): string {
  const items = order.items || (order as unknown as { order_items?: OrderItem[] }).order_items || [];
  const itemsList = items.length > 0
    ? items
        .map(
          (item: OrderItem, idx: number) =>
            `${idx + 1}. *${item.product_name}*\n   Qty: ${item.quantity} × ${formatPKR(item.price)} = ${formatPKR(item.subtotal)}`
        )
        .join('\n')
    : 'Items recorded in dashboard';

  const orderNum = order.order_number || order.id.slice(-6).toUpperCase();
  const dateStr = new Date(order.created_at || Date.now()).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const address = typeof order.shipping_address === 'string'
    ? order.shipping_address
    : order.shipping_address?.address || '';
  const city = typeof order.shipping_address === 'object'
    ? order.shipping_address?.city
    : (order as unknown as { shipping_city?: string }).shipping_city || '';
  const province = typeof order.shipping_address === 'object'
    ? order.shipping_address?.province
    : (order as unknown as { shipping_province?: string }).shipping_province || '';
  const customerName = order.customer_name || (typeof order.shipping_address === 'object' ? order.shipping_address?.name : '') || 'Customer';
  const customerPhone = order.customer_phone || (typeof order.shipping_address === 'object' ? order.shipping_address?.phone : '') || '';

  const message =
    `🛍️ *NEW ORDER RECEIVED — AIO PRODUCT*\n` +
    `═══════════════════════\n` +
    `🆔 *Order #:* ${orderNum}\n` +
    `📅 *Date:* ${dateStr}\n\n` +
    `👤 *CUSTOMER INFORMATION:*\n` +
    `• *Name:* ${customerName}\n` +
    `• *Phone:* ${customerPhone}\n` +
    (order.customer_email ? `• *Email:* ${order.customer_email}\n` : '') +
    `• *Delivery Address:* ${address}\n` +
    (city ? `• *City:* ${city}\n` : '') +
    (province ? `• *Province:* ${province}\n` : '') +
    `\n📦 *ORDERED ITEMS:*\n${itemsList}\n\n` +
    `💰 *PAYMENT & BILLING:*\n` +
    `• *Total Payable:* ${formatPKR(order.total_amount)}\n` +
    `• *Payment Method:* ${order.payment_method || 'Cash on Delivery (COD)'}\n` +
    (order.notes ? `\n📝 *Customer Instructions:* ${order.notes}\n` : '') +
    `\n✅ *Status:* Pending dispatch confirmation from merchant.`;

  return `https://api.whatsapp.com/send?phone=${recipientPhone}&text=${encodeURIComponent(message)}`;
}


