// BRIGHTLOOP - Realistic SaaS Mock Data for DRF backend preparation
// All data structures mirror expected Django REST Framework serializers

export const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'BrightCloud Enterprise Core',
    description: 'High-availability enterprise cloud synchronization and secure data storage suite.',
    sku: 'BC-ENT-01',
    type: 'SaaS License',
    sellingPrice: 199.00,
    costPrice: 65.00,
    status: 'Active',
    variants: [
      { id: 'v1', name: 'Starter (10 Seats)', seats: 10, price: 99.00 },
      { id: 'v2', name: 'Pro (50 Seats)', seats: 50, price: 199.00 },
      { id: 'v3', name: 'Enterprise (Unlimited)', seats: 999, price: 499.00 }
    ],
    totalSubscribers: 1420,
    category: 'Cloud Services',
    createdAt: '2025-01-15'
  },
  {
    id: 'prod-002',
    name: 'PulseAnalytics Pro',
    description: 'Real-time telemetry, user event streaming and advanced conversion funnel analytics.',
    sku: 'PA-PRO-02',
    type: 'Digital Service',
    sellingPrice: 79.00,
    costPrice: 22.00,
    status: 'Active',
    variants: [
      { id: 'v4', name: '100k events/mo', seats: 5, price: 79.00 },
      { id: 'v5', name: '1M events/mo', seats: 20, price: 189.00 }
    ],
    totalSubscribers: 890,
    category: 'Analytics',
    createdAt: '2025-02-10'
  },
  {
    id: 'prod-003',
    name: 'SecureShield Identity Gateway',
    description: 'Zero-trust enterprise SSO, SAML2/OIDC provider and adaptive MFA security barrier.',
    sku: 'SS-ID-03',
    type: 'SaaS License',
    sellingPrice: 149.00,
    costPrice: 40.00,
    status: 'Active',
    variants: [
      { id: 'v6', name: 'Standard Gateway', seats: 25, price: 149.00 },
      { id: 'v7', name: 'FedRAMP Compliant', seats: 100, price: 349.00 }
    ],
    totalSubscribers: 610,
    category: 'Security',
    createdAt: '2025-03-01'
  },
  {
    id: 'prod-004',
    name: 'OmniFlow Automations API',
    description: 'Webhook router, workflow step orchestrator and automated business task runner.',
    sku: 'OF-API-04',
    type: 'API Access',
    sellingPrice: 49.00,
    costPrice: 12.00,
    status: 'Active',
    variants: [
      { id: 'v8', name: '10,000 runs/mo', seats: 2, price: 49.00 },
      { id: 'v9', name: '100,000 runs/mo', seats: 10, price: 129.00 }
    ],
    totalSubscribers: 1150,
    category: 'Developer Tools',
    createdAt: '2025-03-20'
  },
  {
    id: 'prod-005',
    name: '24/7 Dedicated Concierge Support',
    description: 'Priority 15-minute SLA ticketing, dedicated technical account manager, and live triage.',
    sku: 'CS-SUP-05',
    type: 'Support Service',
    sellingPrice: 299.00,
    costPrice: 150.00,
    status: 'Active',
    variants: [
      { id: 'v10', name: 'Standard SLA (1h)', seats: 0, price: 149.00 },
      { id: 'v11', name: 'VIP SLA (15m)', seats: 0, price: 299.00 }
    ],
    totalSubscribers: 280,
    category: 'Services',
    createdAt: '2025-04-05'
  },
  {
    id: 'prod-006',
    name: 'DataVault Backup Glacier Add-on',
    description: 'Immutable WORM compliant snapshot archive with instant disaster recovery rollback.',
    sku: 'DV-BCK-06',
    type: 'Cloud Add-on',
    sellingPrice: 39.00,
    costPrice: 8.00,
    status: 'Inactive',
    variants: [
      { id: 'v12', name: '500 GB Storage', seats: 0, price: 39.00 },
      { id: 'v13', name: '5 TB Storage', seats: 0, price: 159.00 }
    ],
    totalSubscribers: 190,
    category: 'Storage',
    createdAt: '2025-04-18'
  }
];

