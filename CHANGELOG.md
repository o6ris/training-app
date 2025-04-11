## [0.7.7] - 2025-04-10

### 🔐 Auth & Profile

- **Password Reset**:  
  - Implemented password reset via Brevo in `request reset` route.

- **Login & Profile Flow**:
  - Added back navigation from `forgot-password` and `reset-password` to login.
  - Created a `create-profile` protected route for onboarding after signup.
  - Allowed editing of profile when navigating from `create-profile`.
  - User model now include `policy`, `newsletter`, and `first_connexion` flags.
  - Users can consent to newsletter and privacy policy during profile creation.
  - Navigation is hidden during onboarding in `create-profile`.

### 📄 Legal Compliance

- **Privacy & Terms**:
  - Created `Terms of Use` and `Privacy Policy` pages.
  - Added SEO metadata and included them in the sitemap.
  - Linked to privacy/terms pages from home and profile.

### 🛠️ Improvements

- Refactored metadata handling for better SEO on blog pages.
- Fixed `next.config.js` with proper CORS scope.
- Ensured navigation appears consistently after signup and across pages.
