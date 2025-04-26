export interface WebsocketError {
  status: number;     // HTTP-like status code (e.g., 400, 401, 500)
  message: string;    // Error message
  error?: string;     // Optional error type/description
  timestamp?: string; // Optional ISO timestamp when the error occurred
  path?: string;      // Optional endpoint/event where error occurred
  code?: string;      // Optional error code
  details?: any;      // Optional additional error details
}
