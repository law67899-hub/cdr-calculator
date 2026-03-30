/**
 * Home Page - CDR Calculator
 * 
 * Main page with patient info form, CDR assessment form, results, and records management
 * Design: Medical Professional Style
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import CDRForm from '@/components/CDRForm';
import CDRResultComponent from '@/components/CDRResult';
import PatientInfoForm from '@/components/PatientInfoForm';
import RecordsManager from '@/components/RecordsManager';
import { CDRScores, calculateCDR, CDRResult } from '@/lib/cdrCalculator';
import { PatientInfo, saveRecord, generateId, AssessmentRecord } from '@/lib/storage';
import { toast } from 'sonner';

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'assessment' | 'records'>('assessment');
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [result, setResult] = useState<CDRResult | null>(null);
  const [scores, setScores] = useState<CDRScores | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleScoresChange = (newScores: CDRScores) => {
    setScores(newScores);
    const calculatedResult = calculateCDR(newScores);
    setResult(calculatedResult);
  };

  const handleSaveRecord = () => {
    if (!patientInfo) {
      toast.error('請填寫患者基本信息');
      return;
    }

    if (!scores || !result) {
      toast.error('請完成所有評估項目');
      return;
    }

    setIsSaving(true);

    try {
      const record: AssessmentRecord = {
        id: generateId(),
        patient: {
          ...patientInfo,
          id: generateId(),
        },
        scores,
        cdrScore: result.cdrScore,
        severity: result.severity,
        createdAt: new Date().toISOString(),
      };

      saveRecord(record);
      toast.success(`評估記錄已保存 - ${patientInfo.name}`);

      // Reset form
      setPatientInfo(null);
      setScores(null);
      setResult(null);
    } catch (error) {
      toast.error('保存失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              CDR 臨床失智評分計算工具
            </h1>
            <p className="text-gray-600 text-lg">
              根據六個認知和功能領域評估失智症嚴重程度
            </p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container">
          <div className="max-w-6xl mx-auto flex gap-8">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'assessment'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              新建評估
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'records'
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              評估記錄
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'assessment' ? (
            // Assessment Tab
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Info Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <PatientInfoForm onInfoChange={setPatientInfo} />
                </div>

                {/* Assessment Form Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <CDRForm onScoresChange={handleScoresChange} />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveRecord}
                  disabled={!patientInfo || !scores || !result || isSaving}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    !patientInfo || !scores || !result || isSaving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'medical-button-primary w-full'
                  }`}
                >
                  {isSaving ? '正在保存...' : '保存評估記錄'}
                </button>
              </div>

              {/* Right Column - Results */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    評估結果
                  </h2>
                  <CDRResultComponent result={result} />
                </div>
              </div>
            </div>
          ) : (
            // Records Tab
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                評估記錄管理
              </h2>
              <RecordsManager />
            </div>
          )}

          {/* Information Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* About CDR */}
            <div className="medical-card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                關於 CDR
              </h3>
              <p className="text-gray-700 mb-3">
                臨床失智評分量表（Clinical Dementia Rating, CDR）是一個國際標準化的評估工具，用於評估失智症的嚴重程度。
              </p>
              <p className="text-gray-700">
                CDR 評估六個認知和功能領域，其中記憶力是主要評估類別，其他五個領域作為支持性評估。
              </p>
            </div>

            {/* Scoring Guide */}
            <div className="medical-card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                評分指南
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 font-semibold text-blue-700">0</span>
                  <span>正常，無認知障礙</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-semibold text-blue-700">0.5</span>
                  <span>輕微問題，可疑認知障礙</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-semibold text-blue-700">1</span>
                  <span>輕度失智</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-semibold text-blue-700">2</span>
                  <span>中度失智</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-semibold text-blue-700">3</span>
                  <span>重度失智</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h4 className="font-bold text-yellow-900 mb-2">
              重要免責聲明
            </h4>
            <p className="text-yellow-800 text-sm">
              此計算器僅供參考，不能替代專業醫學診斷。所有結果應由合格的醫療專業人士進行解釋和確認。如有任何健康疑慮，請諮詢您的醫生。
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm">
              CDR 臨床失智評分計算工具 © 2026
            </p>
            <p className="text-xs text-gray-500 mt-2">
              此工具基於官方 CDR 計算規則實現
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
