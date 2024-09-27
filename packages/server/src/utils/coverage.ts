import fs from 'fs/promises';
import path from 'path';

export async function createCoverageReport(tempDir: string): Promise<any> {
  try {
    const coverageDir = path.join(tempDir, 'coverage');
    const lcovPath = path.join(coverageDir, 'lcov.info');
    const lcovContent = await fs.readFile(lcovPath, 'utf-8');
    
    // Parse lcov.info content to extract coverage data
    const lines = lcovContent.split('\n');
    let totalLines = 0;
    let coveredLines = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('LF:')) {
        totalLines += parseInt(lines[i].split(':')[1]);
      } else if (lines[i].startsWith('LH:')) {
        coveredLines += parseInt(lines[i].split(':')[1]);
      }
    }
    
    const coverage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
    
    return {
      totalLines,
      coveredLines,
      coverage: coverage.toFixed(2) + '%'
    };
  } catch (error) {
    console.error('Error creating coverage report:', error);
    return null;
  }
}