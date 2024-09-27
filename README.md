# TestAgentAI

TestAgentAI is an open-source AI-powered test generation tool. It leverages OpenAI's GPT models to automatically generate comprehensive unit tests for your code, saving time and improving code quality.

## Features

- AI-powered test generation using OpenAI's GPT models
- CLI tool for seamless integration into your development workflow
- Server component for team collaboration and centralized test management
- Flexible storage options for test results and history
- Support for multiple programming languages (JavaScript/TypeScript initially, with plans to expand)
- Integration with popular testing frameworks like Jest

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- OpenAI API key
- Jest (for running generated tests)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cravinos/TestAgentAI.git
   cd TestAgentAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API key:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

   Alternatively, create a `.env` file in the project root and add:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Usage

To generate tests for a file:

```bash
npx ts-node packages/cli/src/index.ts path/to/your/file.js
```

This will generate a test file in the `__tests__` directory (or a custom directory if specified) and run the tests using Jest.

### Configuration

You can customize TestAgentAI behavior by creating a `testagentai.config.js` file in your project root:

```javascript
module.exports = {
  testFramework: 'jest',
  outputDir: '__tests__',
  aiModel: 'gpt-3.5-turbo',
  // Add more configuration options as needed
};
```

## Project Structure

```
TestAgentAI/
├── packages/
│   ├── cli/            # Command-line interface
│   ├── server/         # Server component for team collaboration
│   ├── test-generator/ # Core test generation logic
│   └── storage-adapters/ # Adapters for different storage options
├── __tests__/          # Tests for TestAgentAI itself
├── docs/               # Documentation
└── examples/           # Example usage and integrations
```

## Contributing

We welcome contributions from the community! Whether it's bug fixes, feature additions, or documentation improvements, your help is appreciated. Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

### Development Setup

1. Fork the repository and clone your fork
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Start the development server: `npm run dev`

## Roadmap

- [ ] Support for additional programming languages
- [ ] Integration with more testing frameworks
- [ ] Web interface for test management
- [ ] Performance optimizations for large codebases
- [ ] AI-powered test suite analysis and recommendations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- OpenAI for their powerful GPT models
- The open-source community for inspiration and support

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or reach out to the maintainers directly.

## CLI Tool Usage

Now, users can install and use the TestAgentAI CLI tool in their projects:

1. Install the tool globally:

```shellscript
npm install -g testagentai-cli
```

2. Navigate to their project directory:

```shellscript
cd /path/to/their/project
```

3. Run the tool on a specific file:

```shellscript
testagentai src/utils/someFile.js
```

The tool will generate tests relative to the current project structure and run them using the project's Jest installation.

## Options

- `-o, --output <directory>`: Specify the output directory for test files (default: "__tests__")

## Requirements

- Node.js 12 or higher
- Jest installed in your project

## How It Works

TestAgentAI CLI uses advanced AI to analyze your code and generate comprehensive test suites. It creates tests that cover various scenarios, including edge cases, ensuring robust test coverage for your project.

---

Happy testing with TestAgentAI! 🚀🤖