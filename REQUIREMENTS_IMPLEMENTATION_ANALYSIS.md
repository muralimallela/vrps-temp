# VRPS Application Requirements Implementation Analysis

## Executive Summary

The VRPS application will be enhanced from a community information platform to a full-featured membership and donation management system. This analysis evaluates the current codebase architecture and provides a detailed implementation roadmap aligned with new requirements.

**Current State:**
- Next.js 15.5 frontend (static content delivery)
- Minimal backend (one webhook endpoint)
- Clerk authentication (user management)
- MongoDB (only Counter collection)
- Single-locale support for UI components

**Target State:**
- User authentication (email/mobile + OTP/password)
- Membership system with payment integration
- Donation management (one-time & recurring)
- Admin dashboards with analytics
- ID card generation (PDF with QR codes)
- Role-based access control (Admin/User)

---

## 1. REQUIRED DATABASE CHANGES

### 1.1 New Collections Required

#### A. User Profile Collection
**Collection Name:** users

\\\	ypescript
interface User {
  _id: ObjectId;
  clerkUserId: string;           // Link to Clerk
  email: string;
  phone: string;                 // Mobile number
  firstName: string;
  lastName: string;
  profilePhoto?: string;          // File URL or Base64
  isMember: boolean;              // Membership status
  membershipId?: string;          // Link to Membership
  addressId?: ObjectId;           // Link to Address
  role: 'user' | 'admin';         // Role-based access
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
\\\

**Indexes:**
- clerkUserId (unique)
- email (unique)
- phone (unique)
- isMember (for filtering)
- role (for access control)

---

#### B. Address Collection
**Collection Name:** addresses

\\\	ypescript
interface Address {
  _id: ObjectId;
  userId: ObjectId;
  state: string;
  district: string;
  mandal: string;
  village: string;
  street: string;
  pincode: string;
  isComplete: boolean;            // All fields filled
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
\\\

**Indexes:**
- userId
- state, district, mandal (for filtering)
- isComplete (for membership eligibility)

---

#### C. Membership Collection
**Collection Name:** memberships

\\\	ypescript
interface Membership {
  _id: ObjectId;
  membershipId: string;           // VRPS2605001 format
  userId: ObjectId;               // Link to User
  clerkUserId: string;
  membershipFee: number;          // ₹99
  paymentId: string;              // Payment transaction ref
  paymentStatus: 'pending' | 'completed' | 'failed';
  startDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'suspended';
  membershipTier: 'standard' | 'premium';
  renewalDueDate?: Date;
  notes?: string;
  auditLog: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface AuditEntry {
  action: string;
  changedBy: ObjectId;
  timestamp: Date;
  changes: Record<string, any>;
}
\\\

**Indexes:**
- membershipId (unique)
- userId (unique)
- clerkUserId (unique)
- status
- startDate

---

#### D. Donation Collection
**Collection Name:** donations

\\\	ypescript
interface Donation {
  _id: ObjectId;
  donationId: string;             // Auto-generated (VRPS-DON-001)
  userId: ObjectId;
  clerkUserId: string;
  amount: number;                 // Minimum ₹99
  donationType: 'one-time' | 'monthly';
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  
  // For recurring donations
  recurringConfig?: {
    frequency: 'monthly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    nextChargeDate: Date;
    failedAttempts: number;
  };
  