export const MOCK_PLANS = [
  {
    id: 'plan-001',
    name: 'Starter Tier',
    code: 'PLN-START',
    description: 'Ideal for early-stage teams wanting reliable billing and core integrations.',
    productId: 'prod-001',
    productName: 'BrightCloud Enterprise Core',
    billingCycle: 'Monthly',
    price: 49.00,
    currency: 'USD',
    minimumQuantity: 1,
    trialPeriodDays: 14,
    availabilityStart: '2025-01-01',
    availabilityEnd: '2027-12-31',
    status: 'Active',
    popular: false,
    features: [
      'Up to 5 team members',
      '10,000 monthly operations',
      'Standard SSL & Encryption',
      'Community & Email support (48h SLA)',
      'Basic reports & exports'
    ]
  },
  {
    id: 'plan-002',
    name: 'Professional Tier',
    code: 'PLN-PRO',
    description: 'Best for rapidly scaling SaaS companies with growing transaction volume.',
    productId: 'prod-001',
    productName: 'BrightCloud Enterprise Core',
    billingCycle: 'Monthly',
    price: 149.00,
    currency: 'USD',
    minimumQuantity: 1,
    trialPeriodDays: 14,
    availabilityStart: '2025-01-01',
    availabilityEnd: '2027-12-31',
    status: 'Active',
    popular: true,
    features: [
      'Up to 25 team members',
      'Unlimited operations',
      'Advanced telemetry & custom metrics',
      'Priority email & chat support (4h SLA)',
      'Automated dunning & recurring tax calculation',
      'Custom webhook triggers & API rate boost'
    ]
  },
  {
    id: 'plan-003',
    name: 'Enterprise Scale',
    code: 'PLN-ENT',
    description: 'For large organizations demanding custom SLAs, dedicated infrastructure & audits.',
    productId: 'prod-001',
    productName: 'BrightCloud Enterprise Core',
    billingCycle: 'Yearly',
    price: 1590.00,
    currency: 'USD',
    minimumQuantity: 5,
    trialPeriodDays: 30,
    availabilityStart: '2025-01-01',
    availabilityEnd: '2028-12-31',
    status: 'Active',
    popular: false,
    features: [
      'Unlimited team members & seats',
      'Dedicated VPC & database cluster',
      'Custom SAML/SSO with Okta/Azure AD',
      '24/7/365 Phone & Slack connect (15m SLA)',
      'Dedicated Technical Account Manager',
      'Custom contractual terms & BAA/SOC2 compliance'
    ]
  },
  {
    id: 'plan-004',
    name: 'PulseAnalytics Growth',
    code: 'PLN-PULSE-MO',
    description: 'Dedicated analytics pipeline with cohort analysis and custom retention funnels.',
    productId: 'prod-002',
    productName: 'PulseAnalytics Pro',
    billingCycle: 'Monthly',
    price: 89.00,
    currency: 'USD',
    minimumQuantity: 1,
    trialPeriodDays: 7,
    availabilityStart: '2025-02-01',
    availabilityEnd: '2027-12-31',
    status: 'Active',
    popular: false,
    features: [
      '1 Million tracked events',
      'Funnel & retention visualizations',
      'CSV / JSON automated daily exports',
      'Segment & Mixpanel bi-directional sync'
    ]
  },
  {
    id: 'plan-005',
    name: 'Weekly Sprint Pass',
    code: 'PLN-SPRINT',
    description: 'Short term project licensing for contractors and agile development teams.',
    productId: 'prod-004',
    productName: 'OmniFlow Automations API',
    billingCycle: 'Weekly',
    price: 25.00,
    currency: 'USD',
    minimumQuantity: 1,
    trialPeriodDays: 3,
    availabilityStart: '2025-03-01',
    availabilityEnd: '2026-12-31',
    status: 'Active',
    popular: false,
    features: [
      'Unlimited test workflows',
      '7-day burst concurrency',
      'Fast sandbox provisioning'
    ]
  },
  {
    id: 'plan-006',
    name: 'Legacy Cloud Basic',
    code: 'PLN-LEGACY',
    description: 'Deprecated plan maintained strictly for grandfathered grandfathered contracts.',
    productId: 'prod-001',
    productName: 'BrightCloud Enterprise Core',
    billingCycle: 'Monthly',
    price: 29.00,
    currency: 'USD',
    minimumQuantity: 1,
    trialPeriodDays: 0,
    availabilityStart: '2024-01-01',
    availabilityEnd: '2025-01-01',
    status: 'Archived',
    popular: false,
    features: [
      'Basic cloud sync',
      'Grandfathered support tier'
    ]
  }
];

