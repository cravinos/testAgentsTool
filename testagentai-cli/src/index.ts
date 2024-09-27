#!/usr/bin/env node

import { program } from 'commander';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const SERVER_URL = 'http://localhost:3000'; // Consider making this configurable

interface ExecError extends Error {
  stdout: string;
  stderr: string;
}

async function main() {
  program
    .version('1.0.0')
    .description('TestAgentAI CLI - Generate and run tests for your code')
    .argument('<file>', 'Source file to generate tests for')
    .option('-o, --output <directory>', 'Output directory for test files', '__tests__')
    .action(async (file, options) => {
      try {
        const projectRoot = process.cwd();
        const fullPath = path.resolve(projectRoot, file);
        console.log('Attempting to read file:', fullPath);

        const sourceCode = await fs.readFile(fullPath, 'utf-8');
        const fileName = path.basename(file);
        const relativeFilePath = path.relative(projectRoot, fullPath);
        const projectId = path.basename(projectRoot);

        console.log('Sending request to server...');
        const response = await axios.post(`${SERVER_URL}/api/generate-and-run-tests`, {
          sourceCode,
          fileName,
          projectId,
          relativeFilePath
        });

        console.log('Received response from server');
        const { tests, testResults, coverageReport } = response.data;

        const testDir = path.join(projectRoot, options.output);
        await fs.mkdir(testDir, { recursive: true });

        const testFileName = `${path.parse(fileName).name}.test.js`;
        const testFilePath = path.join(testDir, testFileName);
        
        // Update the import statement in the generated tests
        const updatedTests = tests.replace(
          "const myutil = require('../myutil');",
          `const ${path.parse(fileName).name} = require('${path.relative(testDir, fullPath).replace(/\\/g, '/')}');`
        );
        
        await fs.writeFile(testFilePath, updatedTests);

        console.log(chalk.green(`Tests generated and saved to ${testFilePath}`));
        
        // Execute the generated tests
        try {
          const { stdout, stderr } = await execPromise(`npx jest ${testFilePath}`);
          console.log(chalk.blue('Test Results:'));
          console.log(stdout);
          if (stderr) {
            console.error(chalk.yellow('Test Warnings/Errors:'));
            console.error(stderr);
          }
        } catch (error) {
          const testError = error as ExecError;
          console.error(chalk.red('Error executing tests:'));
          if (testError.stdout) console.error(testError.stdout);
          if (testError.stderr) console.error(testError.stderr);
        }

        if (coverageReport) {
          console.log(chalk.yellow('Coverage Report:'));
          console.log(`Total Lines: ${coverageReport.totalLines}`);
          console.log(`Covered Lines: ${coverageReport.coveredLines}`);
          console.log(`Coverage: ${chalk.green(coverageReport.coverage)}`);
        }

        console.log(chalk.cyan(`
 _____         _      _                    _       _____           _ 
|_   _|__  ___| |_   / \\   __ _  ___ _ __ | |_ ___|_   _|__   ___ | |
  | |/ _ \\/ __| __| / _ \\ / _\` |/ _ \\ '_ \\| __/ __| | |/ _ \\ / _ \\| |
  | |  __/\\__ \\ |_ / ___ \\ (_| |  __/ | | | |_\\__ \\ | | (_) | (_) | |
  |_|\\___||___/\\__/_/   \\_\\__, |\\___|_| |_|\\__|___/ |_|\\___/ \___/|_|
                           |___/                                      
`));
        console.log(chalk.green('Tests generated and run successfully!'));

      } catch (error) {
        console.error(chalk.red('Error:'));
        if (error instanceof Error) {
          console.error(chalk.red('Message:'), error.message);
          console.error(chalk.red('Stack:'), error.stack);
        } else {
          console.error(chalk.red('Unknown error:'), error);
        }
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(chalk.red('Unhandled error:'));
  if (error instanceof Error) {
    console.error(chalk.red('Message:'), error.message);
    console.error(chalk.red('Stack:'), error.stack);
  } else {
    console.error(chalk.red('Unknown error:'), error);
  }
  process.exit(1);
});