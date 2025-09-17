'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User as UserType, AuthState, ROLE_PERMISSIONS } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

// Auth Context
const AuthContext = createContext<{
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Sample users for demo
const sampleUsers: Array<UserType & { password: string }> = [
  {
    id: '1',
    name: 'John Martinez',
    email: 'admin@tnt-transport.com',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'Lisa Chen',
    email: 'manager@tnt-transport.com',
    role: 'manager',
    avatar: '/avatars/manager.jpg',
    password: 'manager123'
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'dispatcher@tnt-transport.com',
    role: 'dispatcher',
    avatar: '/avatars/dispatcher.jpg',
    password: 'dispatcher123'
  }
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    permissions: []
  });

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('tnt-user');
    if (savedUser) {
      const user = JSON.parse(savedUser) as UserType;
      setAuthState({
        user,
        isAuthenticated: true,
        permissions: ROLE_PERMISSIONS[user.role] || []
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = sampleUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        permissions: ROLE_PERMISSIONS[user.role] || []
      });
      localStorage.setItem('tnt-user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      permissions: []
    });
    localStorage.removeItem('tnt-user');
  };

  const hasPermission = (resource: string, action: string): boolean => {
    return authState.permissions.some(
      perm => perm.resource === resource && perm.actions.includes(action)
    );
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

interface LoginFormProps {
  onLogin?: (user: UserType) => void;
  className?: string;
}

export function LoginForm({ onLogin, className }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState<'admin' | 'manager' | 'dispatcher' | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'manager' | 'dispatcher') => {
    const demoUser = sampleUsers.find(u => u.role === role);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password);
      setSelectedDemo(role);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-tnt-black to-tnt-red p-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            {/* TNT Logo */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-tnt-black to-tnt-red rounded-lg">
                <span className="text-white font-bold text-2xl">TNT</span>
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-tnt-black mb-2">
              TNT Transportation
            </CardTitle>
            <p className="text-tnt-red font-medium text-sm mb-4">
              Speed-to-Lead Dashboard
            </p>
            <p className="text-gray-600 text-sm">
              Driven by Service, Defined by Excellence
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Demo User Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Demo Login Options</Label>
              <div className="grid grid-cols-1 gap-2">
                {sampleUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant={selectedDemo === user.role ? "default" : "outline"}
                    size="sm"
                    className="justify-start h-auto p-3"
                    onClick={() => handleDemoLogin(user.role as 'admin' | 'manager' | 'dispatcher')}
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{user.role} Access</div>
                      </div>
                      <Badge variant="secondary" className="ml-auto text-xs capitalize">
                        {user.role}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or login manually</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-tnt-red hover:bg-tnt-red-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Role Permissions Info */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Role Permissions</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                  <span>Full system access, user management, settings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Manager</Badge>
                  <span>Lead management, analytics, communications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">Dispatcher</Badge>
                  <span>Lead handling, communication tracking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center"
        >
          <p className="text-white text-sm mb-2">Demo Credentials:</p>
          <div className="grid grid-cols-1 gap-1 text-xs text-white/80">
            <div>Admin: admin@tnt-transport.com / admin123</div>
            <div>Manager: manager@tnt-transport.com / manager123</div>
            <div>Dispatcher: dispatcher@tnt-transport.com / dispatcher123</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: { resource: string; action: string };
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission
}: ProtectedRouteProps) {
  const { authState, hasPermission } = useAuth();

  if (!authState.isAuthenticated) {
    return <LoginForm />;
  }

  if (requiredRole && authState.user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this resource.
            </p>
            <p className="text-sm text-gray-500">
              Required role: <Badge>{requiredRole}</Badge><br />
              Your role: <Badge>{authState.user?.role}</Badge>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Insufficient Permissions</h2>
            <p className="text-gray-600 mb-4">
              You don't have the required permissions for this action.
            </p>
            <p className="text-sm text-gray-500">
              Required: {requiredPermission.action} on {requiredPermission.resource}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthenticationSystem() {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Authentication Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-tnt-red rounded-full flex items-center justify-center text-white font-bold">
                {authState.user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold">{authState.user?.name}</p>
                <p className="text-sm text-gray-600">{authState.user?.email}</p>
                <Badge className="mt-1 capitalize">{authState.user?.role}</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Your Permissions</h4>
              <div className="space-y-2">
                {authState.permissions.map((perm, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="outline">{perm.resource}</Badge>
                    <span className="text-sm text-gray-600">
                      {perm.actions.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}