export const MOCK_CUSTOMERS = [
  {
    id: 'cust-001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmecorp.io',
    company: 'Acme Corporation',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    tier: 'Enterprise',
    activeSubscriptionsCount: 3,
    totalSpent: 4890.00,
    joinedDate: '2025-01-12',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    billingAddress: '450 Mission Street, Suite 800, San Francisco, CA 94105, USA',
    taxId: 'US-EIN-9847291'
  },
  {
    id: 'cust-002',
    name: 'David Miller',
    email: 'd.miller@stratosai.tech',
    company: 'Stratos AI Labs',
    phone: '+1 (555) 876-5432',
    status: 'Active',
    tier: 'Professional',
    activeSubscriptionsCount: 2,
    totalSpent: 1788.00,
    joinedDate: '2025-02-04',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    billingAddress: '100 King St West, Toronto, ON M5X 1A9, Canada',
    taxId: 'CA-GST-4491204'
  },
  {
    id: 'cust-003',
    name: 'Elena Rostova',
    email: 'elena@nordicvibe.se',
    company: 'Nordic Vibe Design Studio',
    phone: '+46 8 123 4567',
    status: 'Active',
    tier: 'Professional',
    activeSubscriptionsCount: 1,
    totalSpent: 894.00,
    joinedDate: '2025-02-28',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    billingAddress: 'Drottninggatan 12, Stockholm 111 51, Sweden',
    taxId: 'SE-556123456701'
  },
  {
    id: 'cust-004',
    name: 'Marcus Vance',
    email: 'm.vance@vancemetrics.com',
    company: 'Vance Metrics Group',
    phone: '+1 (555) 432-1098',
    status: 'Pending',
    tier: 'Starter',
    activeSubscriptionsCount: 1,
    totalSpent: 147.00,
    joinedDate: '2025-03-14',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    billingAddress: '1200 6th Ave, Seattle, WA 98101, USA',
    taxId: 'US-EIN-3184920'
  },
  {
    id: 'cust-005',
    name: 'Chloe Laurent',
    email: 'chloe.l@luminafinance.fr',
    company: 'Lumina FinTech SAS',
    phone: '+33 1 42 68 55 00',
    status: 'Active',
    tier: 'Enterprise',
    activeSubscriptionsCount: 2,
    totalSpent: 3580.00,
    joinedDate: '2025-03-25',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    billingAddress: '8 Rue de la Paix, 75002 Paris, France',
    taxId: 'FR-94819284729'
  },
  {
    id: 'cust-006',
    name: 'Kenji Takahashi',
    email: 'k.takahashi@nexuskyoto.co.jp',
    company: 'Nexus Kyoto Software',
    phone: '+81 75 222 3344',
    status: 'Suspended',
    tier: 'Starter',
    activeSubscriptionsCount: 0,
    totalSpent: 294.00,
    joinedDate: '2025-01-20',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    billingAddress: 'Shimogyo Ward, Karasuma St, Kyoto 600-8216, Japan',
    taxId: 'JP-9010001099221'
  }
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: 'sub-101',
    code: 'SUB-2025-001',
    customerId: 'cust-001',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@acmecorp.io',
    customerCompany: 'Acme Corporation',
    planId: 'plan-003',
    planName: 'Enterprise Scale',
    amount: 1590.00,
    billingCycle: 'Yearly',
    status: 'Active',
    startDate: '2025-01-15',
    expiryDate: '2026-01-15',
    nextBillingDate: '2026-01-15',
    autoRenew: true,
    paymentMethod: 'Corporate Visa ending in 4242',
    seats: 50
  },
  {
    id: 'sub-102',
    code: 'SUB-2025-002',
    customerId: 'cust-002',
    customerName: 'David Miller',
    customerEmail: 'd.miller@stratosai.tech',
    customerCompany: 'Stratos AI Labs',
    planId: 'plan-002',
    planName: 'Professional Tier',
    amount: 149.00,
    billingCycle: 'Monthly',
    status: 'Active',
    startDate: '2025-02-04',
    expiryDate: '2025-11-04',
    nextBillingDate: '2025-11-04',
    autoRenew: true,
    paymentMethod: 'Mastercard ending in 8812',
    seats: 25
  },
  {
    id: 'sub-103',
    code: 'SUB-2025-003',
    customerId: 'cust-003',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordicvibe.se',
    customerCompany: 'Nordic Vibe Design Studio',
    planId: 'plan-002',
    planName: 'Professional Tier',
    amount: 149.00,
    billingCycle: 'Monthly',
    status: 'Past Due',
    startDate: '2025-02-28',
    expiryDate: '2025-10-28',
    nextBillingDate: '2025-10-28',
    autoRenew: true,
    paymentMethod: 'Visa ending in 1904',
    seats: 15
  },
  {
    id: 'sub-104',
    code: 'SUB-2025-004',
    customerId: 'cust-004',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@vancemetrics.com',
    customerCompany: 'Vance Metrics Group',
    planId: 'plan-001',
    planName: 'Starter Tier',
    amount: 49.00,
    billingCycle: 'Monthly',
    status: 'Paused',
    startDate: '2025-03-14',
    expiryDate: '2025-11-14',
    nextBillingDate: '2025-12-14',
    autoRenew: false,
    paymentMethod: 'American Express ending in 3001',
    seats: 5
  },
  {
    id: 'sub-105',
    code: 'SUB-2025-005',
    customerId: 'cust-005',
    customerName: 'Chloe Laurent',
    customerEmail: 'chloe.l@luminafinance.fr',
    customerCompany: 'Lumina FinTech SAS',
    planId: 'plan-003',
    planName: 'Enterprise Scale',
    amount: 1590.00,
    billingCycle: 'Yearly',
    status: 'Active',
    startDate: '2025-03-25',
    expiryDate: '2026-03-25',
    nextBillingDate: '2026-03-25',
    autoRenew: true,
    paymentMethod: 'SEPA Direct Debit (DE...4910)',
    seats: 80
  },
  {
    id: 'sub-106',
    code: 'SUB-2025-006',
    customerId: 'cust-006',
    customerName: 'Kenji Takahashi',
    customerEmail: 'k.takahashi@nexuskyoto.co.jp',
    customerCompany: 'Nexus Kyoto Software',
    planId: 'plan-001',
    planName: 'Starter Tier',
    amount: 49.00,
    billingCycle: 'Monthly',
    status: 'Canceled',
    startDate: '2025-01-20',
    expiryDate: '2025-04-20',
    nextBillingDate: 'N/A',
    autoRenew: false,
    paymentMethod: 'JCB Card ending in 7701',
    seats: 3
  },
  {
    id: 'sub-107',
    code: 'SUB-2025-007',
    customerId: 'cust-001',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@acmecorp.io',
    customerCompany: 'Acme Corporation',
    planId: 'plan-004',
    planName: 'PulseAnalytics Growth',
    amount: 89.00,
    billingCycle: 'Monthly',
    status: 'Active',
    startDate: '2025-02-15',
    expiryDate: '2025-11-15',
    nextBillingDate: '2025-11-15',
    autoRenew: true,
    paymentMethod: 'Corporate Visa ending in 4242',
    seats: 10
  }
];

