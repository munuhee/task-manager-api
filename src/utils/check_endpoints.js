const http = require('http');
const { URL } = require('url');

const BASE = process.env.BASE_URL || 'http://localhost:3000';

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const lib = url.protocol === 'https:' ? require('https') : require('http');

    const body = data ? JSON.stringify(data) : null;
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body ? Buffer.byteLength(body) : 0,
      },
      timeout: 5000,
    };

    const req = lib.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        let parsed = chunks;
        try {
          parsed = JSON.parse(chunks);
        } catch (e) {
          // keep raw
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy(new Error('Request timed out'));
    });

    if (body) req.write(body);
    req.end();
  });
}

async function runChecks() {
  console.log(`Base URL: ${BASE}`);

  try {
    console.log('\n1) GET /');
    const root = await request('GET', '/');
    console.log('Status:', root.status);
    console.log('Body:', root.body);
  } catch (e) {
    console.error('Root check failed:', e.message);
  }

  // Use a timestamped email to avoid collisions
  const ts = Date.now();
  const email = `check${ts}@example.com`;
  const password = 'password123';

  try {
    console.log('\n2) POST /api/auth/register');
    const reg = await request('POST', '/api/auth/register', {
      username: `check${ts}`,
      email,
      password,
    });
    console.log('Status:', reg.status);
    console.log('Body:', reg.body);

    if (reg.body && reg.body.token) {
      const token = reg.body.token;
      console.log('\n3) POST /api/auth/login');
      const login = await request('POST', '/api/auth/login', {
        email,
        password,
      });
      console.log('Status:', login.status);
      console.log('Body:', login.body);

      if (login.body && login.body.token) {
        const t = login.body.token;
        console.log('\n4) POST /api/tasks (create)');
        const task = await request('POST', '/api/tasks', {
          title: 'Healthcheck Task',
          description: 'Created by healthcheck script',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          priority: 'medium',
        });
        console.log('Status:', task.status);
        console.log('Body:', task.body);

        console.log('\n5) GET /api/tasks');
        const tasks = await request('GET', '/api/tasks');
        console.log('Status:', tasks.status);
        console.log('Body:', tasks.body);
      }
    }
  } catch (e) {
    console.error('Auth/Tasks checks failed:', e.message);
  }
}

if (require.main === module) {
  runChecks();
}

module.exports = { runChecks };
