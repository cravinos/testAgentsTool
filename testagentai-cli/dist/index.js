#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const execPromise = util_1.default.promisify(child_process_1.exec);
const SERVER_URL = 'http://localhost:3000'; // Consider making this configurable
async function main() {
    commander_1.program
        .version('1.0.0')
        .description('TestAgentAI CLI - Generate and run tests for your code')
        .argument('<file>', 'Source file to generate tests for')
        .option('-o, --output <directory>', 'Output directory for test files', '__tests__')
        .action(async (file, options) => {
        try {
            const projectRoot = process.cwd();
            const fullPath = path_1.default.resolve(projectRoot, file);
            console.log('Attempting to read file:', fullPath);
            const sourceCode = await promises_1.default.readFile(fullPath, 'utf-8');
            const fileName = path_1.default.basename(file);
            const relativeFilePath = path_1.default.relative(projectRoot, fullPath);
            const projectId = path_1.default.basename(projectRoot);
            console.log('Sending request to server...');
            const response = await axios_1.default.post(`${SERVER_URL}/api/generate-and-run-tests`, {
                sourceCode,
                fileName,
                projectId,
                relativeFilePath
            });
            console.log('Received response from server');
            const { tests, testResults, coverageReport } = response.data;
            const testDir = path_1.default.join(projectRoot, options.output);
            await promises_1.default.mkdir(testDir, { recursive: true });
            const testFileName = `${path_1.default.parse(fileName).name}.test.js`;
            const testFilePath = path_1.default.join(testDir, testFileName);
            // Update the import statement in the generated tests
            const updatedTests = tests.replace("const myutil = require('../myutil');", `const ${path_1.default.parse(fileName).name} = require('${path_1.default.relative(testDir, fullPath).replace(/\\/g, '/')}');`);
            await promises_1.default.writeFile(testFilePath, updatedTests);
            console.log(chalk_1.default.green(`Tests generated and saved to ${testFilePath}`));
            // Execute the generated tests
            try {
                const { stdout, stderr } = await execPromise(`npx jest ${testFilePath}`);
                console.log(chalk_1.default.blue('Test Results:'));
                console.log(stdout);
                if (stderr) {
                    console.error(chalk_1.default.yellow('Test Warnings/Errors:'));
                    console.error(stderr);
                }
            }
            catch (error) {
                const testError = error;
                console.error(chalk_1.default.red('Error executing tests:'));
                if (testError.stdout)
                    console.error(testError.stdout);
                if (testError.stderr)
                    console.error(testError.stderr);
            }
            if (coverageReport) {
                console.log(chalk_1.default.yellow('Coverage Report:'));
                console.log(`Total Lines: ${coverageReport.totalLines}`);
                console.log(`Covered Lines: ${coverageReport.coveredLines}`);
                console.log(`Coverage: ${chalk_1.default.green(coverageReport.coverage)}`);
            }
            console.log(chalk_1.default.cyan(`
 _____         _      _                    _       _____           _ 
|_   _|__  ___| |_   / \\   __ _  ___ _ __ | |_ ___|_   _|__   ___ | |
  | |/ _ \\/ __| __| / _ \\ / _\` |/ _ \\ '_ \\| __/ __| | |/ _ \\ / _ \\| |
  | |  __/\\__ \\ |_ / ___ \\ (_| |  __/ | | | |_\\__ \\ | | (_) | (_) | |
  |_|\\___||___/\\__/_/   \\_\\__, |\\___|_| |_|\\__|___/ |_|\\___/ \___/|_|
                           |___/                                      
`));
            console.log(chalk_1.default.green('Tests generated and run successfully!'));
        }
        catch (error) {
            console.error(chalk_1.default.red('Error:'));
            if (error instanceof Error) {
                console.error(chalk_1.default.red('Message:'), error.message);
                console.error(chalk_1.default.red('Stack:'), error.stack);
            }
            else {
                console.error(chalk_1.default.red('Unknown error:'), error);
            }
            process.exit(1);
        }
    });
    await commander_1.program.parseAsync(process.argv);
}
main().catch((error) => {
    console.error(chalk_1.default.red('Unhandled error:'));
    if (error instanceof Error) {
        console.error(chalk_1.default.red('Message:'), error.message);
        console.error(chalk_1.default.red('Stack:'), error.stack);
    }
    else {
        console.error(chalk_1.default.red('Unknown error:'), error);
    }
    process.exit(1);
});