export const MOCK_INVOICES = [
  {
    id: 'inv-8901',
    invoiceNumber: 'INV-2025-0891',
    customerId: 'cust-001',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@acmecorp.io',
    customerCompany: 'Acme Corporation',
    subscriptionId: 'sub-101',
    issueDate: '2025-10-15',
    dueDate: '2025-10-30',
    amount: 1590.00,
    subtotal: 1445.45,
    taxAmount: 144.55,
    taxRate: '10%',
    status: 'Paid',
    paidAt: '2025-10-16 09:24 AM',
    paymentMethod: 'Corporate Visa ending in 4242',
    items: [
      { id: 'item-1', description: 'Enterprise Scale Subscription - Annual Renewal (50 Seats)', quantity: 1, unitPrice: 1445.45, amount: 1445.45 }
    ]
  },
  {
    id: 'inv-8902',
    invoiceNumber: 'INV-2025-0892',
    customerId: 'cust-002',
    customerName: 'David Miller',
    customerEmail: 'd.miller@stratosai.tech',
    customerCompany: 'Stratos AI Labs',
    subscriptionId: 'sub-102',
    issueDate: '2025-10-04',
    dueDate: '2025-10-19',
    amount: 149.00,
    subtotal: 135.45,
    taxAmount: 13.55,
    taxRate: '10%',
    status: 'Paid',
    paidAt: '2025-10-04 11:12 AM',
    paymentMethod: 'Mastercard ending in 8812',
    items: [
      { id: 'item-2', description: 'Professional Tier - October 2025 (25 Seats)', quantity: 1, unitPrice: 135.45, amount: 135.45 }
    ]
  },
  {
    id: 'inv-8903',
    invoiceNumber: 'INV-2025-0893',
    customerId: 'cust-003',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordicvibe.se',
    customerCompany: 'Nordic Vibe Design Studio',
    subscriptionId: 'sub-103',
    issueDate: '2025-10-28',
    dueDate: '2025-11-12',
    amount: 149.00,
    subtotal: 119.20,
    taxAmount: 29.80,
    taxRate: '25%',
    status: 'Pending',
    paidAt: null,
    paymentMethod: 'Visa ending in 1904',
    items: [
      { id: 'item-3', description: 'Professional Tier - Renewal (15 Seats)', quantity: 1, unitPrice: 119.20, amount: 119.20 }
    ]
  },
  {
    id: 'inv-8904',
    invoiceNumber: 'INV-2025-0894',
    customerId: 'cust-004',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@vancemetrics.com',
    customerCompany: 'Vance Metrics Group',
    subscriptionId: 'sub-104',
    issueDate: '2025-09-14',
    dueDate: '2025-09-29',
    amount: 49.00,
    subtotal: 44.55,
    taxAmount: 4.45,
    taxRate: '10%',
    status: 'Overdue',
    paidAt: null,
    paymentMethod: 'American Express ending in 3001',
    items: [
      { id: 'item-4', description: 'Starter Tier - September 2025', quantity: 1, unitPrice: 44.55, amount: 44.55 }
    ]
  },
  {
    id: 'inv-8905',
    invoiceNumber: 'INV-2025-0895',
    customerId: 'cust-005',
    customerName: 'Chloe Laurent',
    customerEmail: 'chloe.l@luminafinance.fr',
    customerCompany: 'Lumina FinTech SAS',
    subscriptionId: 'sub-105',
    issueDate: '2025-10-25',
    dueDate: '2025-11-09',
    amount: 1590.00,
    subtotal: 1325.00,
    taxAmount: 265.00,
    taxRate: '20%',
    status: 'Paid',
    paidAt: '2025-10-26 14:02 PM',
    paymentMethod: 'SEPA Direct Debit',
    items: [
      { id: 'item-5', description: 'Enterprise Scale Subscription - Annual Renewal', quantity: 1, unitPrice: 1325.00, amount: 1325.00 }
    ]
  },
  {
    id: 'inv-8906',
    invoiceNumber: 'INV-2025-0896',
    customerId: 'cust-001',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@acmecorp.io',
    customerCompany: 'Acme Corporation',
    subscriptionId: 'sub-107',
    issueDate: '2025-10-15',
    dueDate: '2025-10-30',
    amount: 89.00,
    subtotal: 80.91,
    taxAmount: 8.09,
    taxRate: '10%',
    status: 'Draft',
    paidAt: null,
    paymentMethod: 'Corporate Visa ending in 4242',
    items: [
      { id: 'item-6', description: 'PulseAnalytics Growth - Dedicated telemetry pipe', quantity: 1, unitPrice: 80.91, amount: 80.91 }
    ]
  }
];

