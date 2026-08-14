// src/mocks/handlers.js
import { http, HttpResponse, delay } from 'msw';

// --------------------------------------------------------------
// 1. FAKE DATABASES (Stored in memory)
// --------------------------------------------------------------
let users = [
  { id: 1, email: 'demo@test.com', password: 'password123' }, // Default user
];

let invoices = [
  { id: 1, customer: "Acme Corp", total: 1200, vatRate: 20, vatAmount: 240, status: "Paid" },
  { id: 2, customer: "Beta Ltd", total: 150, vatRate: 5, vatAmount: 7.5, status: "Pending" },
];

// Helper to find a user by email
const findUser = (email) => users.find((u) => u.email === email);

// --------------------------------------------------------------
// 2. API HANDLERS
// --------------------------------------------------------------
export const handlers = [
  // --- REGISTER (Create a new account) ---
  http.post('/api/register', async ({ request }) => {
    const { email, password } = await request.json();

    // Check if user already exists
    if (findUser(email)) {
      return HttpResponse.json(
        { message: 'User already exists!' },
        { status: 400 }
      );
    }

    // Create new user (in real life, we'd hash the password)
    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);

    return HttpResponse.json(
      { message: 'Registration successful! Please login.' },
      { status: 201 }
    );
  }),

  // --- LOGIN (Authenticate user) ---
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    const user = findUser(email);

    // Check credentials
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: 'Invalid email or password!' },
        { status: 401 }
      );
    }

    // Generate a fake JWT token (just a random string for testing)
    const fakeToken = `fake-jwt-token-${Date.now()}`;

    return HttpResponse.json({
      token: fakeToken,
      user: { id: user.id, email: user.email },
    });
  }),

  // --- GET INVOICES (PROTECTED - Requires Token) ---
  http.get('/api/invoices', async ({ request }) => {
    await delay(500); // Simulate network delay

    // Check for Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 }); // Unauthorized
    }

    // If token exists, return the invoices
    return HttpResponse.json(invoices);
  }),

  // --- POST INVOICES (PROTECTED - Requires Token) ---
  http.post('/api/invoices', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const newInvoice = await request.json();
    const vatRate = newInvoice.vatRate || 20;
    const vatAmount = (newInvoice.total * vatRate) / 100;

    const created = {
      id: invoices.length + 1,
      ...newInvoice,
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      status: "Pending",
    };
    invoices.push(created);

    return HttpResponse.json(created, { status: 201 });
  }),
];