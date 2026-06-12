export function parseApiError(error) {
  const response = error?.response?.data;

  const message =
    response?.message ||
    response?.error ||
    (Array.isArray(response?.errors) && response.errors.length > 0
      ? response.errors[0]?.message
      : null) ||
    error?.message ||
    "An unexpected error occurred";

  const fields = Array.isArray(response?.errors) ? response.errors : [];

  return { message, fields };
}