export const MOCK_PAYMENTS = [
  {
    id: 'pay-7701',
    transactionId: 'TXN-9023-88120',
    invoiceNumber: 'INV-2025-0891',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@acmecorp.io',
    customerCompany: 'Acme Corporation',
    amount: 1590.00,
    currency: 'USD',
    method: 'Credit Card',
    cardBrand: 'Visa',
    cardLast4: '4242',
    status: 'Succeeded',
    date: '2025-10-16 09:24 AM',
    gateway: 'Stripe Direct'
  },
  {
    id: 'pay-7702',
    transactionId: 'TXN-9023-88121',
    invoiceNumber: 'INV-2025-0892',
    customerName: 'David Miller',
    customerEmail: 'd.miller@stratosai.tech',
    customerCompany: 'Stratos AI Labs',
    amount: 149.00,
    currency: 'USD',
    method: 'Credit Card',
    cardBrand: 'Mastercard',
    cardLast4: '8812',
    status: 'Succeeded',
    date: '2025-10-04 11:12 AM',
    gateway: 'Stripe Direct'
  },
  {
    id: 'pay-7703',
    transactionId: 'TXN-9023-88122',
    invoiceNumber: 'INV-2025-0895',
    customerName: 'Chloe Laurent',
    customerEmail: 'chloe.l@luminafinance.fr',
    customerCompany: 'Lumina FinTech SAS',
    amount: 1590.00,
    currency: 'USD',
    method: 'SEPA Transfer',
    cardBrand: 'Bank Account',
    cardLast4: '4910',
    status: 'Succeeded',
    date: '2025-10-26 14:02 PM',
    gateway: 'SEPA Gateway'
  },
  {
    id: 'pay-7704',
    transactionId: 'TXN-9023-88123',
    invoiceNumber: 'INV-2025-0894',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@vancemetrics.com',
    customerCompany: 'Vance Metrics Group',
    amount: 49.00,
    currency: 'USD',
    method: 'Credit Card',
    cardBrand: 'Amex',
    cardLast4: '3001',
    status: 'Failed',
    date: '2025-09-30 08:15 AM',
    gateway: 'Stripe Direct'
  },
  {
    id: 'pay-7705',
    transactionId: 'TXN-9023-88124',
    invoiceNumber: 'INV-2025-0880',
    customerName: 'Kenji Takahashi',
    customerEmail: 'k.takahashi@nexuskyoto.co.jp',
    customerCompany: 'Nexus Kyoto Software',
    amount: 49.00,
    currency: 'USD',
    method: 'Credit Card',
    cardBrand: 'JCB',
    cardLast4: '7701',
    status: 'Refunded',
    date: '2025-04-22 16:30 PM',
    gateway: 'Stripe Direct'
  },
  {
    id: 'pay-7706',
    transactionId: 'TXN-9023-88125',
    invoiceNumber: 'INV-2025-0893',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@nordicvibe.se',
    customerCompany: 'Nordic Vibe Design Studio',
    amount: 149.00,
    currency: 'USD',
    method: 'Credit Card',
    cardBrand: 'Visa',
    cardLast4: '1904',
    status: 'Processing',
    date: '2025-10-31 06:10 AM',
    gateway: 'Stripe Direct'
  }
];

