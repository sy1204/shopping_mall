// app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSettings, saveSetting, deleteSetting, addSetting, SystemSetting } from '@/utils/systemSettings';

export default function AdminSettingsPage() {
    const searchParams = useSearchParams();
    const tab = searchParams?.get('tab') || 'basic';

    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ key: '', value: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSettings();
            setSettings(data);
        };
        fetchSettings();
    }, []);

    const handleSave = async (setting: SystemSetting) => {
        const updated = await saveSetting(setting);
        setSettings(updated);
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const updated = await deleteSetting(id);
            setSettings(updated);
        }
    };

    const handleAdd = async () => {
        if (!formData.key || !formData.value) {
            alert('모든 항목을 입력해주세요');
            return;
        }
        const updated = await addSetting({ ...formData, category: tab as 'basic' | 'policy' });
        setSettings(updated);
        setFormData({ key: '', value: '' });
    };

    const filteredSettings = settings.filter(s => s.category === tab);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">시스템 관리</h1>
            </div>

            <div className="bg-white border rounded-lg p-6">
                {tab === 'basic' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4 pb-2 border-b">기본 설정</h2>
                        <div className="space-y-4">
                            {filteredSettings.map(setting => (
                                <div key={setting.id} className="flex items-center gap-4 p-3 border rounded">
                                    {editingId === setting.id ? (
                                        <>
                                            <input
                                                type="text"
                                                className="flex-1 border rounded px-2 py-1"
                                                value={setting.key}
                                                onChange={e => setSettings(settings.map(s =>
                                                    s.id === setting.id ? { ...s, key: e.target.value } : s
                                                ))}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 border rounded px-2 py-1"
                                                value={setting.value}
                                                onChange={e => setSettings(settings.map(s =>
                                                    s.id === setting.id ? { ...s, value: e.target.value } : s
                                                ))}
                                            />
                                            <button
                                                onClick={() => handleSave(setting)}
                                                className="px-3 py-1 bg-black text-white rounded text-sm"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-3 py-1 border rounded text-sm"
                                            >
                                                취소
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{setting.key}</div>
                                                <div className="text-gray-600 text-xs">{setting.value}</div>
                                            </div>
                                            <button
                                                onClick={() => setEditingId(setting.id)}
                                                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => handleDelete(setting.id)}
                                                className="px-3 py-1 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div className="flex gap-2 p-3 border-2 border-dashed rounded bg-gray-50">
                                <input
                                    type="text"
                                    placeholder="키 (예: contact_email)"
                                    className="flex-1 border rounded px-2 py-1"
                                    value={formData.key}
                                    onChange={e => setFormData({ ...formData, key: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="값 (예: hello@example.com)"
                                    className="flex-1 border rounded px-2 py-1"
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                                />
                                <button
                                    onClick={handleAdd}
                                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm font-bold"
                                >
                                    + 추가
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'policy' && (
                    <div>
                        <h2 className="text-lg font-bold mb-4 pb-2 border-b">약관/정책 관리</h2>
                        <div className="space-y-4">
                            {filteredSettings.map(setting => (
                                <div key={setting.id} className="border rounded p-4">
                                    {editingId === setting.id ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                className="w-full border rounded px-2 py-1 font-bold"
                                                value={setting.key}
                                                onChange={e => setSettings(settings.map(s =>
                                                    s.id === setting.id ? { ...s, key: e.target.value } : s
                                                ))}
                                            />
                                            <textarea
                                                className="w-full border rounded px-2 py-1 h-32"
                                                value={setting.value}
                                                onChange={e => setSettings(settings.map(s =>
                                                    s.id === setting.id ? { ...s, value: e.target.value } : s
                                                ))}
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSave(setting)}
                                                    className="px-4 py-2 bg-black text-white rounded"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="px-4 py-2 border rounded"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold">{setting.key}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingId(setting.id)}
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(setting.id)}
                                                        className="text-sm text-red-600 hover:underline"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">{setting.value}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="border-2 border-dashed rounded p-4 bg-gray-50">
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="정책명 (예: 교환/환불 규정)"
                                        className="w-full border rounded px-2 py-1"
                                        value={formData.key}
                                        onChange={e => setFormData({ ...formData, key: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="정책 내용"
                                        className="w-full border rounded px-2 py-1 h-24"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                                    />
                                    <button
                                        onClick={handleAdd}
                                        className="px-4 py-2 bg-blue-600 text-white rounded font-bold"
                                    >
                                        + 정책 추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
