# 🔐 Authentication System Setup

Summit Chronicles now has comprehensive authentication using NextAuth.js with multiple providers and role-based access control.

## 🎯 **Current Setup**

### **Authentication Providers** ✅
1. **Google OAuth** - Primary authentication method
2. **Credentials** - Fallback admin login
3. **Role-Based Access** - Admin and Owner roles
4. **Protected Routes** - Secure admin areas

### **Security Features** ✅
- JWT-based sessions (24-hour expiration)
- Role-based authorization
- Protected API routes
- Secure admin dashboard
- Session management

## 🔧 **Required Environment Variables**

Add these to your Vercel environment variables or `.env.local`:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=https://summitchronicles.com

# Google OAuth (for admin sign-in)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Admin Credentials (fallback authentication)
ADMIN_EMAIL=admin@summitchronicles.com
ADMIN_PASSWORD=your-secure-admin-password

# Owner Credentials (highest privilege)
SUNITH_PASSWORD=your-secure-owner-password
```

## 🚀 **Setup Steps**

### 1. **Generate NextAuth Secret**
```bash
# Generate a secure random secret
openssl rand -base64 32
```

### 2. **Set up Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://summitchronicles.com/api/auth/callback/google`
6. Copy Client ID and Client Secret

### 3. **Configure Admin Access**
- Set `ADMIN_EMAIL` to the Google account that should have admin access
- Set strong passwords for `ADMIN_PASSWORD` and `SUNITH_PASSWORD`

## 🛡️ **Access Levels**

### **Owner Role** (Highest Privilege)
- Email: `sunith@summitchronicles.com`
- Full system access
- Can manage all content and settings
- Access via Google OAuth or credentials

### **Admin Role** (Management Access)
- Email: `ADMIN_EMAIL` environment variable
- Can manage blog, newsletter, analytics
- Protected admin dashboard access
- Access via Google OAuth or credentials

### **Public Access**
- Regular site visitors
- Can use Ask Sunith AI
- Can sign up for newsletter
- No admin access

## 🔐 **Authentication Flow**

### **Admin Sign-In Process**:
1. User visits `/admin`
2. Redirected to `/admin/auth/signin` if not authenticated
3. Options:
   - **Google OAuth**: One-click sign-in (restricted to authorized emails)
   - **Credentials**: Email + password fallback
4. Role verification after successful authentication
5. Redirect to admin dashboard or access denied

### **API Protection**:
- Admin API routes check session and role
- Protected routes use `ProtectedRoute` component
- Automatic redirect for unauthorized access

## 🎨 **Custom Sign-In Page**

**URL**: `/admin/auth/signin`
**Features**:
- Branded Summit Chronicles design
- Google OAuth integration
- Fallback credential authentication
- Error handling and user feedback
- Responsive mobile design

## 🚨 **Error Handling**

**Error Page**: `/admin/auth/error`
**Error Types**:
- `Configuration`: Server setup issues
- `AccessDenied`: Unauthorized email/role
- `Verification`: Token issues
- `Default`: General authentication errors

## 📱 **Usage Examples**

### **Protecting a Page**:
```tsx
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requireRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### **Getting User Session**:
```tsx
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>
  if (!session) return <p>Not authenticated</p>
  
  return <p>Hello {session.user?.name}!</p>
}
```

### **Sign Out**:
```tsx
import { signOut } from "next-auth/react";

<button onClick={() => signOut({ callbackUrl: "/" })}>
  Sign Out
</button>
```

## 🔧 **API Route Protection**

Example protected API route:
```typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !["admin", "owner"].includes(session.user.role)) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Protected API logic here
}
```

## 🚀 **Deployment Checklist**

- [ ] Add all environment variables to Vercel
- [ ] Configure Google OAuth redirect URLs
- [ ] Test admin authentication flow
- [ ] Verify role-based access control
- [ ] Test error handling and redirects

---

## 🛠️ **Troubleshooting**

**Common Issues**:
1. **"Configuration Error"**: Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
2. **"Access Denied"**: Verify email is in authorized list
3. **Google OAuth fails**: Check client ID, secret, and redirect URLs
4. **Session not persisting**: Verify `NEXTAUTH_SECRET` is set

The authentication system provides enterprise-level security while maintaining ease of use for authorized administrators.