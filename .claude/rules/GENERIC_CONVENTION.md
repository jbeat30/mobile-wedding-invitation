# Jbeat Common Conventions

> This document defines the basic coding conventions commonly used by jbeat across multiple projects.
> It does not define rules for a specific project. Instead, it describes shared conventions that can be applied consistently across jbeat projects.

## 1. Development Philosophy

- Prioritize DX: Code that is easy to read and easy to trace is the most important.
- Preserve existing public behavior first: User experience, call contracts, and data flow must not be changed arbitrarily before and after a modification.
- Use practical abstraction: Separate logic only when actual duplication and maintenance costs are clear.
- Prioritize traceability and intent over reducing the number of lines.
- Prefer a clear structure that fits the current context over vague future reuse.
- Prefer practical simplicity over excessive abstraction.
- Aim for maintainable code rather than clever-looking code.
- Prioritize controlling regression risk over implementation speed.

## 2. Basic Working Attitude

### 2.1 Change Principles

- Do not make changes outside the requested scope.
- Even when changes are necessary, always keep the scope minimal.
- Respect the existing code’s patterns, flow, naming, and error-handling style first.
- Avoid structural reorganization, library replacement, or file relocation without clear justification.

### 2.2 Judgment Principles

- Do not make arbitrary conclusions about uncertain areas.
- If a safe assumption can be made, state the assumption clearly and proceed.
- Do not present unverified information as fact.
- Do not claim that validation was performed if it was not actually executed.

## 3. Naming Conventions

### 3.1 Basic Principles

- Names should reveal their role and intent.
- Minimize the use of abbreviations, temporary names, and context-dependent names.
- For state values, use names that clearly express their meaning whenever possible.
- If unit, scope, or source is important, reflect it in the name.
- Even if a name becomes longer, prioritize clarity over abbreviation when it makes the meaning clearer.

### 3.2 Booleans, Collections, and Handlers

- Boolean values should preferably use prefixes such as `is`, `has`, `can`, `should`, or `needs`.
- Collections such as arrays, maps, and sets should use plural names or names that clearly indicate their collection-like nature.
- Event handler functions should use the `handle` prefix whenever possible.
- Creation, conversion, and lookup functions should include verbs that reveal their role.

### 3.3 External Data

- Data that must preserve external system specifications should be managed separately from internal names.
- If the internal representation differs from the external representation, clearly define the conversion point.
- Do not arbitrarily transform external contracts in a way that creates confusion.
- Do not carelessly rename external field names just to match internal preferences.

## 4. Variables and Constants

### 4.1 Variable Declarations

- Treat values that do not require reassignment as immutable.
- Avoid temporary names whose meaning is unclear.
- Prefer the smallest necessary scope over a broad scope.

### 4.2 Criteria for Constants

- Numbers, strings, and option values whose meaning is unclear should be managed as named constants.
- Policy values, thresholds, state keys, and external identifiers should first be considered as candidates for constants.
- However, avoid excessive separation if the definition becomes too far from the usage site and makes tracing difficult.

## 5. Functions and Modules

### 5.1 Function Design

- A single function or module should focus on one core responsibility.
- However, avoid excessive separation that harms readability.
- Handle exceptional cases early to reduce nesting.
- Keep the boundaries of input, output, and side effects as clear as possible.
- If the purpose is not clear from the function name alone, reconsider the design.

### 5.2 Input and Return Values

- Handle input values according to their level of trust.
- Nullable or optional values should be handled explicitly rather than through implicit assumptions.
- Return values should be easy for the caller to interpret.
- The way success and failure are represented should remain consistent within the same layer.

### 5.3 Side Effects and State Changes

- Side effects such as state changes, storage operations, network calls, file writes, and log outputs should be placed where they are as visible as possible.
- Hidden global state changes or implicit caching should be handled carefully.
- Prefer official update paths over bypass-style updates.

### 5.4 Abstraction Criteria

- Do not separate logic solely because it “might be needed later.”
- Consider abstraction only when actual duplication or complexity has been confirmed.
- Do not separate logic if commonization makes the context harder to understand.
- Prioritize clarity in the current context over reuse for the sake of reuse.

## 6. Comment Style

Unless there is a specific project requirement, all comments should be written in Korean. Comments should be concise and consistent so that the core content can be understood quickly. They should focus on intent and constraints rather than implementation details. Comments should not be translations of the code. Instead, they should preserve the reasoning that is not obvious from the code alone.

### 6.1 Basic Style and Direction

