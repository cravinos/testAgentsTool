# TestAgentAI

TestAgentAI is an open-source AI-powered test generation tool. It uses OpenAI's GPT models to generate unit tests for your code.
Install the package:
First, you need to install the TestAgentAI package from npm. Open your terminal and run:

```shellscript
npm install testagentai
```


Set up your OpenAI API key:
Create a `.env` file in your project root and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_api_key_here
```

Make sure to add `.env` to your `.gitignore` file to keep your API key secure.


Create a configuration file:
Create a `testagentai.config.js` file in your project root:

```javascript
module.exports = {
  testFramework: 'jest',
  outputDir: '__tests__',
  aiModel: 'gpt-3.5-turbo',
};
```


Use TestAgentAI in your project:
You can use TestAgentAI either programmatically or via the CLI.

a. Programmatic usage:
Create a file, e.g., `generateTests.js`:

```javascript
const { testGenerationPipeline } = require('testagentai');
const fs = require('fs');

async function generateTestsForFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const tests = await testGenerationPipeline(code);
  
  const testFilePath = filePath.replace(/\.js$/, '.test.js');
  fs.writeFileSync(testFilePath, tests);
  
  console.log(`Tests generated and saved to ${testFilePath}`);
}

// Usage
generateTestsForFile('src/myComponent.js');
```

Run this script with:

```shellscript
node generateTests.js
```

b. CLI usage:
You can use the TestAgentAI CLI directly in your terminal:

```shellscript
npx testagentai src/myComponent.js
```
## Features

- AI-powered test generation
- CLI tool for easy integration into your workflow
- Server component for team collaboration
- Flexible storage options

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TestAgentAI.git
   cd TestAgentAI
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your OpenAI API key:
   ```
   export OPENAI_API_KEY=your_api_key_here
   ```

### Usage

To generate tests for a file:

```
npx ts-node packages/cli/src/index.ts path/to/your/file.js
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
