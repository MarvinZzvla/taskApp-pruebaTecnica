import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extiende los matchers de Vitest
expect.extend(matchers);

// Limpia después de cada test
afterEach(() => {
  cleanup();
});
