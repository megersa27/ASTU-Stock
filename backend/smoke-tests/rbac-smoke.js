const BASE = process.env.BASE_URL || 'http://localhost:5000/api';

const pretty = (t) => JSON.stringify(t, null, 2);

const login = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

const getUsers = async (token) => {
  const res = await fetch(`${BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { status: res.status, body: await res.json() };
};

const forgot = async (email) => {
  const res = await fetch(`${BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

const run = async () => {
  console.log('Starting RBAC smoke tests against', BASE);

  console.log('Logging in as admin...');
  const admin = await login('admin@astu.edu.et', 'password123');
  if (!admin?.token) {
    console.error('Admin login failed:', pretty(admin));
    process.exit(2);
  }
  console.log('Admin token acquired');

  console.log('GET /users as admin');
  const usersAsAdmin = await getUsers(admin.token);
  console.log('Status:', usersAsAdmin.status);
  console.log('Body:', pretty(usersAsAdmin.body));

  console.log('Logging in as storekeeper...');
  const store = await login('megersa@astu.edu.et', 'password123');
  if (!store?.token) {
    console.error('Storekeeper login failed:', pretty(store));
    process.exit(2);
  }

  console.log('GET /users as storekeeper (expect 403)');
  const usersAsStore = await getUsers(store.token);
  console.log('Status:', usersAsStore.status);
  console.log('Body:', pretty(usersAsStore.body));

  console.log('Request forgot-password for admin');
  const forgotRes = await forgot('admin@astu.edu.et');
  console.log('Forgot response:', pretty(forgotRes));

  console.log('RBAC smoke tests completed');
};

run().catch((err) => {
  console.error('Smoke test failed:', err);
  process.exit(1);
});