export const MOCK_DISCOUNTS = [
  {
    id: 'disc-01',
    code: 'BRIGHT20',
    name: 'Q4 Seasonal Launch Discount',
    type: 'percentage',
    value: 20,
    minPurchase: 100.00,
    usageLimit: 500,
    usageCount: 342,
    validFrom: '2025-10-01',
    validUntil: '2025-12-31',
    status: 'Active',
    description: '20% off all Professional and Enterprise subscription commitments.'
  },
  {
    id: 'disc-02',
    code: 'STARTUP50',
    name: 'Early Stage Y-Combinator Special',
    type: 'fixed',
    value: 50.00,
    minPurchase: 99.00,
    usageLimit: 100,
    usageCount: 88,
    validFrom: '2025-06-01',
    validUntil: '2025-11-30',
    status: 'Active',
    description: '$50 instant credit for verified startup founders.'
  },
  {
    id: 'disc-03',
    code: 'ANNUAL30',
    name: 'Yearly Plan Incentive',
    type: 'percentage',
    value: 30,
    minPurchase: 1200.00,
    usageLimit: 250,
    usageCount: 194,
    validFrom: '2025-01-01',
    validUntil: '2026-01-01',
    status: 'Active',
    description: '30% savings on upfront annual billing commitments.'
  },
  {
    id: 'disc-04',
    code: 'SUMMER2025',
    name: 'Mid-Year Flash Promo',
    type: 'percentage',
    value: 15,
    minPurchase: 50.00,
    usageLimit: 200,
    usageCount: 200,
    validFrom: '2025-07-01',
    validUntil: '2025-08-31',
    status: 'Expired',
    description: 'Summer campaign discount coupon.'
  }
];

export const MOCK_STAFF = [
  {
    id: 'staff-01',
    name: 'Alexander Ward',
    email: 'alex.ward@brightloop.com',
    role: 'Super Admin',
    department: 'Engineering & Operations',
    status: 'Active',
    lastActive: '5 mins ago',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    permissions: ['all_access', 'billing_management', 'system_config', 'user_management']
  },
  {
    id: 'staff-02',
    name: 'Sophia Chen',
    email: 'sophia.c@brightloop.com',
    role: 'Billing Manager',
    department: 'Finance & Accounting',
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    permissions: ['billing_management', 'invoice_generation', 'refunds', 'financial_reports']
  },
  {
    id: 'staff-03',
    name: 'Devon Patel',
    email: 'devon.p@brightloop.com',
    role: 'Support Agent',
    department: 'Customer Success',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    permissions: ['view_customers', 'pause_subscription', 'view_invoices', 'support_tickets']
  },
  {
    id: 'staff-04',
    name: 'Claire Beauchamp',
    email: 'claire.b@brightloop.com',
    role: 'Financial Auditor',
    department: 'Compliance',
    status: 'Active',
    lastActive: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    permissions: ['read_only_audit', 'export_financials', 'tax_compliance']
  }
];

