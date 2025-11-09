/**
 * Check if a column has 'id' and 'size' properties
 */
function hasIdAndSize(column) {
  return (
    column &&
    typeof column === "object" &&
    "id" in column &&
    typeof column.id === "string" &&
    "size" in column &&
    typeof column.size === "number"
  );
}

/**
 * Check if a column has 'accessorKey' and 'size' properties
 */
function hasAccessorKeyAndSize(column) {
  return (
    column &&
    typeof column === "object" &&
    "accessorKey" in column &&
    typeof column.accessorKey === "string" &&
    "size" in column &&
    typeof column.size === "number"
  );
}

/**
 * Extract default column sizes from column definitions
 */
export function extractDefaultColumnSizes(columns) {
  const defaultSizing = {};

  columns.forEach((column) => {
    if (hasIdAndSize(column)) {
      defaultSizing[column.id] = column.size;
    } else if (hasAccessorKeyAndSize(column)) {
      defaultSizing[column.accessorKey] = column.size;
    }
  });

  return defaultSizing;
}

/**
 * Validate parsed column sizing object
 */
function isValidColumnSizing(value) {
  if (!value || typeof value !== "object") return false;

  return Object.values(value).every(
    (size) => typeof size === "number" && !Number.isNaN(size) && size > 0
  );
}

/**
 * Initialize column sizes from localStorage or defaults
 */
export function initializeColumnSizes(columns, tableId, setColumnSizing) {
  if (!Array.isArray(columns) || columns.length === 0) return;

  const defaultSizing = extractDefaultColumnSizes(columns);

  if (Object.keys(defaultSizing).length === 0) return;

  try {
    const savedSizing = localStorage.getItem(`table-column-sizing-${tableId}`);

    if (!savedSizing) {
      setColumnSizing(defaultSizing);
    } else {
      const parsedSizing = JSON.parse(savedSizing);

      if (isValidColumnSizing(parsedSizing)) {
        setColumnSizing(parsedSizing);
      } else {
        console.warn(
          "Invalid column sizing format in localStorage, using defaults"
        );
        setColumnSizing(defaultSizing);
      }
    }
  } catch (error) {
    console.warn("Failed to load saved column sizes. Using defaults.", error);
    setColumnSizing(defaultSizing);
  }
}

/**
 * Track column resizing state in document body for styling purposes
 */
export function trackColumnResizing(isResizing, attribute = "data-resizing") {
  if (isResizing) {
    document.body.setAttribute(attribute, "true");
  } else {
    document.body.removeAttribute(attribute);
  }
}

/**
 * Clean up column resizing tracking when component unmounts
 */
export function cleanupColumnResizing(attribute = "data-resizing") {
  document.body.removeAttribute(attribute);
}
