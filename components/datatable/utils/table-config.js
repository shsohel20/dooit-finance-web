/**
 * Table configuration options
 * Centralized configuration for the data table features
 */

// Default configuration
const defaultConfig = {
  enableRowSelection: true,        // Row selection enabled by default
  enableKeyboardNavigation: false, // Keyboard navigation disabled by default
  enableClickRowSelect: false,     // Clicking row to select disabled by default
  enablePagination: true,          // Pagination enabled by default
  enableSearch: true,              // Search enabled by default
  enableColumnFilters: true,       // Column filters enabled by default
  enableDateFilter: true,          // Date filter enabled by default
  enableColumnVisibility: true,    // Column visibility options enabled by default
  enableExport: true,              // Data export enabled by default
  enableUrlState: true,            // URL state persistence enabled by default
  enableColumnResizing: true,      // Column resizing enabled by default
  enableToolbar: true,             // Toolbar enabled by default
  size: "default",                 // Default size for buttons and inputs
  columnResizingTableId: undefined, // No table ID by default
  searchPlaceholder: undefined,    // No custom search placeholder by default
  allowExportNewColumns: true,     // Allow new columns from transform function by default
  defaultSortBy: undefined,        // No default sort column by default
  defaultSortOrder: "desc",        // Default sort order is descending
};

/**
 * Hook-like function to provide table configuration
 * Merges custom config with the default config
 */
export function useTableConfig(overrideConfig = {}) {
  return { ...defaultConfig, ...overrideConfig };
}
