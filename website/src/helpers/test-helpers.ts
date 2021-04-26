export const prepAll = () => {
  beforeAll(async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
};

export const replaceFetch = (data: any) => {
  return jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      text: () => Promise.resolve(JSON.stringify(data)),
    } as Response)
  );
};