- **Use noun-style endings**: End comments with noun-style expressions such as “담당”, “반환”, “수행”, “정의”, or “검증” to improve readability.
- **Avoid verbose descriptive sentences**: Exclude unnecessary wording such as “~을 담당하고 있습니다” or “~하는 로직입니다”.
- **Focus on intent**: Focus on explaining **business rules (Why)** and **core functionality (What)** rather than implementation details (How).
    - *Preferred*: `/** 유효성 검증 및 에러 메시지 반환 */`
    - *Avoid*: `// 이 함수는 입력값이 맞는지 확인하고 틀리면 에러를 보냅니다.`

### 6.2 When Comments Are Needed

- Policy-based branches or exception handling
- External system constraints or data contracts
- Reasons for performance optimization, bypass handling, or caching
- Cases where intent is difficult to understand from naming alone
- Complex state changes or side effects

### 6.3 Documentation Comments

- Prefer documentation comments for public functions, core classes, and externally exposed APIs.
- Explicitly document parameters, return values, side effects, and exceptions when they are important.
- Use tags such as `@param`, `@returns`, `@throws`, `@example`, `@note`, and `@description` when needed.
- The purpose of tags is not to increase their number, but to reduce the cost of understanding.

### 6.4 Inline Comments

- Use `//` comments when a one-line supplement is appropriate.
- Add short comments to important variables, state values, or configuration objects when it is not immediately clear what they are, why they are needed, or where they are used in the flow.
- For complex branches, explain the reason and policy background behind the branch rather than merely restating the condition.

### 6.5 Comments to Avoid

- Comments that simply restate the code
- State descriptions that can easily become outdated from the current code
- Personal impressions or speculative notes
- Lengthy procedural explanations that are difficult to maintain
- Explanations that are likely not to be updated together when the implementation changes

## 7. Structure and Dependencies

### 7.1 Structural Principles

- Perform structural changes only when there is a clear maintenance benefit.
- Before moving code, evaluate traceability and impact scope before the act of “cleaning up” itself.
- Common modules should not become places where everything is added merely for convenience.

### 7.2 Dependency Principles

- Keep dependency directions consistent.
- Be cautious of structures where lower-level components directly know higher-level policies.
- Do not add references that break boundaries merely for convenience.
- Be careful not to create circular dependencies or hidden coupling.

## 8. Duplication and Commonization

- If the same rule is repeated in multiple places, consider whether it can be commonized.
- Do not commonize code simply to reduce the number of lines.
- Even if duplication exists in two or more places, do not force them together when their contexts differ.
- If commonization increases the cost of understanding the call sites, be willing to reconsider it.

## 9. Stability and Quality

### 9.1 Stability

- Always consider external input and possible failures.
- Do not hide errors. Make recovery strategies or failure impact visible.
- Write normal paths and failure paths separately.
- Be careful not to break existing public behavior through changes.

### 9.2 Security and Sensitive Information

- Do not expose sensitive information, secrets, or credentials in code or logs.
- Do not trust external data. Consider validation or defensive logic.
- Do not easily allow risky bypass implementations, even as temporary solutions.

### 9.3 Validation

- When validation is possible, perform static analysis, tests, builds, or runtime checks.
- Clearly state any parts that could not be validated.
- Do not exaggerate validation results.
- Prioritize reviewing paths with a high possibility of regression.

## 10. Result Reporting Principles

### 10.1 Explanation Style

- Organize result explanations in the following order: summary, key changes, validation results, and remaining risks.
- Prioritize actual changes and impact scope over lengthy theoretical explanations.
- Explain the context by file, module, or feature unit.

### 10.2 Validation Reporting Style

- Separate validations that were executed from validations that could not be executed.
- Distinguish assumptions from facts.
- If remaining risks exist, state them clearly without minimizing them.

## 11. Prohibited Actions

- Do not perform large-scale refactoring outside the requested scope.
- Do not proceed with implementation based on unverified assumptions.
- Do not ignore exceptions carelessly just to hide errors.
- Do not abuse unvalidated performance optimizations or abstractions.
- Do not force personal preferences that conflict with project rules.
- Do not enforce stack-specific practices that are not documented locally as if they were universal rules.

## 12. Final Self-Check

- Confirm whether the existing intent has been preserved.
- Confirm whether the change scope has been minimized.
- Confirm whether possible side effects have been reviewed.
- Confirm whether there are conflicts with local rules.
- Confirm whether executed and unexecuted validations have been stated.
- Confirm whether maintainability and traceability have improved.