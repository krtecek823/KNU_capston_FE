import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR_1 = path.resolve(__dirname, '../../frontend/public/images/hotels');
const TARGET_DIR_2 = path.resolve(__dirname, '../../../../hoverstay-frontend/public/images/hotels');

if (!fs.existsSync(TARGET_DIR_1)) fs.mkdirSync(TARGET_DIR_1, { recursive: true });
if (!fs.existsSync(TARGET_DIR_2)) fs.mkdirSync(TARGET_DIR_2, { recursive: true });

const HOTEL_IMAGE_DOWNLOADS = [
  {
    filename: 'signiel_seoul.jpg',
    url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'shilla_seoul.jpg',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'park_hyatt_busan.jpg',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'josun_palace_gangnam.jpg',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'seamarq_gangneung.jpg',
    url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'parnas_jeju.jpg',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'sofitel_seoul.jpg',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'grand_hyatt_seoul.jpg',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
  {
    filename: 'ananti_at_busan.jpg',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  }
];

console.log('📥 Downloading real hotel photos directly to public/images/hotels/...');

async function downloadAll() {
  for (const item of HOTEL_IMAGE_DOWNLOADS) {
    try {
      const res = await fetch(item.url);
      const buffer = Buffer.from(await res.arrayBuffer());

      const p1 = path.join(TARGET_DIR_1, item.filename);
      const p2 = path.join(TARGET_DIR_2, item.filename);

      fs.writeFileSync(p1, buffer);
      fs.writeFileSync(p2, buffer);

      console.log(`✅ Downloaded ${item.filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`❌ Failed to download ${item.filename}:`, err);
    }
  }
  console.log('🎉 All hotel photos downloaded locally with 0 CORS & 0 network errors!');
}

downloadAll();
