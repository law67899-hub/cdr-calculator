/**
 * CDRResult Component
 * 
 * Displays the calculated CDR score with severity level and description
 */

import { CDRResult, ScoreValue, getSeverityColor } from '@/lib/cdrCalculator';

interface CDRResultProps {
  result: CDRResult | null;
}

export default function CDRResultComponent({ result }: CDRResultProps) {
  if (!result) {
    return (
      <div className="medical-card p-8 text-center">
        <p className="text-gray-500 text-lg">
          請填寫所有評估項目以查看結果
        </p>
      </div>
    );
  }

  const severityColor = getSeverityColor(result.cdrScore);

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <div className={`medical-card p-8 border-2 ${severityColor}`}>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">
            臨床失智評分 (CDR)
          </p>
          <div className="text-5xl font-bold mb-4">
            {result.cdrScore}
          </div>
          <p className="text-2xl font-semibold mb-4">
            {result.severity}
          </p>
          <p className="text-base leading-relaxed">
            {result.description}
          </p>
        </div>
      </div>

      {/* Severity Scale Reference */}
      <div className="medical-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          嚴重程度參考
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
            <span className="font-medium text-gray-800">CDR = 0</span>
            <span className="text-sm text-gray-600">無認知障礙</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
            <span className="font-medium text-gray-800">CDR = 0.5</span>
            <span className="text-sm text-gray-600">可疑認知障礙</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200">
            <span className="font-medium text-gray-800">CDR = 1</span>
            <span className="text-sm text-gray-600">輕度失智</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
            <span className="font-medium text-gray-800">CDR = 2</span>
            <span className="text-sm text-gray-600">中度失智</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-100 rounded border border-red-300">
            <span className="font-medium text-gray-800">CDR = 3</span>
            <span className="text-sm text-gray-600">重度失智</span>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="medical-card p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          關於此結果
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-3 text-blue-700 font-bold">•</span>
            <span>此計算器根據官方 CDR 計算規則實現，記憶力是主要評估類別</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-700 font-bold">•</span>
            <span>結果應由合格的醫療專業人士進行解釋和確認</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-blue-700 font-bold">•</span>
            <span>此工具僅供參考，不能替代專業醫學診斷</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
