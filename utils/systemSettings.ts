// utils/systemSettings.ts
export interface SystemSetting {
    id: string;
    key: string;
    value: string;
    category: 'basic' | 'policy';
}

const STORAGE_KEY = 'shop_system_settings';

const defaultSettings: SystemSetting[] = [
    { id: '1', key: 'mall_name', value: '29CM STYLE', category: 'basic' },
    { id: '2', key: 'contact_email', value: 'contact@29cmstyle.com', category: 'basic' },
    { id: '3', key: 'contact_phone', value: '1588-0000', category: 'basic' },
    { id: '4', key: 'business_hours', value: '평일 09:00-18:00', category: 'basic' },
    { id: '5', key: 'terms_of_service', value: '서비스 이용약관 내용입니다.', category: 'policy' },
    { id: '6', key: 'privacy_policy', value: '개인정보 처리방침 내용입니다.', category: 'policy' },
    { id: '7', key: 'refund_policy', value: '환불 규정 내용입니다.', category: 'policy' },
];

export function getSettings(): SystemSetting[] {
    if (typeof window === 'undefined') return defaultSettings;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
        return defaultSettings;
    }
    return JSON.parse(saved);
}

export function saveSetting(setting: SystemSetting) {
    const all = getSettings();
    const index = all.findIndex(s => s.id === setting.id);
    if (index >= 0) {
        all[index] = setting;
    } else {
        all.push(setting);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all;
}

export function deleteSetting(id: string) {
    const all = getSettings();
    const filtered = all.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
}

export function addSetting(setting: Omit<SystemSetting, 'id'>) {
    const all = getSettings();
    const newSetting: SystemSetting = { ...setting, id: `set_${Date.now()}` };
    all.push(newSetting);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all;
}
