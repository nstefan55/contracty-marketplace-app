# Contracty - API Usage & Authentication Overview

## Authentication Architecture

### Overview
Contracty uses **NextAuth.js v5** with **MongoDB** for session persistence. The app supports multiple authentication methods:

1. **Google OAuth** - Third-party provider
2. **Email/Password** - Credentials provider with email verification
3. **Email Link (OTP)** - Passwordless sign-in via token

---

## Authentication Flow

### 1. **Configuration** (`auth.js`)

```javascript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapters: MongoDBAdapter(connectDB),
  providers: [
    GoogleProvider({...}),
    CredentialsProvider({...})
  ],
  callbacks: { signIn, jwt, session },
  pages: { signIn: "/signin" }
});
```

- **Adapter**: MongoDB stores sessions & user data
- **Handlers**: Exported for API routes (`/api/auth/[...nextauth]`)
- **Callbacks**: Handle JWT token and session population

---

### 2. **Provider Types**

#### **Google OAuth**
```javascript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  }
})
```

- User signs in with Google account
- **signIn callback** creates User in DB if new
- User marked as `needsOnboarding: true`

#### **Email/Password (Credentials)**
Three paths:

**a) Onboarding with Token** (Email verification flow)
```javascript
if (credentials.signInToken) {
  const user = await User.findOneAndUpdate({
    email: credentials.email,
    signInToken: credentials.signInToken,
    signInTokenExpiry: { $gt: new Date() }
  });
  // Token expires and is cleared
}
```

**b) OTP Sign-in** (Passwordless)
```javascript
if (!credentials.password) {
  const signInToken = cookieStore.get("signin_token")?.value;
  // Verify token from httpOnly cookie
}
```

**c) Password Sign-in** (Traditional)
```javascript
const user = await User.findOne({ email });
const isValid = await verifyPassword(password, user.password);
if (!isValid) throw new Error("Invalid email or password");
```

---

### 3. **Security Features**

#### **Rate Limiting**
```javascript
const { success, reset } = await authRateLimiter.limit(`credentials:${ip}`);
if (!success) throw new RateLimitError(retryAfter);
```
- Protects against brute-force attacks
- IP-based rate limiting on credentials provider
- Email-based rate limiting on Google provider

#### **Token Validation**
- Tokens are time-limited (`signInTokenExpiry`)
- Tokens cleared immediately after use
- Race-condition protection: stale tokens are cleared

#### **Email Verification**
```javascript
if (!user.emailVerified) {
  throw new Error("Please verify your email before signing in");
}
```

#### **Password Requirements**
- Minimum 12 characters for password changes
- Minimum 8 characters for registration
- Passwords hashed using `bcrypt`

---

## Session & Token Management

### **JWT Callback** - Populates token with user data
```javascript
async jwt({ token, user, account, trigger }) {
  // For Google OAuth: Query DB for full user data
  if (account?.provider === "google") {
    const dbUser = await User.findOne({ email: token.email });
    token.id = dbUser._id;
    token.role = dbUser.role;
    token.needsOnboarding = dbUser.needsOnboarding;
    // Load contractor slug if applicable
    if (dbUser.role === "contractor") {
      const contractor = await Contractor.findOne({ owner: dbUser._id });
      token.contractorSlug = contractor?.slug;
    }
  }
  
  // For Credentials: Use user object from authorize()
  if (user && account?.provider === "credentials") {
    token.id = user.id;
    token.role = user.role;
    // ...
  }
  
  // Self-heal: Re-check DB if onboarding pending
  if (token.needsOnboarding) {
    const dbUser = await User.findById(token.id);
    token.needsOnboarding = dbUser.needsOnboarding;
  }
  
  return token;
}
```

### **Session Callback** - Returns session to client
```javascript
async session({ session, token }) {
  session.user.id = token.id;
  session.user.role = token.role;
  session.user.needsOnboarding = token.needsOnboarding;
  session.user.contractorSlug = token.contractorSlug;
  return session;
}
```

### **Accessing Session in App**

**Server-side (Server Components / Actions)**
```javascript
import { auth } from "@/app/auth";

export async function createReview(contractorId, formData) {
  const session = await auth();
  if (!session) throw new Error("Sign in to leave a review");
  
  const userId = session.user.id;
  // ... protected operation
}
```

**Client-side (React Components)**
```javascript
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  if (!session) return <div>Not signed in</div>;
  
  return <div>Welcome, {session.user.email}</div>;
}
```

---

## API Routes & Protection

### **API Structure**
```
app/api/
├── auth/[...nextauth]/          # NextAuth handlers
├── contractors/[slug]/          # Public contractor data
├── register/                    # User registration
├── onboarding/                  # Profile setup
└── upload/                      # File uploads
```

### **Public Routes** (No Auth Required)
```javascript
// GET /api/contractors/[slug] - Export profile as JSON
export async function GET(request, { params }) {
  const contractor = await Contractor.findOne({ slug })
    .select("-owner")  // Hide sensitive data
    .lean();
  
  return NextResponse.json(contractor);
}
```

### **Protected Routes** (Auth Required via Server Actions)
```javascript
// app/actions/Review/createReview.js
export async function createReview(contractorId, formData) {
  const session = await auth();
  if (!session) throw new Error("Sign in to leave a review");
  
  // Validate & create review
  await Review.create({
    user: session.user.id,
    contractor: contractorId,
    rating: data.rating,
    comment: data.comment
  });
}
```

---

## API Usage Examples

### **1. Export Profile to JSON**
```javascript
// Frontend action
async function handleExport() {
  const res = await fetch(`/api/contractors/${slug}`);
  const data = await res.json();
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  // Trigger download
}
```

### **2. Register New User**
```javascript
// POST /api/register
const res = await fetch("/api/register", {
  method: "POST",
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePassword123"
  })
});

if (res.ok) {
  // User created, redirect to email verification
}
```

### **3. Sign In**
```javascript
// Using NextAuth signIn
import { signIn } from "@/app/auth";

// Email/Password
await signIn("credentials", {
  email: "john@example.com",
  password: "SecurePassword123"
});

// Google OAuth
await signIn("google");
```

### **4. Protected Action - Create Review**
```javascript
import { createReview } from "@/app/actions/Review/createReview";

// This automatically checks session via auth()
await createReview(contractorId, {
  rating: 5,
  comment: "Great work!"
});
```

---

## Session Data Structure

```javascript
{
  user: {
    id: "507f1f77bcf86cd799439011",        // MongoDB ObjectId
    email: "user@example.com",
    name: "John Doe",
    image: "/images/default-image.png",
    role: "contractor" | null,              // "contractor" or null
    needsOnboarding: false,                 // Pending profile setup
    contractorSlug: "john-doe" | null       // Contractor slug if applicable
  }
}
```

---

## Security Checklist

✅ **Sessions stored in MongoDB** - Persistent across server restarts  
✅ **Passwords hashed with bcrypt** - Never stored plain text  
✅ **Email verification required** - Credentials provider only  
✅ **Rate limiting** - IP-based & email-based  
✅ **httpOnly cookies** - XSS protection for OTP tokens  
✅ **CSRF protection** - Built into NextAuth  
✅ **Token expiration** - Sign-in tokens auto-expire  
✅ **Stale token cleanup** - Race-condition protection  
✅ **Owner field excluded from exports** - Privacy protection  

---

## Environment Variables Required

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>
GOOGLE_CLIENT_ID=<from-google-cloud>
GOOGLE_CLIENT_SECRET=<from-google-cloud>
MONGODB_URI=mongodb+srv://...
```
