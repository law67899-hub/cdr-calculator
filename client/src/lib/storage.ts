/**
 * Storage Utility - Local Storage Management
 * 
 * Handles saving and retrieving patient assessment records
 */

import { CDRScores, ScoreValue } from './cdrCalculator';

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  assessmentDate: string;
}

export interface AssessmentRecord {
  id: string;
  patient: PatientInfo;
  scores: CDRScores;
  cdrScore: ScoreValue;
  severity: string;
  createdAt: string;
  notes?: string;
}

const STORAGE_KEY = 'cdr_assessment_records';

/**
 * Get all assessment records from local storage
 */
export function getAllRecords(): AssessmentRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from storage:', error);
    return [];
  }
}

/**
 * Save a new assessment record
 */
export function saveRecord(record: AssessmentRecord): void {
  try {
    const records = getAllRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw new Error('無法保存評估記錄');
  }
}

/**
 * Update an existing assessment record
 */
export function updateRecord(id: string, updatedRecord: Partial<AssessmentRecord>): void {
  try {
    const records = getAllRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updatedRecord };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } else {
      throw new Error('找不到評估記錄');
    }
  } catch (error) {
    console.error('Error updating storage:', error);
    throw error;
  }
}

/**
 * Delete an assessment record
 */
export function deleteRecord(id: string): void {
  try {
    const records = getAllRecords();
    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting from storage:', error);
    throw new Error('無法刪除評估記錄');
  }
}

/**
 * Get a specific record by ID
 */
export function getRecord(id: string): AssessmentRecord | null {
  try {
    const records = getAllRecords();
    return records.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error retrieving record:', error);
    return null;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export records as JSON
 */
export function exportRecordsAsJSON(): string {
  try {
    const records = getAllRecords();
    return JSON.stringify(records, null, 2);
  } catch (error) {
    console.error('Error exporting records:', error);
    throw new Error('無法導出評估記錄');
  }
}

/**
 * Import records from JSON
 */
export function importRecordsFromJSON(jsonString: string): void {
  try {
    const records = JSON.parse(jsonString);
    if (!Array.isArray(records)) {
      throw new Error('無效的記錄格式');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error importing records:', error);
    throw new Error('無法導入評估記錄');
  }
}

/**
 * Clear all records
 */
export function clearAllRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('無法清除評估記錄');
  }
}
