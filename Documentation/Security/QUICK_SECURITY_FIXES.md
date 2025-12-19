# Quick Security Hardening Guide - Part 2

## 3. Add Password Validation (⏱️ 15 minutes)

### Why This Is Critical
Weak passwords are the #1 cause of account compromise.

### Current Code
No password validation enforced.

### Fix

**Add to Backend/backend/settings/base.py:**

```python
# Add this section
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,  # Require 12+ characters
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
```

This will:
- Require passwords to be at least 12 characters
- Prevent passwords that are too similar to username
- Prevent common passwords (like "password123")
- Prevent all-numeric passwords

**Test:**
```powershell
python manage.py shell
>>> from django.contrib.auth.password_validation import validate_password
>>> validate_password("weak")
Traceback: ValidationError: This password is too short...

>>> validate_password("MySecurePass123!")
# No error = password is good
```

---

## 4. Enable HTTPS Enforcement (⏱️ 45 minutes)

### Why This Is Critical
Without HTTPS, tokens are transmitted in plaintext over the network.

### Fix for Production

**Update Backend/backend/settings/prod.py:**

```python
# Add or uncomment these lines
SECURE_SSL_REDIRECT = True  # Force HTTP → HTTPS redirect
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Update CORS for HTTPS only
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',      # Change to your domain
    'https://www.yourdomain.com',
]

# Disable for production
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
```

**Get SSL Certificate (Let's Encrypt - Free):**

```bash
# On Ubuntu/Linux server
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Certificate stored in /etc/letsencrypt/live/yourdomain.com/
```

**Test HTTPS:**
```powershell
# After deploying to production
curl -I https://yourdomain.com/api/auth/me/
# Should show Security headers
```

---

## 5. Setup Rate Limiting (⏱️ 1 hour)

### Why This Is Critical
Without rate limiting, attackers can:
- Brute force login (try 1000 passwords/second)
- DDoS the API
- Exhaust resources

### Fix

**Step 1: Install django-ratelimit**

```powershell
cd Backend
pip install django-ratelimit
pip freeze > requirements.txt
```

**Step 2: Create rate limit views**

Add to `Backend/apps/users/views.py`:

```python
from django_ratelimit.decorators import ratelimit
from django.views.decorators.http import require_http_methods

@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def login_view(request):
    # This will block after 5 login attempts per minute
    pass
```

**Step 3: Apply to auth endpoints**

Or use middleware approach (simpler). Add to `Backend/backend/middleware.py`:

```python
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import decorator_from_middleware
from django.http import HttpResponse

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Rate limit login attempts
        if request.path == '/api/auth/login/' and request.method == 'POST':
            # This is basic; use django-ratelimit for production
            pass
        
        response = self.get_response(request)
        return response
```

**Alternative (Simpler): Use packages like django-rest-framework-throttling**

```python
# In settings/base.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10/minute',      # 10 requests/minute for anonymous
        'user': '100/minute'       # 100 requests/minute for authenticated
    }
}
```

---

## 6. Secure Token Storage (⏱️ 1.5 hours)

### Why This Is Critical
Current: Tokens stored in `localStorage` (vulnerable to XSS)
Risk: Any JavaScript error/vulnerability exposes all tokens

### Current Code
```javascript
// Frontend/src/api.js
const token = localStorage.getItem('access_token');  // ⚠️ XSS vulnerable
```

### Fix: Use httpOnly Cookies

**Backend Change (Backend/apps/users/views.py):**

```python
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import json

class SecureTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        
        tokens = serializer.validated_data
        
        response = Response({
            'detail': 'Login successful'
        }, status=status.HTTP_200_OK)
        
        # Set tokens in httpOnly cookies (immune to XSS)
        response.set_cookie(
            'access_token',
            value=tokens['access'],
            httponly=True,
            secure=True,  # HTTPS only
            samesite='Strict',
            max_age=60*60  # 1 hour
        )
        
        response.set_cookie(
            'refresh_token',
            value=tokens['refresh'],
            httponly=True,
            secure=True,
            samesite='Strict',
            max_age=60*60*24*7  # 7 days
        )
        
        return response
```

**Frontend Change (Frontend/src/api.js):**

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // ← Include cookies with requests
});

// Remove manual token injection - cookies are sent automatically
api.interceptors.request.use((config) => {
  // Tokens are now in httpOnly cookies, sent automatically
  return config;
});

// Keep refresh logic but simplified
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      
      try {
        // Refresh endpoint will automatically receive refresh_token cookie
        const { data } = await axios.post(
          `${API_URL}/auth/token/refresh/`,
          {},
          { withCredentials: true }
        );
        
        // New access_token is automatically set in cookie
        return api(original);
      } catch (e) {
        // Logout - cookies cleared by server
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API methods remain the same
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login/', { username, password }),
  logout: () => 
    api.post('/auth/logout/'),  // Will clear cookies
  getProfile: () => 
    api.get('/auth/me/'),
};
```

**Backend Logout Endpoint:**

```python
# In Backend/apps/users/views.py

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        response = Response({'detail': 'Logged out successfully'})
        
        # Clear cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response
