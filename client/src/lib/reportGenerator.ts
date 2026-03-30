/**
 * Report Generator - Generate PDF reports for assessments
 * 
 * Uses jsPDF and html2canvas for PDF generation
 */

import { AssessmentRecord } from './storage';

/**
 * Generate a simple HTML report string
 */
export function generateHTMLReport(record: AssessmentRecord): string {
  const { patient, scores, cdrScore, severity } = record;

  const categoryLabels: Record<string, string> = {
    memory: '記憶力 (Memory)',
    orientation: '定向力 (Orientation)',
    judgment: '判斷力和解決問題能力 (Judgment & Problem Solving)',
    community: '社區事務 (Community Affairs)',
    home: '家庭和愛好 (Home & Hobbies)',
    personal: '個人照護 (Personal Care)',
  };

  const severityDescriptions: Record<string, string> = {
    '無認知障礙': '正常認知功能，無明顯障礙',
    '可疑認知障礙': '輕微認知問題，但不符合輕度失智診斷',
    '輕度失智': '明顯認知障礙，但日常生活基本獨立',
    '中度失智': '明顯認知障礙，日常生活需要協助',
    '重度失智': '嚴重認知障礙，完全依賴他人照護',
  };

  const scoresHTML = Object.entries(scores)
    .map(
      ([key, value]) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${categoryLabels[key]}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold;">${value}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CDR 評估報告</title>
      <style>
        body {
          font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
          color: #1f2937;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #1e40af;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1e40af;
          border-left: 4px solid #1e40af;
          padding-left: 12px;
          margin-bottom: 12px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
        }
        .info-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 16px;
          color: #1f2937;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background: #1e40af;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          padding: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .result-box {
          background: #f0f9ff;
          border: 2px solid #1e40af;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        .result-score {
          font-size: 48px;
          font-weight: bold;
          color: #1e40af;
          margin: 10px 0;
        }
        .result-severity {
          font-size: 20px;
          font-weight: bold;
          color: #1e40af;
          margin: 10px 0;
        }
        .result-description {
          font-size: 14px;
          color: #4b5563;
          margin-top: 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
        .disclaimer {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px;
          border-radius: 4px;
          font-size: 12px;
          color: #92400e;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>CDR 臨床失智評分評估報告</h1>
          <p>Clinical Dementia Rating Assessment Report</p>
        </div>

        <div class="section">
          <div class="section-title">患者信息</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">患者姓名</div>
              <div class="info-value">${patient.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">年齡</div>
              <div class="info-value">${patient.age} 歲</div>
            </div>
            <div class="info-item">
              <div class="info-label">評估日期</div>
              <div class="info-value">${patient.assessmentDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">報告生成日期</div>
              <div class="info-value">${new Date().toLocaleDateString('zh-TW')}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">評估結果</div>
          <div class="result-box">
            <div>臨床失智評分 (CDR)</div>
            <div class="result-score">${cdrScore}</div>
            <div class="result-severity">${severity}</div>
            <div class="result-description">${severityDescriptions[severity] || ''}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">詳細評分</div>
          <table>
            <thead>
              <tr>
                <th>評估類別</th>
                <th style="text-align: center;">評分</th>
              </tr>
            </thead>
            <tbody>
              ${scoresHTML}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">評分說明</div>
          <table>
            <thead>
              <tr>
                <th>評分</th>
                <th>嚴重程度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center; font-weight: bold;">0</td>
                <td>無認知障礙</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">0.5</td>
                <td>可疑認知障礙</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">1</td>
                <td>輕度失智</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">2</td>
                <td>中度失智</td>
              </tr>
              <tr>
                <td style="text-align: center; font-weight: bold;">3</td>
                <td>重度失智</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="disclaimer">
          <strong>重要免責聲明：</strong><br/>
          此報告僅供參考，不能替代專業醫學診斷。所有結果應由合格的醫療專業人士進行解釋和確認。如有任何健康疑慮，請諮詢您的醫生。
        </div>

        <div class="footer">
          <p>CDR 臨床失智評分計算工具 © 2026</p>
          <p>此報告由系統自動生成，請妥善保管。</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Download HTML as text file
 */
export function downloadAsHTML(record: AssessmentRecord): void {
  const html = generateHTMLReport(record);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `CDR_Report_${record.patient.name}_${record.patient.assessmentDate}.html`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate CSV export of assessment records
 */
export function generateCSVContent(records: AssessmentRecord[]): string {
  const headers = [
    '患者姓名',
    '年齡',
    '評估日期',
    '記憶力',
    '定向力',
    '判斷力',
    '社區事務',
    '家庭和愛好',
    '個人照護',
    'CDR 評分',
    '嚴重程度',
    '評估時間',
  ];

  const rows = records.map(record => [
    record.patient.name,
    record.patient.age,
    record.patient.assessmentDate,
    record.scores.memory,
    record.scores.orientation,
    record.scores.judgment,
    record.scores.community,
    record.scores.home,
    record.scores.personal,
    record.cdrScore,
    record.severity,
    new Date(record.createdAt).toLocaleString('zh-TW'),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
}

/**
 * Download CSV file
 */
export function downloadAsCSV(records: AssessmentRecord[]): void {
  const csv = generateCSVContent(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `CDR_Records_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
