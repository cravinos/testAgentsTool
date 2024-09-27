# TestAgentAI

TestAgentAI is an open-source AI-powered test generation tool. It uses OpenAI's GPT models to generate unit tests for your code.

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