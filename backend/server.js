import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
const DB_FILE = path.join(__dirname, 'db.json');

const loadDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialDB = { users: [], bookings: [], hotels: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return { users: [], bookings: [], hotels: [] };
  }
};

const saveDB = (db) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
};

const sendJSON = (res, status, data) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight Handler
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const url = req.url || '';
  const method = req.method || 'GET';

  console.log(`[Backend Server 5001] ${method} ${url}`);

  try {
    // 1. Health Check
    if (url === '/api/health' && method === 'GET') {
      return sendJSON(res, 200, { status: 'ok', message: 'HoverStay REST API Backend Server Running' });
    }

    // 2. Hotels: Get All (from crawled Agoda/Booking.com DB)
    if (url.startsWith('/api/hotels') && method === 'GET') {
      const db = loadDB();
      const queryParams = new URL(url, `http://localhost:${PORT}`).searchParams;
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

    // 3. Auth: Register
    if (url === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return sendJSON(res, 400, { success: false, message: '성함, 이메일, 비밀번호를 모두 입력해 주세요.' });
      }

      const db = loadDB();
      const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        return sendJSON(res, 400, { success: false, message: '이미 가입된 이메일 주소입니다.' });
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
      };

      db.users.push(newUser);
      saveDB(db);

      return sendJSON(res, 200, {
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: { name: newUser.name, email: newUser.email },
      });
    }

    // 4. Auth: Login
    if (url === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJSON(res, 400, { success: false, message: '이메일과 비밀번호를 입력해 주세요.' });
      }

      const db = loadDB();
      const matched = db.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matched) {
        return sendJSON(res, 401, {
          success: false,
          message: '등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.',
        });
      }

      return sendJSON(res, 200, {
        success: true,
        token: `token_${matched.id}_${Date.now()}`,
        user: { name: matched.name, email: matched.email },
      });
    }

    // 5. Booking: Create
    if (url === '/api/bookings' && method === 'POST') {
      const body = await parseBody(req);
      const db = loadDB();

      const bookingId = `HSV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking = {
        id: bookingId,
        hotelId: body.hotelId,
        hotelName: body.hotelName,
        hotelLocation: body.hotelLocation,
        hotelImage: body.hotelImage,
        roomName: body.roomName,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        nights: body.nights || 1,
        userName: body.userName,
        userPhone: body.userPhone,
        userEmail: body.userEmail || 'guest@hoverstay.com',
        paymentMethod: body.paymentMethod,
        totalPrice: body.totalPrice,
        createdAt: new Date().toLocaleDateString(),
        status: 'COMPLETED',
      };

      db.bookings.unshift(newBooking);
      saveDB(db);

      return sendJSON(res, 200, { success: true, booking: newBooking });
    }

    // 6. Booking: Get All / Filtered by email
    if (url.startsWith('/api/bookings') && method === 'GET') {
      const db = loadDB();
      const queryParams = new URL(url, `http://localhost:${PORT}`).searchParams;
      const userEmail = queryParams.get('email');

      let result = db.bookings;
      if (userEmail) {
        result = db.bookings.filter(
          (b) => b.userEmail.toLowerCase() === userEmail.toLowerCase()
        );
      }

      return sendJSON(res, 200, { success: true, bookings: result });
    }

    // 7. Booking: Cancel
    if (url === '/api/bookings/cancel' && method === 'POST') {
      const body = await parseBody(req);
      const { bookingId } = body;

      const db = loadDB();
      const target = db.bookings.find((b) => b.id === bookingId);

      if (!target) {
        return sendJSON(res, 404, { success: false, message: '해당 예약을 찾을 수 없습니다.' });
      }

      target.status = 'CANCELLED';
      saveDB(db);

      return sendJSON(res, 200, { success: true, message: '예약이 정상적으로 취소되었습니다.' });
    }

    // 404 Fallback
    sendJSON(res, 404, { success: false, message: 'Endpoint not found' });
  } catch (err) {
    console.error('[Backend Server Error]', err);
    sendJSON(res, 500, { success: false, message: err.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`✅ HoverStay Backend REST API Server is running on http://localhost:${PORT}`);
});
