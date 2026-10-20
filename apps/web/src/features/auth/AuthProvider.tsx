import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiRequest, clearAccessToken, setAccessToken } from '../../shared/api/apiClient';
import {
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  userSchema,
  type LoginRequest,
  type User,
} from '../../shared/api/schemas';

export type AuthExtension = {
  kind: 'additional-auth-step';
  challengeId: string;
  requirements: readonly string[];
};

type AuthValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);
const emptyUserSchema = userSchema.nullable();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void apiRequest('/auth/me', emptyUserSchema)
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const clearSession = () => {
      setUser(null);
    };
    window.addEventListener('ifarm:auth-expired', clearSession);
    return () => {
      active = false;
      window.removeEventListener('ifarm:auth-expired', clearSession);
    };
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    const validRequest = loginRequestSchema.parse(request);
    const response = await apiRequest('/auth/login', loginResponseSchema, {
      method: 'POST',
      body: JSON.stringify(validRequest),
    });
    setAccessToken(response.accessToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest('/auth/logout', logoutResponseSchema, { method: 'POST' });
    } finally {
      clearAccessToken();
      setUser(null);
      window.dispatchEvent(new Event('ifarm:auth-expired'));
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: user !== null, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
