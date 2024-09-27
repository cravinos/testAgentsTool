#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const SERVER_URL = 'http://localhost:3000'; // Update this with your server URL
commander_1.program
    .version('1.0.0')
    .description('TestAgentAI CLI - Generate and run tests for your code')
    .argument('<file>', 'Source file to generate tests for')
    .option('-o, --output <directory>', 'Output directory for test files', '__tests__')
    .action((file, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sourceCode = yield promises_1.default.readFile(file, 'utf-8');
        const fileName = path_1.default.basename(file);
        const projectId = 'cli-project'; // You might want to make this configurable
        const response = yield axios_1.default.post(`${SERVER_URL}/api/generate-and-run-tests`, {
            sourceCode,
            fileName,
            projectId
        });
        const { tests, testResults, coverageReport } = response.data;
        // Create __tests__ directory if it doesn't exist
        const testDir = path_1.default.join(process.cwd(), options.output);
        yield promises_1.default.mkdir(testDir, { recursive: true });
        // Write test file
        const testFileName = `${path_1.default.parse(fileName).name}.test.js`;
        const testFilePath = path_1.default.join(testDir, testFileName);
        yield promises_1.default.writeFile(testFilePath, tests);
        console.log(chalk_1.default.green(`Tests generated and saved to ${testFilePath}`));
        console.log(chalk_1.default.blue('Test Results:'));
        console.log(testResults);
        if (coverageReport) {
            console.log(chalk_1.default.yellow('Coverage Report:'));
            console.log(`Total Lines: ${coverageReport.totalLines}`);
            console.log(`Covered Lines: ${coverageReport.coveredLines}`);
            console.log(`Coverage: ${chalk_1.default.green(coverageReport.coverage)}`);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}));
commander_1.program.parse(process.argv);
