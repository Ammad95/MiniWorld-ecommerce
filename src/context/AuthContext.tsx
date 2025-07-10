import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  mobile: string;
  role: 'super_admin' | 'admin';
  isFirstLogin: boolean;
  createdAt: string;
  createdBy?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; requirePasswordChange?: boolean }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  createSubAdmin: (userData: { email: string; name: string; mobile: string }) => Promise<{ success: boolean; message: string; tempPassword?: string }>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  deleteUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  getUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock password storage (in real app, this would be handled by backend)
const passwordStore: { [email: string]: string } = {
  'ammad_777@hotmail.com': 'MyMW@123'
};

// Generate random password
const generateTempPassword = (): string => {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Mock email service
const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  console.log(`📧 Email sent to: ${to}`);
  console.log(`📋 Subject: ${subject}`);
  console.log(`📄 Body: ${body}`);
  
  // Show notification to admin (since we can't actually send email)
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="font-semibold">Email Sent!</div>
    <div class="text-sm">Temporary credentials sent to ${to}</div>
    <div class="text-xs mt-1">Check console for details</div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
  
  return true;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    users: []
  });

  // Initialize super admin and load data
  useEffect(() => {
    const storedAuth = localStorage.getItem('miniworld_auth');
    const storedUsers = localStorage.getItem('miniworld_users');
    
    let users: User[] = [];
    
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    } else {
      // Initialize with super admin
      const superAdmin: User = {
        id: 'super_admin_1',
        email: 'ammad_777@hotmail.com',
        name: 'Super Administrator',
        mobile: '+1-234-567-8900',
        role: 'super_admin',
        isFirstLogin: false,
        createdAt: new Date().toISOString()
      };
      users = [superAdmin];
      localStorage.setItem('miniworld_users', JSON.stringify(users));
    }
    
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      const user = users.find(u => u.id === authData.userId);
      if (user) {
        setState({
          user,
          isAuthenticated: true,
          users
        });
      }
    } else {
      setState(prev => ({ ...prev, users }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; requirePasswordChange?: boolean }> => {
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    const storedPassword = passwordStore[email.toLowerCase()];
    if (!storedPassword || storedPassword !== password) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    // Store auth data
    localStorage.setItem('miniworld_auth', JSON.stringify({ userId: user.id }));
    
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: true
    }));
    
    if (user.isFirstLogin) {
      return { 
        success: true, 
        message: 'Login successful. Please change your password.', 
        requirePasswordChange: true 
      };
    }
    
    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    localStorage.removeItem('miniworld_auth');
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false
    }));
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!state.user) {
      return { success: false, message: 'Not authenticated' };
    }
    
    const storedPassword = passwordStore[state.user.email.toLowerCase()];
    if (storedPassword !== oldPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    if (newPassword.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long' };
    }
    
    // Update password
    passwordStore[state.user.email.toLowerCase()] = newPassword;
    
    // Update user's first login status
    const updatedUsers = state.users.map(user => 
      user.id === state.user!.id 
        ? { ...user, isFirstLogin: false }
        : user
    );
    
    const updatedUser = { ...state.user, isFirstLogin: false };
    
    localStorage.setItem('miniworld_users', JSON.stringify(updatedUsers));
    
    setState(prev => ({
      ...prev,
      user: updatedUser,
      users: updatedUsers
    }));
    
    return { success: true, message: 'Password changed successfully' };
  };

  const createSubAdmin = async (userData: { email: string; name: string; mobile: string }): Promise<{ success: boolean; message: string; tempPassword?: string }> => {
    if (!state.user || state.user.role !== 'super_admin') {
      return { success: false, message: 'Unauthorized' };
    }
    
    // Check if user already exists
    if (state.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'User with this email already exists' };
    }
    
    const tempPassword = generateTempPassword();
    const newUser: User = {
      id: `admin_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      mobile: userData.mobile,
      role: 'admin',
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      createdBy: state.user.id
    };
    
    // Store password
    passwordStore[userData.email.toLowerCase()] = tempPassword;
    
    // Update users list
    const updatedUsers = [...state.users, newUser];
    localStorage.setItem('miniworld_users', JSON.stringify(updatedUsers));
    
    setState(prev => ({
      ...prev,
      users: updatedUsers
    }));
    
    // Send email
    const emailSubject = 'Admin Access - MiniWorld';
    const emailBody = `
Hello ${userData.name},

You have been granted admin access to MiniWorld.

Your temporary login credentials:
Email: ${userData.email}
Password: ${tempPassword}

Please log in and change your password immediately for security.

Login URL: ${window.location.origin}/admin

Best regards,
MiniWorld Team
    `;
    
    await sendEmail(userData.email, emailSubject, emailBody);
    
    return { 
      success: true, 
      message: 'Sub-admin created successfully and email sent!',
      tempPassword 
    };
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!state.user || state.user.role !== 'super_admin') {
      return { success: false, message: 'Unauthorized' };
    }
    
    const updatedUsers = state.users.map(user => 
      user.id === userId 
        ? { ...user, ...userData }
        : user
    );
    
    localStorage.setItem('miniworld_users', JSON.stringify(updatedUsers));
    
    setState(prev => ({
      ...prev,
      users: updatedUsers
    }));
    
    return { success: true, message: 'User updated successfully' };
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
    if (!state.user || state.user.role !== 'super_admin') {
      return { success: false, message: 'Unauthorized' };
    }
    
    const userToDelete = state.users.find(u => u.id === userId);
    if (!userToDelete) {
      return { success: false, message: 'User not found' };
    }
    
    if (userToDelete.role === 'super_admin') {
      return { success: false, message: 'Cannot delete super admin' };
    }
    
    const updatedUsers = state.users.filter(user => user.id !== userId);
    
    // Remove password
    delete passwordStore[userToDelete.email.toLowerCase()];
    
    localStorage.setItem('miniworld_users', JSON.stringify(updatedUsers));
    
    setState(prev => ({
      ...prev,
      users: updatedUsers
    }));
    
    return { success: true, message: 'User deleted successfully' };
  };

  const getUsers = (): User[] => {
    return state.users;
  };

  return (
    <AuthContext.Provider value={{
      state,
      login,
      logout,
      changePassword,
      createSubAdmin,
      updateUser,
      deleteUser,
      getUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 