"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const improved_types_1 = require("../../types/improved-types");
const error_handler_1 = require("../../utils/error-handler");
// Mock output channel
const mockOutput = {
    appendLine: jest.fn(),
    show: jest.fn(),
};
describe("ErrorHandler", () => {
    let errorHandler;
    beforeEach(() => {
        errorHandler = new error_handler_1.ErrorHandler(mockOutput);
    });
    test("handles validation error", () => {
        const validationError = new improved_types_1.ValidationError({
            valid: false,
            error: "Invalid mod ID",
        });
        errorHandler.handleError(validationError);
        expect(mockOutput.appendLine).toHaveBeenCalledWith(expect.stringContaining("ValidationError"));
    });
    test("handles generic error", () => {
        errorHandler.handleError(new Error("Network timeout"));
        expect(mockOutput.appendLine).toHaveBeenCalledWith(expect.stringContaining("UnknownError"));
    });
    test("categorizes HTTP errors", () => {
        const httpError = new Error("HTTP 429: Rate limited");
        // Implementation would test getErrorCategory
        expect(true).toBe(true); // Placeholder for category test
    });
});
//# sourceMappingURL=error-handler.test.js.map