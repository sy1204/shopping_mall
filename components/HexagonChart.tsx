'use client';

import React, { useState, useCallback } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

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
}

const PARAM_LABELS: Record<keyof HexagonParams, string> = {
    boldness: '도전성',
    materialValue: '소재',
    utility: '실용',
    reliability: '신뢰',
    comfort: '편안',
    exclusivity: '희소'
};

// Low → High 설명
const PARAM_DESCRIPTIONS: Record<keyof HexagonParams, { low: string; high: string }> = {
    boldness: {
        low: '무난한 기본템',
        high: '파격적이고 트렌디한 디자인'
    },
    materialValue: {
        low: '일반적인 혼용률',
        high: '희소 소재 및 특수 공법'
    },
    utility: {
        low: '특정 상황용(경조사 등)',
        high: '범용성 높은 데일리템'
    },
    reliability: {
        low: '신규/실험적 상품',
        high: '검증된 베스트셀러'
    },
    comfort: {
        low: '포멀하고 딱딱한 핏',
        high: '활동성 높고 여유로운 핏'
    },
    exclusivity: {
        low: '대중적인 기성품',
        high: '장인정신 및 리미티드'
    }
};

export default function HexagonChart({ values, onChange, disabled = false }: HexagonChartProps) {
    const [activeParam, setActiveParam] = useState<keyof HexagonParams | null>(null);

    // Chart data 변환
    const chartData = Object.entries(values).map(([key, value]) => ({
        param: PARAM_LABELS[key as keyof HexagonParams],
        value: value * 100,
        fullMark: 100,
        key: key as keyof HexagonParams
    }));

    // 슬라이더 변경 핸들러
    const handleSliderChange = useCallback((param: keyof HexagonParams, newValue: number) => {
        if (disabled) return;
        onChange({
            ...values,
            [param]: newValue
        });
    }, [values, onChange, disabled]);

    return (
        <div className="hexagon-chart-container">
            {/* 레이더 차트 */}
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={280}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid
                            gridType="polygon"
                            stroke="rgba(255,255,255,0.2)"
                        />
                        <PolarAngleAxis
                            dataKey="param"
                            tick={{ fill: '#fff', fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                            tickCount={5}
                        />
                        <Radar
                            name="취향"
                            dataKey="value"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.4}
                            strokeWidth={2}
                        />
                        <Tooltip
                            content={({ payload }) => {
                                if (!payload?.length) return null;
                                const data = payload[0].payload;
                                const desc = PARAM_DESCRIPTIONS[data.key as keyof HexagonParams];
                                return (
                                    <div className="chart-tooltip">
                                        <div className="tooltip-title">{data.param}</div>
                                        <div className="tooltip-value">{Math.round(data.value)}%</div>
                                        <div className="tooltip-desc">
                                            {data.value <= 50 ? desc.low : desc.high}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* 슬라이더 컨트롤 */}
            <div className="sliders-container">
                {(Object.keys(values) as Array<keyof HexagonParams>).map((param) => (
                    <div
                        key={param}
                        className={`slider-item ${activeParam === param ? 'active' : ''}`}
                        onMouseEnter={() => setActiveParam(param)}
                        onMouseLeave={() => setActiveParam(null)}
                    >
                        <div className="slider-header">
                            <span className="slider-label">{PARAM_LABELS[param]}</span>
                            <span className="slider-value">{Math.round(values[param] * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={values[param]}
                            onChange={(e) => handleSliderChange(param, parseFloat(e.target.value))}
                            disabled={disabled}
                            className="slider-input"
                        />
                        <p className="slider-description">
                            {PARAM_DESCRIPTIONS[param].low} → {PARAM_DESCRIPTIONS[param].high}
                        </p>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .hexagon-chart-container {
                    background: linear-gradient(135deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95));
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid rgba(139, 92, 246, 0.3);
                }

                .chart-wrapper {
                    margin-bottom: 24px;
                }

                .sliders-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                @media (max-width: 640px) {
                    .sliders-container {
                        grid-template-columns: 1fr;
                    }
                }

                .slider-item {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 12px;
                    transition: all 0.2s ease;
                }

                .slider-item:hover,
                .slider-item.active {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.5);
                }

                .slider-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .slider-label {
                    color: #fff;
                    font-weight: 600;
                    font-size: 14px;
                }

                .slider-value {
                    color: #8b5cf6;
                    font-weight: 700;
                    font-size: 14px;
                }

                .slider-input {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.2);
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
                    background: #8b5cf6;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.5);
                }

                .slider-input::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: none;
                }

                .slider-description {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 11px;
                    margin-top: 6px;
                    line-height: 1.4;
                }

                :global(.chart-tooltip) {
                    background: rgba(0, 0, 0, 0.9);
                    border: 1px solid rgba(139, 92, 246, 0.5);
                    border-radius: 8px;
                    padding: 10px 14px;
                }

                :global(.tooltip-title) {
                    color: #8b5cf6;
                    font-weight: 600;
                    font-size: 13px;
                }

                :global(.tooltip-value) {
                    color: #fff;
                    font-weight: 700;
                    font-size: 18px;
                    margin: 4px 0;
                }

                :global(.tooltip-desc) {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 11px;
                }
            `}</style>
        </div>
    );
}
