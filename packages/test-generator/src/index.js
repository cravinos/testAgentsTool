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
exports.TestGenerator = void 0;
const openai_1 = __importDefault(require("openai"));
const logger_1 = __importDefault(require("../../server/src/utils/logger"));
class TestGenerator {
    constructor(apiKey) {
        this.openai = new openai_1.default({ apiKey });
    }
    generateTests(sourceCode, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
Generate Jest unit tests for the following ${fileName} file:

${sourceCode}

Please follow these guidelines:
1. Use Jest as the testing framework.
2. Cover all exported functions and classes.
3. Include tests for both normal and edge cases.
4. Use descriptive test names that explain what is being tested.
5. Use mock functions where appropriate for external dependencies.
6. Output only valid JavaScript code, without any markdown formatting or code block syntax.
7. Use the correct import statement: const { functionName } = require('../${fileName}');
8. Ensure that the tests can run independently of any other files.

Generate the tests:
`;
            try {
                logger_1.default.info(`Generating tests for ${fileName}`);
                const response = yield this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful assistant that generates Jest unit tests. Output only valid JavaScript code without any markdown formatting." },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7,
                });
                const generatedTests = response.choices[0].message.content || 'No tests generated.';
                logger_1.default.info(`Tests generated successfully for ${fileName}`);
                return generatedTests.replace(/```javascript|```/g, '').trim();
            }
            catch (error) {
                logger_1.default.error(`Error generating tests for ${fileName}`, { error });
                throw new Error('Failed to generate tests');
            }
        });
    }
}
exports.TestGenerator = TestGenerator;
