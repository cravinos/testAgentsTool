#!/usr/bin/env node
import { program } from 'commander';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const SERVER_URL = 'http://localhost:3000'; // Update this with your server URL

program
  .version('1.0.0')
  .description('TestAgentAI CLI - Generate and run tests for your code')
  .argument('<file>', 'Source file to generate tests for')
  .option('-o, --output <directory>', 'Output directory for test files', '__tests__')
  .action(async (file, options) => {
    try {
      const sourceCode = await fs.readFile(file, 'utf-8');
      const fileName = path.basename(file);
      const projectId = 'cli-project'; // You might want to make this configurable

      const response = await axios.post(`${SERVER_URL}/api/generate-and-run-tests`, {
        sourceCode,
        fileName,
        projectId
      });

      const { tests, testResults, coverageReport } = response.data;

      // Create __tests__ directory if it doesn't exist
      const testDir = path.join(process.cwd(), options.output);
      await fs.mkdir(testDir, { recursive: true });

      // Write test file
      const testFileName = `${path.parse(fileName).name}.test.js`;
      const testFilePath = path.join(testDir, testFileName);
      await fs.writeFile(testFilePath, tests);

      console.log(chalk.green(`Tests generated and saved to ${testFilePath}`));
      console.log(chalk.blue('Test Results:'));
      console.log(testResults);

      if (coverageReport) {
        console.log(chalk.yellow('Coverage Report:'));
        console.log(`Total Lines: ${coverageReport.totalLines}`);
        console.log(`Covered Lines: ${coverageReport.coveredLines}`);
        console.log(`Coverage: ${chalk.green(coverageReport.coverage)}`);
      }
    } catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse(process.argv);