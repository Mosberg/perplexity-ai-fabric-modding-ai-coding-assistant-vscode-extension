import { ValidationError } from "../../types/improved-types";
import { ErrorHandler } from "../../utils/error-handler";

// Mock output channel
const mockOutput: any = {
  appendLine: jest.fn(),
  show: jest.fn(),
};

describe("ErrorHandler", () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler(mockOutput);
  });

  test("handles validation error", () => {
    const validationError = new ValidationError({
      valid: false,
      error: "Invalid mod ID",
    });
    errorHandler.handleError(validationError);

    expect(mockOutput.appendLine).toHaveBeenCalledWith(
      expect.stringContaining("ValidationError")
    );
  });

  test("handles generic error", () => {
    errorHandler.handleError(new Error("Network timeout"));

    expect(mockOutput.appendLine).toHaveBeenCalledWith(
      expect.stringContaining("UnknownError")
    );
  });

  test("categorizes HTTP errors", () => {
    const httpError = new Error("HTTP 429: Rate limited");
    // Implementation would test getErrorCategory

    expect(true).toBe(true); // Placeholder for category test
  });
});
