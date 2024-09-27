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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        commander_1.program
            .version('1.0.0')
            .description('TestAgentAI CLI - Generate and run tests for your code')
            .argument('<file>', 'Source file to generate tests for')
            .option('-o, --output <directory>', 'Output directory for test files', '__tests__')
            .action((file, options) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Current working directory:', process.cwd());
                console.log('Attempting to read file:', path_1.default.resolve(process.cwd(), file));
                const fullPath = path_1.default.resolve(process.cwd(), file);
                const sourceCode = yield promises_1.default.readFile(fullPath, 'utf-8');
                const fileName = path_1.default.basename(file);
                const projectId = 'cli-project';
                console.log('Sending request to server...');
                const response = yield axios_1.default.post(`${SERVER_URL}/api/generate-and-run-tests`, {
                    sourceCode,
                    fileName,
                    projectId
                });
                console.log('Received response from server');
                const { tests, testResults, coverageReport } = response.data;
                const testDir = path_1.default.join(process.cwd(), options.output);
                yield promises_1.default.mkdir(testDir, { recursive: true });
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
        }));
        yield commander_1.program.parseAsync(process.argv);
    });
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
