# Contributing to ffxl

Thank you for your interest in contributing to ffxl! This guide will help you get started.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ffxl.git
   cd ffxl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a test feature flags file:
   ```bash
   cp feature-flags.example.yaml feature-flags.yaml
   ```

## Development Workflow

### Running Tests
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Building
```bash
# Build the library
npm run build

# Watch mode for development
npm run dev
```

### Linting and Formatting
```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Type Checking
```bash
npm run typecheck
```

## Project Structure

```
ffxl/
├── src/
│   ├── __tests__/           # Test files
│   │   ├── environment.test.ts
│   │   └── evaluator.test.ts
│   ├── types.ts             # TypeScript type definitions
│   ├── environment.ts       # Environment detection and logging
│   ├── loader.ts            # YAML loading and validation
│   ├── config.ts            # Configuration management
│   ├── evaluator.ts         # Feature flag evaluation logic
│   └── index.ts             # Public API exports
├── examples/                # Usage examples
├── dist/                    # Build output (generated)
├── .github/workflows/       # CI/CD pipelines
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── eslint.config.js
```

## Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure:
   - All tests pass: `npm test`
   - Code is properly formatted: `npm run format`
   - No linting errors: `npm run lint`
   - TypeScript compiles: `npm run typecheck`

3. Add tests for new functionality

4. Update documentation if needed

5. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new feature description"
   ```

## Commit Message Convention

We follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `chore:` Build process or auxiliary tool changes
- `perf:` Performance improvements

## Pull Request Process

1. Ensure all tests pass and code is properly formatted
2. Update the README.md if you've changed functionality
3. Update examples if you've added new features
4. Push your branch and create a pull request
5. Wait for review and address any feedback

## Code Style

- We use Prettier for code formatting
- We use ESLint for code quality
- Follow TypeScript best practices
- Write clear, descriptive variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing Guidelines

- Write tests for all new functionality
- Maintain or improve code coverage
- Test both success and error cases
- Use descriptive test names
- Group related tests using `describe` blocks

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about usage
- Suggestions for improvements

Thank you for contributing!
