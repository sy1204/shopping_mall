// utils/systemSettings.ts
import { supabase } from "./supabase/client";

export interface SystemSetting {
    id: string;
    key: string;
    value: string;
    category: 'basic' | 'policy';
}

const defaultSettings: SystemSetting[] = [
    { id: '1', key: 'mall_name', value: '29CM STYLE', category: 'basic' },
    { id: '2', key: 'contact_email', value: 'contact@29cmstyle.com', category: 'basic' },
    { id: '3', key: 'contact_phone', value: '1588-0000', category: 'basic' },
    { id: '4', key: 'business_hours', value: '평일 09:00-18:00', category: 'basic' },
    { id: '5', key: 'terms_of_service', value: '서비스 이용약관 내용입니다.', category: 'policy' },
    { id: '6', key: 'privacy_policy', value: '개인정보 처리방침 내용입니다.', category: 'policy' },
    { id: '7', key: 'refund_policy', value: '환불 규정 내용입니다.', category: 'policy' },
];

export async function getSettings(): Promise<SystemSetting[]> {
    const { data, error } = await supabase
        .from('system_settings')
        .select('*');

    if (error) {
        console.error('Failed to fetch settings:', error);
        return defaultSettings;
    }

    if (!data || data.length === 0) {
        return defaultSettings;
    }

    return data.map(row => ({
        id: row.id as string,
        key: row.key as string,
        value: row.value as string,
        category: row.category as 'basic' | 'policy',
    }));
}

export async function saveSetting(setting: SystemSetting): Promise<SystemSetting[]> {
    const { error } = await supabase
        .from('system_settings')
        .upsert({
            id: setting.id,
            key: setting.key,
            value: setting.value,
            category: setting.category,
        });

    if (error) {
        console.error('Failed to save setting:', error);
        throw error;
    }

    return getSettings();
}

export async function deleteSetting(id: string): Promise<SystemSetting[]> {
    const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Failed to delete setting:', error);
        throw error;
    }

    return getSettings();
}

export async function addSetting(setting: Omit<SystemSetting, 'id'>): Promise<SystemSetting[]> {
    const { error } = await supabase
        .from('system_settings')
        .insert({
            key: setting.key,
            value: setting.value,
            category: setting.category,
        });

    if (error) {
        console.error('Failed to add setting:', error);
        throw error;
    }

    return getSettings();
}
