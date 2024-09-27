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
exports.getStorageAdapter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LocalStorageAdapter {
    constructor() {
        this.storageDir = path_1.default.join(process.cwd(), 'test-storage');
        if (!fs_1.default.existsSync(this.storageDir)) {
            fs_1.default.mkdirSync(this.storageDir, { recursive: true });
        }
    }
    saveTests(projectId, fileName, tests) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectDir = path_1.default.join(this.storageDir, projectId);
            if (!fs_1.default.existsSync(projectDir)) {
                fs_1.default.mkdirSync(projectDir, { recursive: true });
            }
            const filePath = path_1.default.join(projectDir, `${fileName}.test.ts`);
            yield fs_1.default.promises.writeFile(filePath, tests, 'utf-8');
        });
    }
    getTests(projectId, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(this.storageDir, projectId, `${fileName}.test.ts`);
            return fs_1.default.promises.readFile(filePath, 'utf-8');
        });
    }
}
function getStorageAdapter(type) {
    switch (type) {
        case 'local':
        default:
            return new LocalStorageAdapter();
    }
}
exports.getStorageAdapter = getStorageAdapter;
