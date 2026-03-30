/**
 * CDRForm Component
 * 
 * Collects CDR scores from six categories:
 * - Memory (M)
 * - Orientation (O)
 * - Judgment & Problem Solving (JPS)
 * - Community Affairs (CA)
 * - Home & Hobbies (HH)
 * - Personal Care (PC)
 */

import { useState } from 'react';
import { CDRScores, ScoreValue } from '@/lib/cdrCalculator';

interface CDRFormProps {
  onScoresChange: (scores: CDRScores) => void;
}

const SCORE_OPTIONS: ScoreValue[] = [0, 0.5, 1, 2, 3];

const CATEGORIES = [
  {
    key: 'memory' as const,
    label: '記憶力 (Memory)',
    description: '評估短期和長期記憶能力',
  },
  {
    key: 'orientation' as const,
    label: '定向力 (Orientation)',
    description: '評估對時間、地點和人物的認識',
  },
  {
    key: 'judgment' as const,
    label: '判斷力和解決問題能力 (Judgment & Problem Solving)',
    description: '評估決策能力和問題解決能力',
  },
  {
    key: 'community' as const,
    label: '社區事務 (Community Affairs)',
    description: '評估在社區活動中的功能',
  },
  {
    key: 'home' as const,
    label: '家庭和愛好 (Home & Hobbies)',
    description: '評估在家庭活動和愛好中的功能',
  },
  {
    key: 'personal' as const,
    label: '個人照護 (Personal Care)',
    description: '評估自我照護能力',
  },
];

export default function CDRForm({ onScoresChange }: CDRFormProps) {
  const [scores, setScores] = useState<CDRScores>({
    memory: 0,
    orientation: 0,
    judgment: 0,
    community: 0,
    home: 0,
    personal: 0,
  });

  const handleScoreChange = (category: keyof CDRScores, value: ScoreValue) => {
    const newScores = { ...scores, [category]: value };
    setScores(newScores);
    onScoresChange(newScores);
  };

  const handleReset = () => {
    const resetScores: CDRScores = {
      memory: 0,
      orientation: 0,
      judgment: 0,
      community: 0,
      home: 0,
      personal: 0,
    };
    setScores(resetScores);
    onScoresChange(resetScores);
  };

  return (
    <div className="w-full space-y-6">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          評估問卷
        </h2>
        <p className="text-gray-600">
          請為以下六個類別分別評分。每個類別的評分範圍為 0、0.5、1、2 或 3。
        </p>
      </div>

      {/* Score Categories */}
      <div className="space-y-4">
        {CATEGORIES.map((category) => (
          <div
            key={category.key}
            className="medical-card p-6"
          >
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-900 mb-1">
                {category.label}
              </label>
              <p className="text-sm text-gray-600">
                {category.description}
              </p>
            </div>

            {/* Score Buttons */}
            <div className="flex flex-wrap gap-2">
              {SCORE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleScoreChange(category.key, option)}
                  className={`
                    px-4 py-2 rounded-md font-medium transition-all
                    ${
                      scores[category.key] === option
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Current Score Display */}
            <div className="mt-3 text-sm text-gray-600">
              當前評分: <span className="font-semibold text-gray-900">{scores[category.key]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleReset}
          className="medical-button-secondary flex-1"
        >
          重置
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          已填寫 <span className="font-semibold text-blue-700">6/6</span> 個類別
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-700 h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}
