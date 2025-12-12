import '@testing-library/jest-dom';

// Мок для uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));
