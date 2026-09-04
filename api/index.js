import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const DB_FILE = path.resolve(process.cwd(), 'backend/db.json');

const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [], bookings: [], hotels: [] };
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return { users: [], bookings: [], hotels: [] };
  }
};

const saveDB = (db) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    // Read-only filesystem handling on serverless Vercel
  }
};

const sendJSON = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
};

const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const url = req.url || '';
  const method = req.method || 'GET';

  try {
    if (url.includes('/api/health') && method === 'GET') {
      return sendJSON(res, 200, { status: 'ok', message: 'HoverStay Vercel API Serverless Handler Active' });
    }

    if (url.includes('/api/hotels') && method === 'GET') {
      const db = loadDB();
      const queryParams = new URL(url, 'https://hoverstay.vercel.app').searchParams;
      const query = queryParams.get('q');
      const idMatch = url.match(/\/api\/hotels\/([a-zA-Z0-9-]+)/);

      if (idMatch && idMatch[1]) {
        const hotelId = idMatch[1];
        const target = (db.hotels || []).find((h) => h.id === hotelId);
        if (target) {
          return sendJSON(res, 200, { success: true, hotel: target });
        }
        return sendJSON(res, 404, { success: false, message: '숙소를 찾을 수 없습니다.' });
      }

      let hotelsList = db.hotels || [];
      if (query) {
        const lower = query.toLowerCase();
        hotelsList = hotelsList.filter(
          (h) =>
            h.name.toLowerCase().includes(lower) ||
            h.location.toLowerCase().includes(lower) ||
            (h.tags && h.tags.some((t) => t.toLowerCase().includes(lower)))
        );
      }

      return sendJSON(res, 200, { success: true, hotels: hotelsList });
    }

    if (url.includes('/api/auth/register') && method === 'POST') {
      const body = await parseBody(req);
      const { name, email, password } = body;
      if (!name || !email || !password) {
        return sendJSON(res, 400, { success: false, message: '성함, 이메일, 비밀번호를 모두 입력해 주세요.' });
      }
      const db = loadDB();
      const newUser = { id: `usr_${Date.now()}`, name, email: email.toLowerCase(), password };
      db.users.push(newUser);
      saveDB(db);
      return sendJSON(res, 200, { success: true, message: '회원가입이 완료되었습니다.', user: { name, email } });
    }

    if (url.includes('/api/auth/login') && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;
      const db = loadDB();
      const matched = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
      return sendJSON(res, 200, {
        success: true,
        token: `token_${Date.now()}`,
        user: { name: matched ? matched.name : (email || '').split('@')[0], email },
      });
    }

    if (url.includes('/api/bookings') && method === 'POST') {
      const body = await parseBody(req);
      const db = loadDB();
      const bookingId = `HSV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking = { id: bookingId, ...body, status: 'COMPLETED' };
      db.bookings.unshift(newBooking);
      saveDB(db);
      return sendJSON(res, 200, { success: true, booking: newBooking });
    }

    if (url.includes('/api/bookings') && method === 'GET') {
      const db = loadDB();
      return sendJSON(res, 200, { success: true, bookings: db.bookings || [] });
    }

    sendJSON(res, 404, { success: false, message: 'Endpoint not found' });
  } catch (err) {
    sendJSON(res, 500, { success: false, message: err.message || 'Internal Server Error' });
  }
}
