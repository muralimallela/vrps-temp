# Community Transparency & Recognition Feature

## Overview

A comprehensive system for showcasing community transparency, trust, and member recognition while maintaining strict privacy protections. Users have complete control over their public visibility with opt-in-only settings.

## Architecture & Implementation

### Database Schema Updates

#### User Model Changes

```javascript
// New fields added to User schema
{
  publicVisibility: {
    type: String,
    enum: ["private", "public", "anonymous"],
    default: "private",
    index: true,
  },
  publicDisplayName: { type: String, default: "" },
  showMembershipPublically: { type: Boolean, default: false, index: true },
}
```

#### Donation Model Changes

```javascript
// New fields added to Donation schema
{
  publicVisibility: {
    type: String,
    enum: ["private", "public", "anonymous"],
    default: "private",
    index: true,
  },
  publicDisplayName: { type: String, default: "" },
  supporterMessage: { type: String, default: "" },
  showDonationPublicly: { type: Boolean, default: false, index: true },
}
```

### Privacy Levels

#### Private (Default)

- User is NOT displayed anywhere publicly
- Membership and donations remain completely hidden
- Used as default for all new users

#### Anonymous

- User contributions are visible but identity is hidden
- Shows "Anonymous" instead of name
- Membership ID partially masked
- Donor message still visible (optional)
- Personal details NEVER exposed

#### Public

- Full name or custom display name visible
- Membership ID (partially masked): "VRPS26\*\*\*\*"
- Donation details visible
- Optional supporter message visible
- Custom public name can be set

### API Endpoints

#### 1. Public Members `/api/public/members`

**GET** - Retrieve paginated list of members who opted in

```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  success: boolean,
  data: [
    {
      _id: string,
      displayName: string,
      membershipId: string (masked or null),
      joinDate: "Month Year",
      city: string,
      district: string,
      isAnonymous: boolean
    }
  ],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

#### 2. Public Donations `/api/public/donations`

**GET** - Retrieve paginated list of public donations

```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)

Response:
{
  success: boolean,
  data: [
    {
      _id: string,
      displayName: string,
      amount: number,
      donationType: "one_time" | "monthly",
      donationDate: "Month DD, Year",
      supporterMessage: string (optional),
      isAnonymous: boolean
    }
  ],
  pagination: {...}
}
```

#### 3. Community Statistics `/api/public/stats`

**GET** - Retrieve community impact statistics

```
Response:
{
  success: boolean,
  data: {
    totalMembers: number,
    totalSupporters: number,
    totalDonationAmount: number (₹),
    newMembersThisMonth: number,
    monthlyDonationAmount: number (₹),
    monthlyDonationCount: number
  }
}
```

#### 4. User Consent Preferences `/api/profile/consent-preferences`

**GET** - Fetch current user's privacy settings
**PUT** - Update user's privacy settings

```
PUT Body:
{
  publicVisibility: "private" | "public" | "anonymous",
  publicDisplayName?: string,
  showMembershipPublically?: boolean,
  showDonationPublicly?: boolean
}

Response:
{
  success: boolean,
  message: string,
  data: {
    publicVisibility: string,
    publicDisplayName: string,
    showMembershipPublically: boolean,
    showDonationPublicly: boolean
  }
}
```

### UI Components

#### 1. TransparencyStats

Displays community impact statistics in a card-based layout

- Total active members
- Total supporters
- Total donations
- New members this month

#### 2. MemberCard

Individual member profile card (public view)

- Displays name (first initial + last initial)
- Membership ID (masked)
- Join date
- City/District
- Anonymous indicator

#### 3. DonorCard

Individual donor/supporter profile card

- Display name or "Anonymous"
- Donation amount
- Donation type (one-time/monthly)
- Donation date
- Optional supporter message

#### 4. ConsentPreferences

User-facing settings panel in profile

- Radio buttons for visibility levels
- Optional custom display name field
- Clear descriptions of each option
- Save/update functionality
- Privacy notice

### Public Pages

#### /community/members

- Lists all members who opted in
- Pagination support
- Search/filter capability (optional)
- Statistics showing total members

#### /community/supporters

- Lists all donors who opted in
- Pagination support
- Displays contribution amount and date
- Shows supporter messages (if consented)

#### /community/impact

- Displays community statistics
- Links to members and supporters pages
- Privacy information
- Call-to-action for membership/donations

### User Flow

#### During Membership Registration

1. User completes membership form
2. At confirmation screen, presented with consent option:
   - "Show my membership publicly"
   - "Show my name publicly"
   - "Remain anonymous"
3. Default: Unchecked (Private)

#### During Donation Checkout

1. User enters donation amount
2. Before payment, consent options presented:
   - "Show my contribution publicly"
   - Display name option
   - Message option for public display
3. Default: Unchecked (Private)

#### In User Profile

1. Navigate to "Privacy & Visibility" section
2. View current settings
3. Update any preference
4. Instant save with confirmation

### Privacy Guarantees

#### Never Public

- Email address
- Phone number
- Full home address
- Government ID numbers
- Payment details
- Transaction IDs
- Account credentials

#### Conditional (Opt-In Only)

- First name + last initial
- Membership ID (partial)
- City/District
- Join date
- Donation amount (only if consented)
- Donor message

#### Always Under User Control

- Visibility setting (private/anonymous/public)
- Custom display name
- Supporter message
- Whether to participate at all

### Implementation Checklist

- ✅ Database schema updated (User & Donation models)
- ✅ API endpoints created
  - ✅ `/api/public/members`
  - ✅ `/api/public/donations`
  - ✅ `/api/public/stats`
  - ✅ `/api/profile/consent-preferences`
- ✅ UI Components created
  - ✅ `TransparencyStats`
  - ✅ `MemberCard`
  - ✅ `DonorCard`
  - ✅ `ConsentPreferences`
- ✅ Public pages created
  - ✅ `/community/members`
  - ✅ `/community/supporters`
  - ✅ `/community/impact`
- ⏳ Integration with membership registration form
- ⏳ Integration with donation checkout flow
- ⏳ Add navigation links to navbar
- ⏳ i18n translations for all UI text
- ⏳ Testing & QA

### Data Security

1. **Query Filtering**: All public endpoints filter by consent flags
2. **Field Masking**: Sensitive data masked in queries
3. **Authentication**: Consent updates require authentication
4. **Validation**: All inputs validated before database operations
5. **Logging**: Changes to consent preferences are logged

### Performance Considerations

1. **Indexing**: All public visibility fields indexed for fast filtering
2. **Pagination**: All public endpoints paginated (default 20 items)
3. **Aggregation**: MongoDB aggregation used for complex queries
4. **Caching**: Consider Redis caching for statistics

### Future Enhancements

1. Search/filter by city/district
2. Donation trends visualization
3. Member achievement badges
4. Monthly donor highlights
5. Community milestones
6. Activity feeds
7. Export community report (PDF)

## Usage Examples

### Fetching Public Members

```javascript
const response = await fetch("/api/public/members?page=1&limit=20");
const { data, pagination } = await response.json();
```

### Updating User Privacy Settings

```javascript
const response = await fetch("/api/profile/consent-preferences", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    publicVisibility: "public",
    publicDisplayName: "Murali",
    showMembershipPublically: true,
  }),
});
```

### Getting Community Statistics

```javascript
const response = await fetch("/api/public/stats");
const { data } = await response.json();
console.log(`${data.totalMembers} members, ${data.totalSupporters} supporters`);
```
