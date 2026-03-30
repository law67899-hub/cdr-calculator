/**
 * RecordsManager Component
 * 
 * Manages viewing, editing, and deleting assessment records
 * Provides export functionality
 */

import { useState, useEffect } from 'react';
import { AssessmentRecord, getAllRecords, deleteRecord } from '@/lib/storage';
import { downloadAsHTML, downloadAsCSV } from '@/lib/reportGenerator';
import { Trash2, Download, FileText } from 'lucide-react';

interface RecordsManagerProps {
  onRecordSelect?: (record: AssessmentRecord) => void;
}

export default function RecordsManager({ onRecordSelect }: RecordsManagerProps) {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const allRecords = getAllRecords();
    setRecords(allRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除此評估記錄嗎？')) {
      try {
        deleteRecord(id);
        loadRecords();
        if (selectedRecord?.id === id) {
          setSelectedRecord(null);
        }
      } catch (error) {
        alert('刪除失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
      }
    }
  };

  const handleDownloadReport = (record: AssessmentRecord) => {
    try {
      downloadAsHTML(record);
    } catch (error) {
      alert('下載失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  const handleExportAllCSV = () => {
    if (records.length === 0) {
      alert('沒有可導出的記錄');
      return;
    }
    try {
      downloadAsCSV(records);
    } catch (error) {
      alert('導出失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case '無認知障礙':
        return 'bg-green-100 text-green-800';
      case '可疑認知障礙':
        return 'bg-yellow-100 text-yellow-800';
      case '輕度失智':
        return 'bg-orange-100 text-orange-800';
      case '中度失智':
        return 'bg-red-100 text-red-800';
      case '重度失智':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (records.length === 0) {
    return (
      <div className="medical-card p-8 text-center">
        <p className="text-gray-500 text-lg mb-2">
          尚無評估記錄
        </p>
        <p className="text-gray-400 text-sm">
          完成評估並保存後，記錄將顯示在此
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          評估記錄 ({records.length})
        </h3>
        <button
          onClick={handleExportAllCSV}
          className="medical-button-secondary text-sm flex items-center gap-2"
        >
          <Download size={16} />
          導出全部 CSV
        </button>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {records.map((record) => (
          <div
            key={record.id}
            className={`medical-card p-4 cursor-pointer transition-all ${
              selectedRecord?.id === record.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedRecord(record);
              onRecordSelect?.(record);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {record.patient.name}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(record.severity)}`}>
                    {record.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">年齡：</span>
                    {record.patient.age} 歲
                  </div>
                  <div>
                    <span className="font-medium">評估日期：</span>
                    {record.patient.assessmentDate}
                  </div>
                  <div>
                    <span className="font-medium">CDR 評分：</span>
                    <span className="font-bold text-blue-700">{record.cdrScore}</span>
                  </div>
                  <div>
                    <span className="font-medium">記錄時間：</span>
                    {new Date(record.createdAt).toLocaleString('zh-TW')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadReport(record);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="下載報告"
                >
                  <FileText size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="刪除記錄"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Record Details */}
      {selectedRecord && (
        <div className="medical-card p-6 mt-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4">
            詳細評分 - {selectedRecord.patient.name}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-gray-700">記憶力</span>
              <span className="font-bold text-blue-700">{selectedRecord.scores.memory}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-gray-700">定向力</span>
              <span className="font-bold text-blue-700">{selectedRecord.scores.orientation}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-gray-700">判斷力</span>
              <span className="font-bold text-blue-700">{selectedRecord.scores.judgment}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-gray-700">社區事務</span>
              <span className="font-bold text-blue-700">{selectedRecord.scores.community}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-gray-700">家庭和愛好</span>
              <span className="font-bold text-blue-700">{selectedRecord.scores.home}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-gray-700">個人照護</span>
              <span className="font-bold text-blue-700">{selectedRecord.scores.personal}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