export const MOCK_TAX_CONFIG = {
  taxRates: [
    { id: 'tax-1', country: 'United States', region: 'California (State + Local)', rate: 8.25, name: 'Sales Tax', taxIdRequired: false, isDefault: true },
    { id: 'tax-2', country: 'United States', region: 'New York (State + City)', rate: 8.875, name: 'Sales Tax', taxIdRequired: false, isDefault: false },
    { id: 'tax-3', country: 'European Union', region: 'Standard OSS VAT', rate: 20.00, name: 'VAT', taxIdRequired: true, isDefault: false },
    { id: 'tax-4', country: 'United Kingdom', region: 'HMRC Standard', rate: 20.00, name: 'UK VAT', taxIdRequired: true, isDefault: false },
    { id: 'tax-5', country: 'Canada', region: 'Ontario (HST)', rate: 13.00, name: 'HST', taxIdRequired: true, isDefault: false },
    { id: 'tax-6', country: 'Australia', region: 'ATO Standard', rate: 10.00, name: 'GST', taxIdRequired: true, isDefault: false }
  ],
  billingSettings: {
    companyName: 'BRIGHTLOOP Technologies Inc.',
    legalEntity: 'Brightloop SaaS Solutions LLC',
    taxId: 'US-EIN-94-3829104',
    billingEmail: 'billing@brightloop.com',
    address: '500 Howard Street, Suite 400, San Francisco, CA 94105, USA',
    invoicePrefix: 'INV-2025-',
    nextInvoiceNumber: 897,
    paymentGracePeriodDays: 14,
    dunningRetries: 4,
    dunningIntervalDays: 3,
    autoInvoicing: true,
    digitalExemptionEnabled: true,
    currency: 'USD',
    currencySymbol: '$',
    webhookEndpoint: 'https://api.brightloop.com/v1/webhooks/billing'
  }
};

export const MOCK_QUOTATIONS = [
  {
    id: 'quot-01',
    title: 'Enterprise Annual Cloud Migration',
    code: 'QT-2025-01',
    description: 'Complete high-availability cloud migration and 100 enterprise licenses proposal.',
    validDays: 30,
    defaultDiscount: 15,
    currency: 'USD',
    status: 'Active',
    totalValue: 18500.00,
    terms: 'Net 30 payment terms upon contract execution. 99.99% uptime SLA guaranteed.',
    items: [
      { name: 'BrightCloud Enterprise Core (100 Seats)', qty: 1, unitPrice: 15900.00 },
      { name: 'Dedicated Technical Account Manager (1 Year)', qty: 1, unitPrice: 3500.00 }
    ],
    updatedAt: '2025-10-20'
  },
  {
    id: 'quot-02',
    title: 'FinTech High-Volume Analytics Package',
    code: 'QT-2025-02',
    description: 'Real-time telemetry and customized compliance pipeline for banking clients.',
    validDays: 45,
    defaultDiscount: 10,
    currency: 'USD',
    status: 'Active',
    totalValue: 8400.00,
    terms: 'Monthly auto-debit via SEPA or Wire Transfer. SOC2 Type II report provided upon NDA.',
    items: [
      { name: 'PulseAnalytics Pro (5M events/mo)', qty: 1, unitPrice: 6500.00 },
      { name: 'SecureShield Identity Gateway Gateway Bundle', qty: 1, unitPrice: 1900.00 }
    ],
    updatedAt: '2025-10-18'
  },
  {
    id: 'quot-03',
    title: 'Startup Accelerator Pilot Bundle',
    code: 'QT-2025-03',
    description: 'Seed-stage company bundle with capped usage and subsidized pricing.',
    validDays: 15,
    defaultDiscount: 25,
    currency: 'USD',
    status: 'Draft',
    totalValue: 2400.00,
    terms: 'Valid only for companies with less than $2M in venture funding.',
    items: [
      { name: 'Starter Tier Suite (Annual)', qty: 1, unitPrice: 1800.00 },
      { name: 'OmniFlow API Starter pack', qty: 1, unitPrice: 600.00 }
    ],
    updatedAt: '2025-10-25'
  }
];