  purpose?: string;               // Optional: Emergency relief, etc.
  isAnonymous: boolean;
  receiptGenerated: boolean;
  receiptUrl?: string;
  auditLog: AuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}
\\\

**Indexes:**
- userId
- clerkUserId
- donationType
- paymentStatus
- createdAt

---

#### E. Payment/Transaction Collection
**Collection Name:** transactions

\\\	ypescript
interface Transaction {
  _id: ObjectId;
  transactionId: string;          // Unique reference
  userId: ObjectId;
  clerkUserId: string;
  type: 'membership' | 'donation';
  linkedEntity: {                 // Reference to membership or donation
    entityType: 'membership' | 'donation';
    entityId: ObjectId;
  };
  amount: number;
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentGateway: 'razorpay' | 'stripe' | 'other';
  paymentGatewayTransactionId: string;
  failureReason?: string;
  retryCount: number;
  metadata: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}
\\\

**Indexes:**
- transactionId (unique)
- userId
- status
- type

---

#### F. Audit Log Collection
**Collection Name:** auditLogs

\\\	ypescript
interface AuditLog {
  _id: ObjectId;
  entityType: 'user' | 'membership' | 'donation' | 'address';
  entityId: ObjectId;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  performedBy: ObjectId;          // Admin/user who made change
  performedByRole: 'admin' | 'user';
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  reason?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}
\\\

---

#### G. Analytics/Dashboard Collection (Optional)
**Collection Name:** dashboardMetrics

\\\	ypescript
interface DashboardMetric {
  _id: ObjectId;
  date: Date;                     // Daily rollup
  totalUsers: number;
  activeUsers: number;
  newUsersCount: number;
  totalMembers: number;
  activeMemberships: number;
  newMembershipsCount: number;
  totalDonations: number;
  recurringDonationsCount: number;
  totalDonationAmount: number;
  monthlyDonationAmount: number;
}
\\\

---

### 1.2 Collections to Modify

#### A. Counter Collection (Existing)
**Add sequences for:**
- membershipId (currently incremented manually)
- donationId
- transactionId

\\\	ypescript
// Existing implementation with additional sequences
interface Counter {
  _id: string;                    // "memberId", "donationId", etc.
  value: number;
}
\\\

---

### 1.3 Data Migration Strategy

**Phase 1: Add new collections (backwards compatible)**
- Deploy new schema without breaking existing functionality
- Existing users can use platform without immediate migration

**Phase 2: Backfill user data**
- Create User documents for all Clerk users
- Set isMember = false by default
- Link existing Counter records to Users

---

## 2. NEW APIS REQUIRED

### 2.1 Authentication & Authorization APIs

#### A. User Registration/Login
**Endpoint:** POST /api/auth/register
`
Request:
{
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password?: string;
}

Response:
{
  success: boolean;
  userId: string;
  clerkUserId: string;
  message: string;
}
`

**Endpoint:** POST /api/auth/verify-otp
`
Request:
{
  phone: string;
  otp: string;
}

Response:
{
  token: string;
  user: User;
}
`

---

#### B. Role-Based Authorization
**Middleware:** Check JWT claims for role

`	ypescript
// Middleware pattern
export async function withRoleAuth(role: 'admin' | 'user') {
  return (req: Request) => {
    const token = extractJWT(req);
    const decodedClaims = verifyJWT(token);
    if (decodedClaims.role !== role && role !== 'user') {
      return Response 403 Forbidden;
    }
  };
}
`

---

### 2.2 User Profile APIs

#### A. User Profile Management
**Endpoint:** GET /api/users/profile
- Returns current user profile
- Auth: Requires valid JWT

**Endpoint:** PUT /api/users/profile
- Update user info (name, email, photo)
- Auth: User can update own profile

**Endpoint:** GET /api/users/address
- Get user's address
- Auth: Requires valid JWT

**Endpoint:** POST /api/users/address
- Create or update address
- Required for membership eligibility
- Auth: Requires valid JWT

**Endpoint:** GET /api/users/{userId}
- Admin endpoint: Get any user's profile
- Auth: Admin only

---

### 2.3 Membership APIs

#### A. Membership Management
**Endpoint:** POST /api/memberships/initiate-payment
`
Request:
{
  userId: string;
  amount: number;           // ₹99 minimum
}

Response:
{
  paymentId: string;
  orderId: string;
  amount: number;
  paymentGatewayLink: string;
}
`

**Endpoint:** POST /api/memberships/confirm-payment
`
Request:
{
  paymentId: string;
  transactionId: string;
  status: 'success' | 'failed';
}

Response:
{
  membershipId: string;
  status: 'active';
  startDate: Date;
}
`

**Endpoint:** GET /api/memberships/status
- Get current membership status
- Auth: User can check own, Admin can check any

**Endpoint:** GET /api/memberships/{membershipId}
- Get membership details with audit log
- Auth: Membership owner or Admin

**Endpoint:** GET /api/admin/memberships
- List all memberships with filters
- Filters: status, state, district, createdDate range
- Auth: Admin only

**Endpoint:** PUT /api/admin/memberships/{membershipId}/status
- Approve/suspend/expire membership
- Auth: Admin only

---

### 2.4 Donation APIs

#### A. Donation Management
**Endpoint:** POST /api/donations/initiate
`
Request:
{
  amount: number;          // ₹99 minimum
  type: 'one-time' | 'monthly';
  purpose?: string;
  isAnonymous: boolean;
}

Response:
{
  donationId: string;
  paymentId: string;
  paymentGatewayLink: string;
}
`

**Endpoint:** POST /api/donations/confirm-payment
- Similar to membership payment confirmation

**Endpoint:** GET /api/donations/history
- Get user's donation history
- Auth: User can view own, Admin can view any

**Endpoint:** GET /api/donations/recurring
- Get active recurring donations
- Auth: User, Admin

**Endpoint:** PUT /api/donations/{donationId}/recurring/pause
- Pause/resume recurring donation
- Auth: User can manage own

**Endpoint:** GET /api/admin/donations
- List all donations with filters
- Filters: type, status, dateRange, amount range
- Auth: Admin only

**Endpoint:** GET /api/admin/donations/reports
`
Response:
{
  totalDonations: number;
  totalAmount: number;
  recurringCount: number;
  oneTimeCount: number;
  monthlyTrend: Array<{date, amount}>;
  topDonors: Array<{name, totalAmount}>;
}
`

---

### 2.5 ID Card APIs

#### A. ID Card Generation
**Endpoint:** GET /api/idcard/generate
- Generate ID card for member
- Auth: Member only

**Response:**
`json
{
  membershipId: "VRPS2605001",
  name: "John Doe",
  address: "123 Street, Village, Mandal, District, State 123456",
  membershipDate: "2026-05-31",
  qrCode: "data:image/png;base64,...",
  cardImageUrl: "https://cdn.../idcard-123.png"
}
`

**Endpoint:** POST /api/idcard/download-pdf
`
Request:
{
  format: 'pdf' | 'image';
  includeQR: boolean;
}

Response: File download (PDF or PNG)
`

---

### 2.6 Admin Dashboard APIs

#### A. Analytics
**Endpoint:** GET /api/admin/dashboard/users
`
Response:
{
  totalUsers: number;
  activeUsers: number;
  monthlyActiveUsers: number;
  newUsersThisMonth: number;
  membersCount: number;
  nonMembersCount: number;
  userGrowthTrend: Array<{date, count}>;
}
`

**Endpoint:** GET /api/admin/dashboard/memberships
`
Response:
{
  newMembershipsThisMonth: number;
  totalMembershipRevenue: number;
  activeMembershipsCount: number;
  expiredMembershipsCount: number;
  membershipGrowthTrend: Array<{date, count}>;
}
`

**Endpoint:** GET /api/admin/dashboard/donations
`
Response:
{
  totalDonations: number;
  monthlyDonations: number;
  recurringDonationsCount: number;
  oneTimeDonationsCount: number;
  donationGrowthTrend: Array<{date, amount}>;
}
`

---

### 2.7 Export APIs

#### A. Data Export
**Endpoint:** GET /api/admin/export/memberships
`
Query params:
- format: 'csv' | 'excel'
- filters: state, district, status, dateRange

Response: File download
`

**Endpoint:** GET /api/admin/export/donations
- Similar format

---

### 2.8 Audit Log API

#### A. Audit Trail
**Endpoint:** GET /api/admin/audit-logs
`
Query params:
- entityType: 'membership' | 'donation' | 'user'
- entityId: string
- dateRange: {from, to}

Response: Array<AuditLog>
`

---

## 3. UI SCREENS REQUIRED

### 3.1 User-Facing Screens

#### Authentication Flow
1. **Login Screen**
   - Email/Phone login options
   - OTP verification
   - Password login option
   - Register link

2. **Registration Screen**
   - Email, Phone, Name fields
   - Address (OPTIONAL)
   - Password setup
   - Terms acceptance

3. **OTP Verification Screen**
   - OTP input
   - Resend option
   - Timer

#### Profile Management
4. **User Dashboard**
   - Profile summary
   - Membership status card
   - Quick links (Edit Profile, Donations, ID Card)
   - Recent activity

5. **Profile Edit Screen**
   - Edit personal info
   - Profile photo upload
   - Email/Phone update
   - Save changes

6. **Address Management Screen**
   - Add/Edit address
   - State, District, Mandal, Village dropdowns
   - Street address & pincode
   - Mark as primary
   - List of saved addresses

#### Membership
7. **Membership Status Screen**
   - Current membership status
   - Membership ID (if member)
   - Membership date
   - Fee paid info
   - Upgrade/Renew button

8. **Become a Member Screen**
   - Requirements checklist
   - Address completion status
   - ₹99 fee payment option
   - Payment gateway integration

#### Donations
9. **Donation Screen**
   - Donation amount input
   - Minimum ₹99 validation
   - One-time vs Monthly toggle
   - Purpose (optional)
   - Anonymous donation toggle
   - Payment gateway

10. **Donation History Screen**
    - List of all donations
    - Filters: Date range, Type
    - Receipt download links
    - Recurring donation management

#### ID Card
11. **ID Card View Screen**
    - Display ID card preview
    - Membership ID
    - Name, Address
    - Membership date
    - QR code (optional)
    - Download button

12. **ID Card Download Screen**
    - Format selection (PDF/Image)
    - QR code toggle
    - Download/Share options

---

### 3.2 Admin-Facing Screens

#### Admin Dashboard
1. **Admin Home Dashboard**
   - 6 metric cards (Users, Active Users, MAU, New Users, Members, Non-Members)
   - Charts: User growth trend, Membership growth, Donation trend

2. **Membership Dashboard**
   - New memberships this month
   - Total membership revenue
   - Active memberships count
   - Trends and analytics

3. **Donation Dashboard**
   - Total donations
   - Monthly donations
   - Recurring vs One-time split
   - Top donors
   - Donation trends

#### User Management
4. **User List Screen**
   - Table view of all users
   - Columns: Name, Email, Phone, Membership Status, Joined Date
   - Filters: State, District, Mandal, Village, Membership Status
   - Search: Name, User ID, Mobile
   - Categories tab: Members / Non-Members
   - Bulk actions: Export

5. **User Detail Screen**
   - User profile
   - Address details
   - Membership info
   - Donation history
   - Audit log

#### Membership Management
6. **Membership List Screen**
   - Table: Member ID, Name, Status, Start Date, Expiry Date
   - Filters: Status (Active, Expired, New)
   - Search
   - Bulk export (CSV/Excel)
   - Approve/Suspend actions

7. **Membership Edit Screen**
   - View/Edit membership details
   - Change status
   - View audit log
   - Add notes

#### Donation Management
8. **Donation List Screen**
   - Table: Donation ID, User Name, Amount, Type, Status, Date
   - Filters: Type, Status, Date Range, Amount Range
   - Reports tab

9. **Donation Reports Screen**
   - Total donations by month
   - Recurring vs one-time breakdown
   - Top donors list
   - Export data

#### Audit & Logs
10. **Audit Log Screen**
    - Entity type filter
    - Date range
    - Action performed
    - Who performed it
    - Changes made
    - Search/filter

---

## 4. AUTHORIZATION REQUIREMENTS

### 4.1 Role-Based Access Control

#### User Role Permissions
`
✓ View own profile
✓ Edit own profile
✓ Add/update own address
✓ View own membership status
✓ Initiate membership payment
✓ View own donation history
✓ Make donations
✓ Download own ID card (if member)
✓ Manage own recurring donations
✗ View other users
✗ Admin functions
`

#### Admin Role Permissions
`
✓ All User permissions
✓ View all users
✓ Filter/search users
✓ View user details
✓ View all memberships
✓ Approve/manage memberships
✓ View all donations
✓ Generate donation reports
✓ Export data (CSV/Excel)
✓ View audit logs
✓ View dashboards
✓ Manage admin settings (future)
`

---

### 4.2 API Authorization Implementation

**Using Clerk JWT Custom Claims:**

`	ypescript
// In Clerk webhook (when user is created/updated)
await clerkClient.users.updateUser(userId, {
  publicMetadata: {
    role: 'user',              // 'user' or 'admin'
    isMember: false,
    membershipId: undefined
  }
});

// In API middleware
export async function requireRole(allowedRoles: string[]) {
  return (req: Request) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const decoded = verifyJWT(token);
    
    if (!allowedRoles.includes(decoded.public_metadata.role)) {
      return new Response('Forbidden', { status: 403 });
    }
  };
}
`

**Usage in API routes:**

`	ypescript
// src/app/api/admin/users/route.ts
export async function GET(req: Request) {
  await requireRole(['admin'])(req);
  // Admin logic here
}
`

---

## 5. IMPACT ON EXISTING MODULES

### 5.1 Architecture Changes

| Component | Current State | Required Changes | Impact |
|-----------|---------------|-----------------|--------|
| **Middleware** | Handles locale + Clerk auth | Add role extraction from Clerk | Low - Additive |
| **Clerk Integration** | Basic user signup | Add role metadata, OTP handler | Medium - New integrations |
| **MongoDB** | Only Counter collection | Add 6+ new collections | High - Schema expansion |
| **API Layer** | Single webhook endpoint | Add 20+ REST endpoints | High - New service |
| **Frontend** | Static pages only | Add authenticated pages, dashboards | High - New feature set |
| **UI Components** | Marketing site only | Add auth, forms, tables, charts | High - New components |

### 5.2 Database Impact

**Storage Estimate (1000 users):**
- Users collection: ~50 KB
- Addresses collection: ~150 KB
- Memberships collection: ~100 KB
- Donations (10 per user avg): ~500 KB
- Transactions collection: ~200 KB
- Audit logs collection: ~400 KB
- **Total:** ~1.4 MB (MongoDB Atlas free tier = 512 MB, sufficient)

**Index Performance:**
- All indexed fields will be created
- Query performance: <100ms for typical operations
- Potential bottleneck: Large admin queries without filters

---

### 5.3 Integration Points

**Affected Files:**

1. **middleware.ts**
   - Extract role from Clerk metadata
   - Pass role to request context

2. **src/lib/mongodb.ts**
   - No changes needed (connection reusable)

3. **src/models/Counter.ts**
   - Extend with new sequences

4. **Clerk Webhook**
   - src/app/api/webhooks/clerk/route.ts
   - Create User document on signup
   - Initialize user metadata with role

5. **Layout & Navigation**
   - Add authenticated user menu
   - Show admin link if admin role
   - Update navigation structure

---

## 6. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-2)

**Database & Models**
- [ ] Create Mongoose models for all collections
- [ ] Set up MongoDB indexes
- [ ] Create seeding script for test data

**Backend APIs**
- [ ] Create /api/auth/* endpoints
- [ ] Create /api/users/* endpoints
- [ ] Implement JWT verification middleware
- [ ] Add role-based route protection

**Priority:** HIGH | Effort: HIGH | Dependencies: None

---

### Phase 2: Core Features (Weeks 3-4)

**Membership System**
- [ ] Create /api/memberships/* endpoints
- [ ] Integrate payment gateway (Razorpay/Stripe)
- [ ] Implement membership status logic

**Donations System**
- [ ] Create /api/donations/* endpoints
- [ ] Implement recurring donation logic
- [ ] Add payment handling

**ID Card Generation**
- [ ] Create /api/idcard/* endpoints
- [ ] Add PDF generation library
- [ ] Implement QR code generation

**Priority:** HIGH | Effort: HIGH | Dependencies: Phase 1

---

### Phase 3: User Interface (Weeks 5-6)

**Auth Pages**
- [ ] Login/Register screens
- [ ] OTP verification
- [ ] Profile management pages

**Feature Pages**
- [ ] User dashboard
- [ ] Membership screens
- [ ] Donation screens
- [ ] ID card viewer

**Priority:** HIGH | Effort: MEDIUM | Dependencies: Phase 1-2

---

### Phase 4: Admin Dashboard (Weeks 7-8)

**Dashboard & Analytics**
- [ ] Create admin dashboard
- [ ] User management screens
- [ ] Membership management
- [ ] Donation reports
- [ ] Audit logs viewer

**Export Functionality**
- [ ] CSV export
- [ ] Excel export

**Priority:** MEDIUM | Effort: MEDIUM | Dependencies: Phase 1-3

---

### Phase 5: Enhancement & Security (Weeks 9-10)

**Security**
- [ ] Rate limiting on APIs
- [ ] Input validation
- [ ] Audit logging
- [ ] CORS configuration

**Performance**
- [ ] API caching
- [ ] Database query optimization
- [ ] Search index optimization

**Testing**
- [ ] Unit tests for APIs
- [ ] Integration tests
- [ ] E2E tests for critical flows

**Priority:** MEDIUM | Effort: MEDIUM | Dependencies: All phases

---

### Phase 6: Payment Integration (Parallel)

**Payment Gateway Setup**
- [ ] Razorpay integration (preferred for India)
- [ ] Webhook handlers for payment status
- [ ] Refund handling
- [ ] Payment reconciliation

**Priority:** HIGH (Parallel with Phase 2) | Effort: MEDIUM | Dependencies: Phase 1

---

## 7. TECHNOLOGY STACK RECOMMENDATIONS

### New Dependencies to Add

`json
{
  "pdfkit": "^0.14.0",              // PDF generation
  "qrcode": "^1.5.3",                // QR code generation
  "razorpay": "^2.9.1",              // Payment gateway
  "nodemailer": "^6.9.7",            // Email notifications
  "zod": "^3.22.4",                  // Input validation
  "pino": "^8.17.2",                 // Logging
  "ioredis": "^5.3.2",               // Caching (optional)
  "xlsx": "^0.18.5",                 // Excel export
  "csv-stringify": "^6.4.4"          // CSV export
}
`

---

## 8. SECURITY CONSIDERATIONS

### 8.1 Data Protection

- [ ] Encrypt sensitive data (phone, address, payment info)
- [ ] Use HTTPS everywhere
- [ ] Implement CORS properly
- [ ] Rate limiting on payment endpoints
- [ ] Input sanitization & validation

### 8.2 Payment Security

- [ ] PCI DSS compliance (use Razorpay for tokenization)
- [ ] Never store raw credit card data
- [ ] Use Razorpay's hosted payment pages
- [ ] Webhook verification with signatures
- [ ] Idempotency keys for payments

### 8.3 Audit & Compliance

- [ ] Log all membership/donation changes
- [ ] Compliance with India's GDPR equivalent
- [ ] Data retention policies
- [ ] Export user data on request

---

## 9. DATABASE SCHEMA SUMMARY

\\\
┌─────────────────┐
│   Users         │
│─────────────────│
│ _id             │
│ clerkUserId──────→ Clerk
│ email           │
│ phone           │
│ firstName       │
│ lastName        │
│ isMember        │
│ membershipId──────→ Memberships
│ addressId────────→ Addresses
│ role            │
│ createdAt       │
└─────────────────┘
         │
         ├─→ Addresses
         │   ├─ state, district, mandal
         │   ├─ village, street, pincode
         │   └─ isComplete
         │
         ├─→ Memberships
         │   ├─ membershipId (VRPS format)
         │   ├─ startDate, status
         │   ├─ paymentId──→ Transactions
         │   └─ auditLog
         │
         └─→ Donations
             ├─ amount, type
             ├─ paymentStatus
             ├─ transactionId──→ Transactions
             └─ auditLog
\\\

---

## 10. RISKS & MITIGATION

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Payment failure cascades | HIGH | Retry logic, webhook verification, manual reconciliation |
| Data loss during migration | HIGH | Backup before migration, staging environment test |
| Unauthorized API access | HIGH | JWT verification, rate limiting, audit logging |
| Membership fee payment not confirmed | MEDIUM | Webhook verification, polling, payment reconciliation |
| Recurring donation failures | MEDIUM | Retry logic, user notification, pause auto-renewal |
| Performance degradation | MEDIUM | Indexing, query optimization, caching layer |
| Audit log storage bloat | LOW | Archive old logs, compression, TTL indexes |

---

## 11. SUCCESS METRICS

- [ ] 100% of users can complete registration
- [ ] Membership payment success rate >95%
- [ ] ID card generation <2 seconds
- [ ] Admin dashboard load time <3 seconds
- [ ] API response time <500ms (99th percentile)
- [ ] Zero unhandled payment errors
- [ ] Audit logs capture 100% of critical changes

---

