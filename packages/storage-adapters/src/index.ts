import fs from 'fs';
import path from 'path';

export interface StorageAdapter {
  saveTests(projectId: string, fileName: string, tests: string): Promise<void>;
  getTests(projectId: string, fileName: string): Promise<string>;
}

class LocalStorageAdapter implements StorageAdapter {
  private storageDir: string;

  constructor() {
    this.storageDir = path.join(process.cwd(), 'test-storage');
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async saveTests(projectId: string, fileName: string, tests: string): Promise<void> {
    const projectDir = path.join(this.storageDir, projectId);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    const filePath = path.join(projectDir, `${fileName}.test.ts`);
    await fs.promises.writeFile(filePath, tests, 'utf-8');
  }

  async getTests(projectId: string, fileName: string): Promise<string> {
    const filePath = path.join(this.storageDir, projectId, `${fileName}.test.ts`);
    return fs.promises.readFile(filePath, 'utf-8');
  }
}

export function getStorageAdapter(type: string): StorageAdapter {
  switch (type) {
    case 'local':
    default:
      return new LocalStorageAdapter();
  }
}