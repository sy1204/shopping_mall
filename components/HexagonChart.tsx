'use client';

import React, { useCallback } from 'react';

interface HexagonParams {
    boldness: number;        // 도전성
    materialValue: number;   // 소재 가치
    utility: number;         // 실용성
    reliability: number;     // 신뢰도
    comfort: number;         // 편안함
    exclusivity: number;     // 희소성
}

interface HexagonChartProps {
    values: HexagonParams;
    onChange: (values: HexagonParams) => void;
    disabled?: boolean;
    preferencesEnabled?: boolean;
}

const PARAM_LABELS: Record<keyof HexagonParams, string> = {
    boldness: '도전성',
    materialValue: '소재',
    utility: '실용성',
    reliability: '신뢰도',
    comfort: '편안함',
    exclusivity: '희소성'
};

// Low → High 설명
const PARAM_DESCRIPTIONS: Record<keyof HexagonParams, { low: string; high: string }> = {
    boldness: {
        low: '기본 아이템',
        high: '과감한 트렌드 디자인'
    },
    materialValue: {
        low: '일반 혼방',
        high: '희귀 섬유 & 테크 패브릭'
    },
    utility: {
        low: '격식있는 옷',
        high: '다용도 데일리 룩'
    },
    reliability: {
        low: '실험적 신상',
        high: '검증된 베스트셀러'
    },
    comfort: {
        low: '구조적 포멀',
        high: '활동성 높은 릴랙스'
    },
    exclusivity: {
        low: '대중적 인기',
        high: '장인정신 & 리미티드'
    }
};

export default function HexagonChart({ values, onChange, disabled = false, preferencesEnabled = true }: HexagonChartProps) {

    // 슬라이더 변경 핸들러
    const handleSliderChange = useCallback((param: keyof HexagonParams, newValue: number) => {
        if (disabled) return;
        onChange({
            ...values,
            [param]: newValue
        });
    }, [values, onChange, disabled]);

    return (
        <div className={`hexagon-chart-container ${!preferencesEnabled ? 'disabled' : ''}`}>
            {/* 제목 */}
            <div className="chart-header">
                <h2 className="chart-title">나의 취향 설정</h2>
                <p className="chart-subtitle">
                    슬라이더를 조절하여 AI 큐레이션 로직을 정교하게 설정하세요.
                </p>
            </div>

            {/* 슬라이더 카드 그리드 */}
            <div className="sliders-grid">
                {(Object.keys(values) as Array<keyof HexagonParams>).map((param) => (
                    <div key={param} className="slider-card">
                        <div className="slider-header">
                            <label className="slider-label">{PARAM_LABELS[param]}</label>
                            <span className="slider-value">{Math.round(values[param] * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={values[param] * 100}
                            onChange={(e) => handleSliderChange(param, parseInt(e.target.value) / 100)}
                            disabled={disabled}
                            className="slider-input"
                        />
                        <p className="slider-description">
                            {PARAM_DESCRIPTIONS[param].low} → {PARAM_DESCRIPTIONS[param].high}
                        </p>
                    </div>
                ))}
            </div>

            {/* 하단 통계 */}
            <div className="stats-bar">
                <div className="stat-item">
                    <p className="stat-label">에디토리얼 스코어</p>
                    <p className="stat-value">94</p>
                </div>
                <div className="stat-item">
                    <p className="stat-label">취향 매칭</p>
                    <p className="stat-value">Minimal</p>
                </div>
                <div className="stat-item">
                    <p className="stat-label">예상 선호도</p>
                    <div className="stat-trend">
                        <span className="trend-icon">↑</span>
                        <p className="trend-value">+12%</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hexagon-chart-container {
                    background: var(--background-light, #fff);
                    padding: 0;
                    transition: opacity 0.3s ease;
                }

                .hexagon-chart-container.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }

                .chart-header {
                    margin-bottom: 24px;
                }

                .chart-title {
                    font-family: var(--font-display, 'Nanum Myeongjo', serif);
                    font-size: 2rem;
                    font-weight: 700;
                    font-style: italic;
                    color: var(--neural-black, #121212);
                    margin-bottom: 8px;
                }

                .chart-subtitle {
                    font-family: var(--font-inter, 'Inter', sans-serif);
                    font-size: 1rem;
                    color: #6b7280;
                    font-weight: 300;
                }

                .sliders-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }

                @media (max-width: 640px) {
                    .sliders-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .slider-card {
                    background: #fff;
                    border: 1px solid #f0f0f0;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    transition: box-shadow 0.2s ease, border-color 0.2s ease;
                }

                .slider-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border-color: var(--primary, #2b52ee);
                }

                .slider-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .slider-label {
                    font-family: var(--font-display, 'Nanum Myeongjo', serif);
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: var(--neural-black, #121212);
                }

                .slider-value {
                    font-family: var(--font-inter, 'Inter', sans-serif);
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--primary, #2b52ee);
                }

                .slider-input {
                    width: 100%;
                    height: 4px;
                    border-radius: 2px;
                    background: #e5e7eb;
                    appearance: none;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }

                .slider-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .slider-input::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--primary, #2b52ee);
                    cursor: pointer;
                    box-shadow: 0 0 0 2px #fff;
                    transition: transform 0.2s ease;
                }

                .slider-input:hover::-webkit-slider-thumb {
                    transform: scale(1.2);
                }

                .slider-input::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--primary, #2b52ee);
                    cursor: pointer;
                    border: none;
                }

                .slider-description {
                    font-family: var(--font-inter, 'Inter', sans-serif);
                    color: #9ca3af;
                    font-size: 0.75rem;
                    margin-top: 10px;
                    line-height: 1.5;
                }

                .stats-bar {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    border-top: 1px solid #f0f0f0;
                    padding-top: 20px;
                }

                .stat-item {
                }

                .stat-label {
                    font-family: var(--font-inter, 'Inter', sans-serif);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #9ca3af;
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-family: var(--font-display, 'Nanum Myeongjo', serif);
                    font-size: 1.75rem;
                    font-weight: 300;
                    color: var(--neural-black, #121212);
                }

                .stat-trend {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #15803d;
                }

                .trend-icon {
                    font-size: 0.875rem;
                }

                .trend-value {
                    font-size: 1.25rem;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
}
