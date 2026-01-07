'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<boolean>;
    register: (email: string, password: string, name: string, phone?: string, addressData?: { zonecode?: string; address?: string; addressDetail?: string }) => Promise<{ success: boolean; error?: string }>;
    adminLogin: (email: string, password?: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (updatedData: Partial<User>) => Promise<void>;
    deleteUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fetch user profile from 'profiles' table using direct fetch
    const fetchProfile = async (userId: string, email?: string, accessToken?: string) => {
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            const response = await fetch(
                `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=*`,
                {
                    headers: {
                        'apikey': supabaseKey || '',
                        'Authorization': `Bearer ${accessToken || supabaseKey}`,
                    }
                }
            );

            if (!response.ok) {
                console.error('Error fetching profile:', response.status);
                return null;
            }

            const data = await response.json();

            if (data && data[0]) {
                const profileData = data[0];
                const appUser: User = {
                    email: profileData.email || email || '',
                    name: profileData.name || '',
                    phoneNumber: profileData.phone_number,
                    points: profileData.points || 0,
                    isAdmin: profileData.role === 'admin',
                };
                return appUser;
            }
        } catch (e) {
            console.error('fetchProfile error:', e);
        }
        return null;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);

            // Get current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const profile = await fetchProfile(session.user.id, session.user.email, session.access_token);
                if (profile) setUser(profile);
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const profile = await fetchProfile(session.user.id, session.user.email, session.access_token);
                    setUser(profile);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            });

            setIsLoading(false);
            return () => subscription.unsubscribe();
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password?: string): Promise<boolean> => {
        if (!password) {
            // Legacy/Demo login support removal? 
            // Supabase requires password. If app flow sends no password, we can't login.
            alert("비밀번호가 필요합니다.");
            return false;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error.message);
            alert(`로그인 실패: ${error.message}`);
            return false;
        }

        return true;
    };

    const register = async (email: string, password: string, name: string, phone?: string, addressData?: { zonecode?: string; address?: string; addressDetail?: string }): Promise<{ success: boolean; error?: string }> => {
        const trimmedEmail = email.trim();
        console.log("Attempting registration for:", trimmedEmail);
        try {
            // 1. Supabase Auth SignUp
            console.log("Calling supabase.auth.signUp...");
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: trimmedEmail,
                password,
                options: {
                    data: { name, phone } // Metadata
                }
            });
            console.log("SignUp response:", { authData, authError });

            if (authError) {
                console.error("Supabase Auth Error:", authError);
                return { success: false, error: authError.message };
            }

            if (authData.user) {
                console.log("User created with ID:", authData.user.id);
                const profilePayload = {
                    id: authData.user.id,
                    email: trimmedEmail,
                    name,
                    phone_number: phone,
                    role: 'customer',
                    points: 1000
                };
                console.log("Inserting profile with data:", profilePayload);

                // 2. Create Profile in 'profiles' table using direct fetch
                try {
                    console.log("Starting profile insert via fetch...");

                    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                    const accessToken = authData.session?.access_token;

                    const response = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
                        method: 'POST',
                        headers: {
                            'apikey': supabaseKey || '',
                            'Authorization': `Bearer ${accessToken || supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify(profilePayload)
                    });

                    console.log("Fetch response status:", response.status);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Profile creation error:', errorText);
                    } else {
                        console.log("Profile created successfully!");
                        // Set user state immediately after signup
                        const newUser: User = {
                            email: trimmedEmail,
                            name,
                            phoneNumber: phone,
                            points: 1000,
                            isAdmin: false
                        };
                        setUser(newUser);
                    }
                } catch (insertError: any) {
                    console.error("Profile insert exception:", insertError);
                }

                return { success: true };
            }

            return { success: false, error: "회원가입에 실패했습니다. (User data missing)" };

        } catch (e: any) {
            console.error("Unexpected error during registration:", e);
            return { success: false, error: e.message };
        }
    };

    const adminLogin = async (email: string, password?: string): Promise<boolean> => {
        if (!password) {
            alert("비밀번호가 필요합니다.");
            return false;
        }

        try {
            // Login using Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                console.error('Admin login error:', authError);
                alert(`로그인 실패: ${authError.message}`);
                return false;
            }

            if (authData.user && authData.session) {
                // Fetch profile to check admin role
                const profile = await fetchProfile(authData.user.id, email, authData.session.access_token);

                if (profile && profile.isAdmin) {
                    setUser(profile);
                    return true;
                } else {
                    // Not an admin - sign out and reject
                    await supabase.auth.signOut();
                    alert("관리자 권한이 없는 계정입니다.");
                    return false;
                }
            }
        } catch (e) {
            console.error('Admin login exception:', e);
        }

        alert("로그인에 실패했습니다.");
        return false;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
    };

    const updateUser = async (updatedData: Partial<User>) => {
        // This only updates local state? Use DB update.
        if (!user) return;

        // Find ID? user object doesn't have ID in this Interface, but we need it.
        // We can get it from session.
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                name: updatedData.name,
                phone_number: updatedData.phoneNumber,
                // Only update mapped fields
            })
            .eq('id', session.user.id);

        if (!error) {
            setUser(prev => prev ? { ...prev, ...updatedData } : null);
        }
    };

    const deleteUser = async () => {
        // Deleting user usually needs Admin API or specific RLS. 
        // For now just sign out.
        await logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, adminLogin, logout, updateUser, deleteUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
