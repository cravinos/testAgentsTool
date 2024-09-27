import OpenAI from 'openai';
import logger from '../../server/src/utils/logger';

export class TestGenerator {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateTests(sourceCode: string, fileName: string, importPath: any): Promise<string> {
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
      logger.info(`Generating tests for ${fileName}`);
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that generates Jest unit tests. Output only valid JavaScript code without any markdown formatting." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const generatedTests = response.choices[0].message.content || 'No tests generated.';
      logger.info(`Tests generated successfully for ${fileName}`);
      return generatedTests.replace(/```javascript|```/g, '').trim();
    } catch (error) {
      logger.error(`Error generating tests for ${fileName}`, { error });
      throw new Error('Failed to generate tests');
    }
  }
}