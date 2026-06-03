import { describe, it, expect } from 'vitest';
import { capitalize } from './string';

describe('capitalize', () => {
  describe('separator-based formats', () => {
    it('converts snake_case', () => {
      expect(capitalize('capital_case')).toBe('Capital Case');
    });

    it('converts kebab-case', () => {
      expect(capitalize('kebab-case')).toBe('Kebab Case');
    });

    it('converts multi-word snake_case', () => {
      expect(capitalize('snake_case_example')).toBe('Snake Case Example');
    });

    it('collapses repeated separators', () => {
      expect(capitalize('foo__bar---baz')).toBe('Foo Bar Baz');
    });
  });

  describe('camelCase and PascalCase', () => {
    it('converts camelCase', () => {
      expect(capitalize('capitalCase')).toBe('Capital Case');
    });

    it('converts PascalCase', () => {
      expect(capitalize('PascalCase')).toBe('Pascal Case');
    });

    it('converts multi-word camelCase', () => {
      expect(capitalize('camelCaseExample')).toBe('Camel Case Example');
    });

    it('converts multi-word PascalCase', () => {
      expect(capitalize('PascalCaseExample')).toBe('Pascal Case Example');
    });
  });

  describe('inconsistent or mixed casing', () => {
    it('normalizes space-separated mixed-case words', () => {
      expect(capitalize('cAPitAl cASE')).toBe('Capital Case');
    });

    it('lowercases an ALLCAPS word', () => {
      expect(capitalize('ALLCAPS')).toBe('Allcaps');
    });

    it('normalizes already-correct Title Case', () => {
      expect(capitalize('Hello World')).toBe('Hello World');
    });

    it('normalizes all-lowercase space-separated words', () => {
      expect(capitalize('already lowercase')).toBe('Already Lowercase');
    });
  });

  describe('mixed separators and formats', () => {
    it('handles underscore-prefixed camelCase tokens', () => {
      expect(capitalize('my_camelCase')).toBe('My Camel Case');
    });

    it('handles kebab mixed with camelCase', () => {
      expect(capitalize('kebab-caseAndMore')).toBe('Kebab Case And More');
    });
  });

  describe('whitespace handling', () => {
    it('collapses multiple spaces', () => {
      expect(capitalize('multiple   spaces')).toBe('Multiple Spaces');
    });

    it('trims leading and trailing spaces', () => {
      expect(capitalize('  hello world  ')).toBe('Hello World');
    });
  });

  describe('edge cases', () => {
    it('handles a single word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles an empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });
});
