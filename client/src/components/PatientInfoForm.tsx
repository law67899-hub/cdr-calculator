/**
 * PatientInfoForm Component
 * 
 * Collects patient basic information:
 * - Name
 * - Age
 * - Assessment Date
 */

import { useState } from 'react';
import { PatientInfo } from '@/lib/storage';

interface PatientInfoFormProps {
  onInfoChange: (info: PatientInfo | null) => void;
  initialInfo?: PatientInfo;
}

export default function PatientInfoForm({ onInfoChange, initialInfo }: PatientInfoFormProps) {
  const [name, setName] = useState(initialInfo?.name || '');
  const [age, setAge] = useState(initialInfo?.age.toString() || '');
  const [assessmentDate, setAssessmentDate] = useState(
    initialInfo?.assessmentDate || new Date().toISOString().split('T')[0]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    updateInfo(newName, age, assessmentDate);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAge = e.target.value;
    setAge(newAge);
    updateInfo(name, newAge, assessmentDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setAssessmentDate(newDate);
    updateInfo(name, age, newDate);
  };

  const updateInfo = (n: string, a: string, d: string) => {
    if (n.trim() && a.trim() && d.trim()) {
      const ageNum = parseInt(a, 10);
      if (ageNum > 0 && ageNum < 150) {
        onInfoChange({
          id: initialInfo?.id || '',
          name: n.trim(),
          age: ageNum,
          assessmentDate: d,
        });
      }
    } else {
      onInfoChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        患者基本信息
      </h3>

      {/* Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          患者姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="請輸入患者姓名"
          className="medical-input"
        />
      </div>

      {/* Age Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          年齡 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={age}
          onChange={handleAgeChange}
          placeholder="請輸入年齡"
          min="0"
          max="150"
          className="medical-input"
        />
      </div>

      {/* Assessment Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評估日期 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={assessmentDate}
          onChange={handleDateChange}
          className="medical-input"
        />
      </div>

      {/* Info Display */}
      {name && age && assessmentDate && (
        <div className="p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{name}</span>，
            <span className="font-semibold">{age}</span> 歲，
            評估日期：<span className="font-semibold">{assessmentDate}</span>
          </p>
        </div>
      )}
    </div>
  );
}
