import express from 'express';
import dotenv from 'dotenv';
import { TestGenerator } from '../../test-generator/src/index';
import { getStorageAdapter } from '../../storage-adapters/src/index';
import logger from './utils/logger';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const app = express();
const port = process.env.PORT || 3000;


const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('OPENAI_API_KEY is not set in the .env file');
  process.exit(1);
}

const testGenerator = new TestGenerator(API_KEY);
const storageAdapter = getStorageAdapter(process.env.STORAGE_TYPE || 'local');

app.use(express.json());

app.post('/api/generate-and-run-tests', async (req, res) => {
  try {
    const { sourceCode, fileName, projectId, importPath } = req.body;
    logger.info(`Generating tests for ${fileName} in project ${projectId}`);
    
    const tests = await testGenerator.generateTests(sourceCode, fileName, importPath);
    logger.info('Tests generated successfully');
    
    await storageAdapter.saveTests(projectId, fileName, tests);
    logger.info('Tests saved to storage');

    const tempDir = path.join(__dirname, 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    const sourceFilePath = path.join(tempDir, fileName);
    const testFilePath = path.join(tempDir, `${path.parse(fileName).name}.test.js`);
    
    await fs.writeFile(sourceFilePath, sourceCode);
    await fs.writeFile(testFilePath, tests);
    logger.info('Temporary files written');

    exec(`npx jest ${testFilePath} --no-cache`, (error, stdout, stderr) => {
      if (error && error.code !== 1) {
        logger.error(`Error running tests: ${error.message}`);
        return res.status(500).json({ error: 'Failed to run tests', output: stderr });
      }
      
      logger.info(`Tests executed for ${fileName}`);
      res.json({ tests, testResults: stdout });

      fs.unlink(sourceFilePath).catch(err => logger.error(`Error deleting temp file: ${err}`));
      fs.unlink(testFilePath).catch(err => logger.error(`Error deleting temp file: ${err}`));
    });
} catch (error) {
    logger.error('Failed to generate or run tests', { error });
    res.status(500).json({ error: 'Failed to generate or run tests' });
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});