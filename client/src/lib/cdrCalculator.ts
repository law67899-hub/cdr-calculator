/**
 * CDR Calculator - Clinical Dementia Rating Calculation Logic
 * 
 * This module implements the complex CDR scoring algorithm based on the decision tree:
 * - Memory (M) is the primary category
 * - Orientation (O), Judgment & Problem Solving (JPS), Community Affairs (CA),
 *   Home & Hobbies (HH), and Personal Care (PC) are secondary categories
 */

export type ScoreValue = 0 | 0.5 | 1 | 2 | 3;

export interface CDRScores {
  memory: ScoreValue;
  orientation: ScoreValue;
  judgment: ScoreValue;
  community: ScoreValue;
  home: ScoreValue;
  personal: ScoreValue;
}

export interface CDRResult {
  cdrScore: ScoreValue;
  severity: string;
  description: string;
}

/**
 * Calculate CDR score based on the decision tree algorithm
 */
export function calculateCDR(scores: CDRScores): CDRResult {
  const { memory, orientation, judgment, community, home, personal } = scores;
  
  // Get secondary categories (all except memory)
  const secondaryScores = [orientation, judgment, community, home, personal];
  
  let cdrScore: ScoreValue;
  
  // Decision tree based on memory score
  if (memory === 0) {
    // When M = 0: Check if impairment (≥0.5) in ≥2 secondary categories
    const impairedSecondary = secondaryScores.filter(s => s >= 0.5).length;
    
    if (impairedSecondary >= 2) {
      cdrScore = 0.5;
    } else {
      cdrScore = 0;
    }
  } else if (memory === 0.5) {
    // When M = 0.5: Check if ≥3 of other categories are scored ≥1
    const secondaryGte1 = secondaryScores.filter(s => s >= 1).length;
    
    if (secondaryGte1 >= 3) {
      cdrScore = 1;
    } else {
      cdrScore = 0.5;
    }
  } else {
    // When M > 0.5 (M = 1, 2, or 3)
    // Count secondary categories on each side of M
    const lessThanM = secondaryScores.filter(s => s < memory).length;
    const equalToM = secondaryScores.filter(s => s === memory).length;
    const greaterThanM = secondaryScores.filter(s => s > memory).length;
    
    // Check if ≥3 secondary categories have scores greater or less than M
    if (greaterThanM >= 3 || lessThanM >= 3) {
      // Find the majority score on the side with more categories
      if (greaterThanM > lessThanM) {
        // Get the majority score from categories > M
        const scoresGreaterThanM = secondaryScores.filter(s => s > memory);
        cdrScore = getMajorityScore(scoresGreaterThanM) as ScoreValue;
      } else if (lessThanM > greaterThanM) {
        // Get the majority score from categories < M
        const scoresLessThanM = secondaryScores.filter(s => s < memory);
        cdrScore = getMajorityScore(scoresLessThanM) as ScoreValue;
      } else {
        // Tie: use score closest to M
        const allScores = [...secondaryScores];
        cdrScore = getClosestToMemory(allScores, memory) as ScoreValue;
      }
    } else if (equalToM >= 3) {
      // ≥3 secondary categories have the same score as M
      cdrScore = memory;
    } else {
      // Less than 3 categories on either side or equal to M
      // Use the score closest to M
      const allScores = [...secondaryScores];
      cdrScore = getClosestToMemory(allScores, memory) as ScoreValue;
    }
  }
  
  return {
    cdrScore,
    severity: getSeverityLevel(cdrScore),
    description: getSeverityDescription(cdrScore)
  };
}

/**
 * Get the majority score from a list of scores
 */
function getMajorityScore(scores: ScoreValue[]): ScoreValue {
  if (scores.length === 0) return 0;
  
  // Count occurrences of each score
  const scoreCounts: Record<number, number> = {};
  scores.forEach(score => {
    scoreCounts[score] = (scoreCounts[score] || 0) + 1;
  });
  
  // Find the score with the highest count
  let maxCount = 0;
  let majorityScore: ScoreValue = 0;
  
  Object.entries(scoreCounts).forEach(([score, count]) => {
    if (count > maxCount) {
      maxCount = count;
      majorityScore = parseFloat(score) as ScoreValue;
    }
  });
  
  return majorityScore;
}

/**
 * Get the score closest to memory score
 */
function getClosestToMemory(scores: ScoreValue[], memory: ScoreValue): ScoreValue {
  if (scores.length === 0) return memory;
  
  let closest = scores[0];
  let minDistance = Math.abs(scores[0] - memory);
  
  scores.forEach(score => {
    const distance = Math.abs(score - memory);
    if (distance < minDistance) {
      minDistance = distance;
      closest = score;
    }
  });
  
  return closest;
}

/**
 * Get severity level name
 */
function getSeverityLevel(cdrScore: ScoreValue): string {
  switch (cdrScore) {
    case 0:
      return "無認知障礙";
    case 0.5:
      return "可疑認知障礙";
    case 1:
      return "輕度失智";
    case 2:
      return "中度失智";
    case 3:
      return "重度失智";
    default:
      return "未知";
  }
}

/**
 * Get detailed description for severity level
 */
function getSeverityDescription(cdrScore: ScoreValue): string {
  switch (cdrScore) {
    case 0:
      return "正常認知功能，無明顯障礙";
    case 0.5:
      return "輕微認知問題，但不符合輕度失智診斷";
    case 1:
      return "明顯認知障礙，但日常生活基本獨立";
    case 2:
      return "明顯認知障礙，日常生活需要協助";
    case 3:
      return "嚴重認知障礙，完全依賴他人照護";
    default:
      return "評估結果未知";
  }
}

/**
 * Validate if all scores are provided
 */
export function areAllScoresProvided(scores: CDRScores): boolean {
  return Object.values(scores).every(score => score !== null && score !== undefined);
}

/**
 * Get color for severity level (for UI display)
 */
export function getSeverityColor(cdrScore: ScoreValue): string {
  switch (cdrScore) {
    case 0:
      return "bg-green-100 text-green-800 border-green-300";
    case 0.5:
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case 1:
      return "bg-orange-100 text-orange-800 border-orange-300";
    case 2:
      return "bg-red-100 text-red-800 border-red-300";
    case 3:
      return "bg-red-200 text-red-900 border-red-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}