export const MOCK_ANALYTICS = {
  kpis: {
    totalCustomers: { value: 1428, change: '+12.4%', trend: 'up', period: 'vs last month' },
    activeSubscriptions: { value: 2194, change: '+8.1%', trend: 'up', period: 'vs last month' },
    monthlyRevenue: { value: 148920, change: '+15.3%', trend: 'up', period: 'vs last month' },
    pendingInvoices: { value: 18, change: '-4.2%', trend: 'down', period: 'vs last month' },
    mrr: { value: 148920, change: '+15.3%', trend: 'up' },
    arr: { value: 1787040, change: '+18.7%', trend: 'up' },
    churnRate: { value: '1.42%', change: '-0.3%', trend: 'down' },
    arpu: { value: '$104.28', change: '+5.4%', trend: 'up' },
    ltv: { value: '$4,120', change: '+9.2%', trend: 'up' },
    nrr: { value: '114%', change: '+2.0%', trend: 'up' }
  },
  revenueOverview: [
    { month: 'Jan', revenue: 98000, target: 95000, expenses: 32000 },
    { month: 'Feb', revenue: 104500, target: 100000, expenses: 33500 },
    { month: 'Mar', revenue: 112000, target: 108000, expenses: 35000 },
    { month: 'Apr', revenue: 118400, target: 115000, expenses: 36200 },
    { month: 'May', revenue: 124000, target: 120000, expenses: 37800 },
    { month: 'Jun', revenue: 131200, target: 125000, expenses: 39000 },
    { month: 'Jul', revenue: 136800, target: 130000, expenses: 40500 },
    { month: 'Aug', revenue: 141000, target: 135000, expenses: 41200 },
    { month: 'Sep', revenue: 144500, target: 140000, expenses: 42000 },
    { month: 'Oct', revenue: 148920, target: 145000, expenses: 43500 }
  ],
  subscriptionStatusBreakdown: [
    { name: 'Active', value: 1840, color: '#16A34A' },
    { name: 'Trialing', value: 210, color: '#FBBF24' },
    { name: 'Past Due', value: 84, color: '#F97316' },
    { name: 'Canceled', value: 60, color: '#DC2626' }
  ],
  customerAcquisition: [
    { month: 'May', newCustomers: 120, churned: 14 },
    { month: 'Jun', newCustomers: 142, churned: 16 },
    { month: 'Jul', newCustomers: 155, churned: 12 },
    { month: 'Aug', newCustomers: 168, churned: 18 },
    { month: 'Sep', newCustomers: 174, churned: 15 },
    { month: 'Oct', newCustomers: 189, churned: 13 }
  ],
  topProducts: [
    { name: 'BrightCloud Enterprise Core', subscribers: 1420, revenue: '$98,420', growth: '+14.2%', share: 66 },
    { name: 'PulseAnalytics Pro', subscribers: 890, revenue: '$28,150', growth: '+22.5%', share: 19 },
    { name: 'SecureShield Identity Gateway', subscribers: 610, revenue: '$14,900', growth: '+8.4%', share: 10 },
    { name: 'OmniFlow Automations API', subscribers: 1150, revenue: '$7,450', growth: '+18.0%', share: 5 }
  ]
};

// Customer-facing mock account
export const MOCK_CURRENT_CUSTOMER = {
  id: 'cust-001',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@acmecorp.io',
  company: 'Acme Corporation',
  phone: '+1 (555) 234-5678',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  activeSubscriptionsCount: 2,
  totalSpent: 4890.00,
  nextPaymentDate: 'Nov 15, 2025',
  nextPaymentAmount: 89.00,
  totalSavings: 450.00,
  paymentMethods: [
    { id: 'pm-1', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2027, isDefault: true, holder: 'Sarah Jenkins' },
    { id: 'pm-2', brand: 'Mastercard', last4: '9012', expMonth: '08', expYear: 2026, isDefault: false, holder: 'Acme Corp Operations' }
  ],
  tickets: [
    { id: 'tkt-1', subject: 'Invoice auto-forwarding to accounts payable', status: 'Resolved', date: '2025-10-12', priority: 'Medium' },
    { id: 'tkt-2', subject: 'Increasing API rate limits for staging sandbox', status: 'In Progress', date: '2025-10-24', priority: 'High' }
  ]
};

// Admin user profile
export const MOCK_ADMIN_USER = {
  id: 'usr-admin-01',
  name: 'Alexander Ward',
  email: 'admin@brightloop.com',
  role: 'admin',
  title: 'Principal Systems Administrator',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
};

