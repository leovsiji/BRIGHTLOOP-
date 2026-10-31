import axios from 'axios';
import {
  MOCK_PRODUCTS,
  MOCK_PLANS,
  MOCK_SUBSCRIPTIONS,
  MOCK_CUSTOMERS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_DISCOUNTS,
  MOCK_STAFF,
  MOCK_TAX_CONFIG,
  MOCK_QUOTATIONS,
  MOCK_ANALYTICS,
  MOCK_CURRENT_CUSTOMER,
  MOCK_ADMIN_USER
} from './mockData';

// Base URL configured for Django REST Framework backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Set this to true to use mock data when Django backend is not running
const ALWAYS_USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor to attach JWT / DRF token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brightloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      localStorage.removeItem('brightloop_token');
    }
    return Promise.reject(error);
  }
);

// Simulated network delay helper for realistic loading states
const mockDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// 1. AUTHENTICATION SERVICE
// ==========================================
export const authApi = {
  login: async (credentials) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(300);
      const isAdmin = credentials.email?.toLowerCase().includes('admin');
      const user = isAdmin ? MOCK_ADMIN_USER : { ...MOCK_CURRENT_CUSTOMER, email: credentials.email || MOCK_CURRENT_CUSTOMER.email };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('brightloop_token', token);
      localStorage.setItem('brightloop_user', JSON.stringify(user));
      return { token, user };
    }
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (userData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(350);
      const newUser = {
        id: 'cust-' + Date.now(),
        name: userData.name || `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        company: userData.company || 'New Venture',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        activeSubscriptionsCount: 0,
        totalSpent: 0
      };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('brightloop_token', token);
      localStorage.setItem('brightloop_user', JSON.stringify(newUser));
      return { token, user: newUser };
    }
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const saved = localStorage.getItem('brightloop_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return MOCK_ADMIN_USER;
  },

  logout: async () => {
    localStorage.removeItem('brightloop_token');
    localStorage.removeItem('brightloop_user');
  }
};

// ==========================================
// 2. PRODUCTS SERVICE
// ==========================================
export const productsApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_PRODUCTS];
    }
    try {
      const response = await apiClient.get('/products/');
      return response.data;
    } catch {
      return [...MOCK_PRODUCTS];
    }
  },

  getById: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(150);
      return MOCK_PRODUCTS.find((p) => p.id === id);
    }
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
  },

  create: async (productData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(300);
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...productData,
        totalSubscribers: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      MOCK_PRODUCTS.unshift(newProduct);
      return newProduct;
    }
    const response = await apiClient.post('/products/', productData);
    return response.data;
  },

  update: async (id, productData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...productData };
        return MOCK_PRODUCTS[idx];
      }
      return productData;
    }
    const response = await apiClient.put(`/products/${id}/`, productData);
    return response.data;
  },

  delete: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PRODUCTS.splice(idx, 1);
      }
      return { success: true };
    }
    const response = await apiClient.delete(`/products/${id}/`);
    return response.data;
  }
};

// ==========================================
// 3. PLANS SERVICE
// ==========================================
export const plansApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_PLANS];
    }
    try {
      const response = await apiClient.get('/subscriptions/plans/');
      return response.data;
    } catch {
      return [...MOCK_PLANS];
    }
  },

  create: async (planData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const newPlan = {
        id: `plan-${Date.now()}`,
        ...planData
      };
      MOCK_PLANS.unshift(newPlan);
      return newPlan;
    }
    const response = await apiClient.post('/subscriptions/plans/', planData);
    return response.data;
  },

  update: async (id, planData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const idx = MOCK_PLANS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PLANS[idx] = { ...MOCK_PLANS[idx], ...planData };
        return MOCK_PLANS[idx];
      }
      return planData;
    }
    const response = await apiClient.put(`/subscriptions/plans/${id}/`, planData);
    return response.data;
  },

  delete: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      const idx = MOCK_PLANS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PLANS.splice(idx, 1);
      }
      return { success: true };
    }
    const response = await apiClient.delete(`/subscriptions/plans/${id}/`);
    return response.data;
  }
};

// ==========================================
// 4. SUBSCRIPTIONS SERVICE
// ==========================================
export const subscriptionsApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_SUBSCRIPTIONS];
    }
    try {
      const response = await apiClient.get('/subscriptions/');
      return response.data;
    } catch {
      return [...MOCK_SUBSCRIPTIONS];
    }
  },

  getCustomerSubscriptions: async (customerId) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    }
    try {
      const response = await apiClient.get(`/subscriptions/?customer=${customerId}`);
      return response.data;
    } catch {
      return MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
    }
  },

  pause: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
      if (sub) sub.status = 'Paused';
      return sub;
    }
    const response = await apiClient.post(`/subscriptions/${id}/pause/`);
    return response.data;
  },

  renew: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
      if (sub) {
        sub.status = 'Active';
        sub.expiryDate = '2026-10-31';
      }
      return sub;
    }
    const response = await apiClient.post(`/subscriptions/${id}/renew/`);
    return response.data;
  },

  cancel: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
      if (sub) sub.status = 'Canceled';
      return sub;
    }
    const response = await apiClient.post(`/subscriptions/${id}/cancel/`);
    return response.data;
  }
};

// ==========================================
// 5. CUSTOMERS SERVICE
// ==========================================
export const customersApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_CUSTOMERS];
    }
    try {
      const response = await apiClient.get('/accounts/customers/');
      return response.data;
    } catch {
      return [...MOCK_CUSTOMERS];
    }
  },

  getById: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(150);
      return MOCK_CUSTOMERS.find((c) => c.id === id);
    }
    const response = await apiClient.get(`/accounts/customers/${id}/`);
    return response.data;
  },

  create: async (customerData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const newCust = {
        id: `cust-${Date.now()}`,
        ...customerData,
        activeSubscriptionsCount: 0,
        totalSpent: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      MOCK_CUSTOMERS.unshift(newCust);
      return newCust;
    }
    const response = await apiClient.post('/accounts/customers/', customerData);
    return response.data;
  }
};

// ==========================================
// 6. INVOICES SERVICE
// ==========================================
export const invoicesApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_INVOICES];
    }
    try {
      const response = await apiClient.get('/billing/invoices/');
      return response.data;
    } catch {
      return [...MOCK_INVOICES];
    }
  },

  getCustomerInvoices: async (customerId) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return MOCK_INVOICES.filter((inv) => inv.customerId === customerId);
    }
    try {
      const response = await apiClient.get(`/billing/invoices/?customer=${customerId}`);
      return response.data;
    } catch {
      return MOCK_INVOICES.filter((inv) => inv.customerId === customerId);
    }
  },

  payInvoice: async (invoiceId) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(300);
      const inv = MOCK_INVOICES.find((i) => i.id === invoiceId);
      if (inv) {
        inv.status = 'Paid';
        inv.paidAt = new Date().toLocaleString();
      }
      return inv;
    }
    const response = await apiClient.post(`/billing/invoices/${invoiceId}/pay/`);
    return response.data;
  }
};

// ==========================================
// 7. PAYMENTS SERVICE
// ==========================================
export const paymentsApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_PAYMENTS];
    }
    try {
      const response = await apiClient.get('/billing/payments/');
      return response.data;
    } catch {
      return [...MOCK_PAYMENTS];
    }
  },

  refund: async (paymentId) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const p = MOCK_PAYMENTS.find((item) => item.id === paymentId);
      if (p) p.status = 'Refunded';
      return p;
    }
    const response = await apiClient.post(`/billing/payments/${paymentId}/refund/`);
    return response.data;
  }
};

// ==========================================
// 8. DISCOUNTS SERVICE
// ==========================================
export const discountsApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_DISCOUNTS];
    }
    try {
      const response = await apiClient.get('/billing/discounts/');
      return response.data;
    } catch {
      return [...MOCK_DISCOUNTS];
    }
  },

  create: async (discountData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const newDisc = {
        id: `disc-${Date.now()}`,
        ...discountData,
        usageCount: 0,
        status: 'Active'
      };
      MOCK_DISCOUNTS.unshift(newDisc);
      return newDisc;
    }
    const response = await apiClient.post('/billing/discounts/', discountData);
    return response.data;
  },

  toggleStatus: async (id) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(150);
      const disc = MOCK_DISCOUNTS.find((d) => d.id === id);
      if (disc) {
        disc.status = disc.status === 'Active' ? 'Disabled' : 'Active';
      }
      return disc;
    }
    const response = await apiClient.post(`/billing/discounts/${id}/toggle/`);
    return response.data;
  }
};

// ==========================================
// 9. ANALYTICS SERVICE
// ==========================================
export const analyticsApi = {
  getOverview: async (range = '30d') => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return { ...MOCK_ANALYTICS, range };
    }
    try {
      const response = await apiClient.get(`/analytics/overview/?range=${range}`);
      return response.data;
    } catch {
      return { ...MOCK_ANALYTICS, range };
    }
  }
};

// ==========================================
// 10. STAFF MANAGEMENT SERVICE
// ==========================================
export const staffApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_STAFF];
    }
    try {
      const response = await apiClient.get('/accounts/staff/');
      return response.data;
    } catch {
      return [...MOCK_STAFF];
    }
  },

  create: async (staffData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const newStaff = {
        id: `staff-${Date.now()}`,
        ...staffData,
        status: 'Active',
        lastActive: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      MOCK_STAFF.unshift(newStaff);
      return newStaff;
    }
    const response = await apiClient.post('/accounts/staff/', staffData);
    return response.data;
  }
};

// ==========================================
// 11. TAX & BILLING SERVICE
// ==========================================
export const taxBillingApi = {
  getConfig: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return { ...MOCK_TAX_CONFIG };
    }
    try {
      const response = await apiClient.get('/billing/config/');
      return response.data;
    } catch {
      return { ...MOCK_TAX_CONFIG };
    }
  },

  updateSettings: async (settings) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      MOCK_TAX_CONFIG.billingSettings = {
        ...MOCK_TAX_CONFIG.billingSettings,
        ...settings
      };
      return MOCK_TAX_CONFIG.billingSettings;
    }
    const response = await apiClient.put('/billing/config/', settings);
    return response.data;
  },

  addTaxRate: async (rateData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      const newRate = {
        id: `tax-${Date.now()}`,
        ...rateData
      };
      MOCK_TAX_CONFIG.taxRates.push(newRate);
      return newRate;
    }
    const response = await apiClient.post('/billing/tax-rates/', rateData);
    return response.data;
  }
};

// ==========================================
// 12. QUOTATION TEMPLATES SERVICE
// ==========================================
export const quotationsApi = {
  getAll: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return [...MOCK_QUOTATIONS];
    }
    try {
      const response = await apiClient.get('/billing/quotations/');
      return response.data;
    } catch {
      return [...MOCK_QUOTATIONS];
    }
  },

  create: async (quotationData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      const newQuot = {
        id: `quot-${Date.now()}`,
        ...quotationData,
        status: 'Active',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      MOCK_QUOTATIONS.unshift(newQuot);
      return newQuot;
    }
    const response = await apiClient.post('/billing/quotations/', quotationData);
    return response.data;
  }
};

// ==========================================
// 13. CUSTOMER PORTAL SERVICE
// ==========================================
export const customerPortalApi = {
  getProfile: async () => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(200);
      return { ...MOCK_CURRENT_CUSTOMER };
    }
    const response = await apiClient.get('/accounts/profile/');
    return response.data;
  },

  updateProfile: async (data) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(250);
      Object.assign(MOCK_CURRENT_CUSTOMER, data);
      return { ...MOCK_CURRENT_CUSTOMER };
    }
    const response = await apiClient.put('/accounts/profile/', data);
    return response.data;
  },

  createTicket: async (ticketData) => {
    if (ALWAYS_USE_MOCK) {
      await mockDelay(300);
      const newTicket = {
        id: `tkt-${Date.now()}`,
        ...ticketData,
        status: 'Open',
        date: new Date().toISOString().split('T')[0]
      };
      MOCK_CURRENT_CUSTOMER.tickets.unshift(newTicket);
      return newTicket;
    }
    const response = await apiClient.post('/support/tickets/', ticketData);
    return response.data;
  }
};

export default apiClient;
