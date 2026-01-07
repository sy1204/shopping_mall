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

    // Fetch user profile from 'profiles' table
    const fetchProfile = async (userId: string, email?: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }

            if (data) {
                // Map DB profile to App User type
                const appUser: User = {
                    email: data.email || email || '',
                    name: data.name || '',
                    phoneNumber: data.phone_number,
                    points: data.points || 0,
                    isAdmin: data.role === 'admin',
                    // Address fields missing in DB currently, omitting or using defaults
                };
                return appUser;
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);

            // Get current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const profile = await fetchProfile(session.user.id, session.user.email);
                if (profile) setUser(profile);
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const profile = await fetchProfile(session.user.id, session.user.email);
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

                // 2. Create Profile in 'profiles' table
                try {
                    console.log("Starting profile insert...");
                    console.log("Current session:", authData.session ? "exists" : "none");

                    const insertResult = await supabase
                        .from('profiles')
                        .insert(profilePayload);

                    console.log("Profile insert completed, result:", insertResult);

                    if (insertResult.error) {
                        console.error('Profile creation error:', insertResult.error);
                    } else {
                        console.log("Profile created successfully:", insertResult.data);
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
        // Dev backdoor for admin login without DB data
        if (email === 'admin@example.com' && password === 'admin1234') {
            const adminUser: User = {
                email: 'admin@example.com',
                name: 'Administrator',
                isAdmin: true,
                points: 999999,
                phoneNumber: '010-0000-0000'
            };
            setUser(adminUser);
            // Note: This dev login is not persisted across reloads because it bypasses Supabase session.
            // For full persistence, we'd need to mock the session or use localStorage.
            return true;
        }

        alert("관리자 로그인은 비밀번호가 필요합니다. 또는 아이디/비밀번호가 일치하지 않습니다.");
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
