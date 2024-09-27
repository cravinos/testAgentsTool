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
exports.createCoverageReport = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
function createCoverageReport(tempDir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const coverageDir = path_1.default.join(tempDir, 'coverage');
            const lcovPath = path_1.default.join(coverageDir, 'lcov.info');
            const lcovContent = yield promises_1.default.readFile(lcovPath, 'utf-8');
            // Parse lcov.info content to extract coverage data
            const lines = lcovContent.split('\n');
            let totalLines = 0;
            let coveredLines = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('LF:')) {
                    totalLines += parseInt(lines[i].split(':')[1]);
                }
                else if (lines[i].startsWith('LH:')) {
                    coveredLines += parseInt(lines[i].split(':')[1]);
                }
            }
            const coverage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
            return {
                totalLines,
                coveredLines,
                coverage: coverage.toFixed(2) + '%'
            };
        }
        catch (error) {
            console.error('Error creating coverage report:', error);
            return null;
        }
    });
}
exports.createCoverageReport = createCoverageReport;