```

**Update Backend Settings for Cookies:**

```python
# Backend/backend/settings/prod.py
CORS_ALLOW_CREDENTIALS = True  # Allow credentials
CSRF_TRUSTED_ORIGINS = ['https://yourdomain.com']
```

---

## 7. Enable HTTPS Locally for Testing (⏱️ 30 minutes)

### Generate Self-Signed Cert for Testing

```powershell
# Create certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365

# In Backend/backend/settings/dev.py
SECURE_SSL_REDIRECT = False  # Keep False for local dev
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')  # For nginx
```

---

## 8. Add Audit Logging (⏱️ 45 minutes)

### Why This Is Important
To detect unauthorized access and track who accessed patient data.

### Implementation

**Create Backend/core/audit.py:**

```python
import logging
from django.contrib.auth.models import User
from django.utils import timezone

logger = logging.getLogger('audit')

class AuditLog:
    @staticmethod
    def log_action(user, action, resource_type, resource_id, details=None, status='success'):
        """
        Log user actions for audit trail
        
        Args:
            user: User object
            action: 'CREATE', 'READ', 'UPDATE', 'DELETE'
            resource_type: 'Patient', 'Measurement', 'Prediction'
            resource_id: ID of resource
            details: Additional details
            status: 'success' or 'failed'
        """
        timestamp = timezone.now().isoformat()
        
        log_entry = {
            'timestamp': timestamp,
            'user': user.username if user else 'anonymous',
            'user_id': user.id if user else None,
            'action': action,
            'resource_type': resource_type,
            'resource_id': resource_id,
            'details': details,
            'status': status,
            'ip_address': None,  # Will be populated from request
        }
        
        logger.info(f"{action} {resource_type}#{resource_id} by {user.username}: {status}")
        
        return log_entry
```

**Use in Views:**

```python
from core.audit import AuditLog

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    # ... existing code ...
    
    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        
        patient_id = self.kwargs.get('id')
        AuditLog.log_action(
            user=request.user,
            action='READ',
            resource_type='Patient',
            resource_id=patient_id,
            details={'accessed_fields': 'full_name,dob'}
        )
        
        return response
    
    def destroy(self, request, *args, **kwargs):
        patient_id = self.kwargs.get('id')
        
        response = super().destroy(request, *args, **kwargs)
        
        AuditLog.log_action(
            user=request.user,
            action='DELETE',
            resource_type='Patient',
            resource_id=patient_id
        )
        
        return response
```

**Configure Logging in settings/base.py:**

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'audit_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': BASE_DIR / 'logs' / 'audit.log',
            'maxBytes': 1024 * 1024 * 10,  # 10MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'audit': {
            'handlers': ['audit_file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

---

## Summary of Changes

| Change | File(s) | Time | Priority |
|--------|---------|------|----------|
| Fix SECRET_KEY | base.py, .env | 15 min | 🔴 CRITICAL |
| Add Input Validation | serializers.py | 30 min | 🔴 CRITICAL |
| Password Validation | base.py | 15 min | 🔴 CRITICAL |
| HTTPS Enforcement | prod.py | 45 min | 🔴 CRITICAL |
| Rate Limiting | views.py, base.py | 1 hour | 🟡 HIGH |
| Secure Token Storage | api.js, views.py, base.py | 1.5 hours | 🔴 CRITICAL |
| Audit Logging | audit.py, views.py | 45 min | 🟡 HIGH |
| **TOTAL** | | **~4-5 hours** | |

---

## Quick Checklist Before Going Live

```bash
# 1. Security checks
☐ SECRET_KEY is random and in .env
☐ DEBUG=False in production
☐ HTTPS enabled and enforced
☐ CORS configured for production domain
☐ Input validation on all API endpoints
☐ Rate limiting configured
☐ Tokens in httpOnly cookies (not localStorage)
☐ Audit logging enabled
☐ Password validation enforced

# 2. Final verification
☐ Test login/logout
☐ Test API endpoints with real data
☐ Check SSL certificate
☐ Verify HTTPS redirect works
☐ Check rate limiting blocks excessive requests
☐ Verify audit logs are created

# 3. Backup & Documentation
☐ Database backup created
☐ Deployment documented
☐ Emergency contacts listed
☐ Recovery procedures tested
```

---

**IMPORTANT:** Do NOT skip these steps. A single missing control can compromise the entire application and user data.

**Next Steps:**
1. Implement all fixes from this guide
2. Test thoroughly in staging
3. Deploy to production
4. Monitor logs for errors
5. Address any issues immediately

---

**Last Updated:** November 21, 2025
**Estimated Completion:** 3-4 hours
**Difficulty:** Medium

