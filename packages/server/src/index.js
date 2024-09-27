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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("../../test-generator/src/index");
const index_2 = require("../../storage-adapters/src/index");
const logger_1 = __importDefault(require("./utils/logger"));
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
    console.error('OPENAI_API_KEY is not set in the environment');
    process.exit(1);
}
const testGenerator = new index_1.TestGenerator(API_KEY);
const storageAdapter = (0, index_2.getStorageAdapter)(process.env.STORAGE_TYPE || 'local');
app.use(express_1.default.json());
app.post('/api/generate-and-run-tests', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Received request to generate and run tests');
        const { sourceCode, fileName, projectId } = req.body;
        logger_1.default.info(`Generating tests for ${fileName} in project ${projectId}`);
        const tests = yield testGenerator.generateTests(sourceCode, fileName);
        logger_1.default.info('Tests generated successfully');
        yield storageAdapter.saveTests(projectId, fileName, tests);
        logger_1.default.info('Tests saved to storage');
        const tempDir = path_1.default.join(__dirname, 'temp');
        yield promises_1.default.mkdir(tempDir, { recursive: true });
        const sourceFilePath = path_1.default.join(tempDir, fileName);
        const testFilePath = path_1.default.join(tempDir, `${path_1.default.parse(fileName).name}.test.js`);
        yield promises_1.default.writeFile(sourceFilePath, sourceCode);
        yield promises_1.default.writeFile(testFilePath, tests);
        logger_1.default.info('Temporary files written');
        (0, child_process_1.exec)(`npx jest ${testFilePath} --no-cache`, (error, stdout, stderr) => {
            if (error && error.code !== 1) {
                logger_1.default.error(`Error running tests: ${error.message}`);
                return res.status(500).json({ error: 'Failed to run tests', output: stderr });
            }
            logger_1.default.info(`Tests executed for ${fileName}`);
            res.json({ tests, testResults: stdout });
            promises_1.default.unlink(sourceFilePath).catch(err => logger_1.default.error(`Error deleting temp file: ${err}`));
            promises_1.default.unlink(testFilePath).catch(err => logger_1.default.error(`Error deleting temp file: ${err}`));
        });
    }
    catch (error) {
        logger_1.default.error('Failed to generate or run tests', { error });
        res.status(500).json({ error: 'Failed to generate or run tests' });
    }
}));
app.listen(port, () => {
    logger_1.default.info(`Server running on port ${port}`);
});
