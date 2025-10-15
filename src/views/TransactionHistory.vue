<template>
  <div class="app-container">
    <!-- Navbar -->
    <AppNavbar />

    <div class="content-wrapper">
      <!-- Sidebar -->
      <AppSidebar />
      <!-- Main Content -->
      <main class="main-content">
        <div class="page-header">
          <h1>Transaction History</h1>
          <p class="subtitle">View all your past investment activities</p>
        </div>

        <div class="transaction-filters">
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search transactions..."
              class="search-input"
              @input="filterTransactions"
            />
          </div>
          <div class="filter-controls">
            <div class="filter-select">
              <select
                v-model="selectedType"
                @change="applyFilters"
                class="select-input"
              >
                <option value="">All Types</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div class="filter-select">
              <select
                v-model="sortOrder"
                @change="applyFilters"
                class="select-input"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading transactions...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ error }}</p>
          <button @click="fetchTransactions" class="retry-button">
            Try Again
          </button>
        </div>

        <!-- Updated template sections for the Vue component -->

        <!-- Empty state - update condition -->
        <div v-else-if="transactions.length === 0" class="empty-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"
            ></path>
            <path d="M15.5 2H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5.5"></path>
            <path d="M8 19h1"></path>
            <path d="M2 11h20"></path>
          </svg>
          <p>No transactions found</p>
        </div>

        <!-- Transaction table - update condition and loop -->
        <div v-else class="transaction-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction Type</th>
                <th>Investment</th>
                <th>Units</th>
                <th>NAV at Transaction</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in transactions"
                :key="transaction.id"
                class="transaction-row"
              >
                <td class="date-column">
                  <div class="date">{{ formatDate(transaction.txnDate) }}</div>
                  <div class="time">{{ formatTime(transaction.txnDate) }}</div>
                </td>
                <td>
                  <span
                    class="transaction-badge"
                    :class="transaction.txnType.toLowerCase()"
                  >
                    {{ transaction.txnType }}
                  </span>
                </td>
                <td class="investment-column">
                  <div class="investment-name">
                    {{ transaction.investmentProductName }}
                  </div>
                </td>
                <td>{{ formatNumber(transaction.units) }}</td>
                <td>${{ formatNumber(transaction.navAtTxn) }}</td>
                <td>${{ formatNumber(transaction.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Updated Pagination -->
        <div
          v-if="!loading && !error && transactions.length > 0"
          class="pagination"
        >
          <button
            @click="previousPage"
            :disabled="!hasPrevious"
            class="pagination-button"
          >
            Previous
          </button>
          <div class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }} ({{
              totalElements
            }}
            total)
          </div>
          <button
            @click="nextPage"
            :disabled="!hasNext"
            class="pagination-button"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AppNavbar from "../components/Navbar.vue";
import AppSidebar from "../components/Sidebar.vue";
export default {
  name: "TransactionHistory",

  data() {
    return {
      transactions: [],
      loading: true,
      error: null,
      searchQuery: "",
      selectedType: "",
      sortOrder: "desc",
      currentPage: 1,
      rowsPerPage: 7,
      totalPages: 0,
      totalElements: 0,
      hasNext: false,
      hasPrevious: false,
    };
  },
  created() {
    this.fetchTransactions();
  },
  components: {
    AppNavbar,
    AppSidebar,
  },

  created() {
    this.fetchTransactions();
  },

  methods: {
    // Updated method to use the filter endpoint
    async fetchTransactions() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // Build query parameters
        const params = new URLSearchParams({
          page: (this.currentPage - 1).toString(), // Backend expects 0-based page
          size: this.rowsPerPage.toString(),
          sortBy: "txnDate",
          sortOrder: this.sortOrder,
        });

        if (this.searchQuery) {
          params.append("searchQuery", this.searchQuery);
        }

        if (this.selectedType) {
          params.append("txnType", this.selectedType);
        }

        const response = await fetch(
          "http://localhost:8080" + `/portfolio/transactions/filter?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error fetching transactions: ${response.statusText}`
          );
        }

        const data = await response.json();
        this.transactions = data.transactions;
        this.currentPage = data.currentPage + 1; // Convert back to 1-based for display
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.hasNext = data.hasNext;
        this.hasPrevious = data.hasPrevious;

        this.loading = false;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        this.error = "Failed to load transactions. Please try again.";
        this.loading = false;
      }
    },

    // Simplified filter method - just calls fetchTransactions
    filterTransactions() {
      this.currentPage = 1; // Reset to first page when filtering
      this.fetchTransactions();
    },

    // Simplified apply filters - just calls fetchTransactions
    applyFilters() {
      this.currentPage = 1; // Reset to first page when filtering
      this.fetchTransactions();
    },

    // Add method for pagination
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.fetchTransactions();
      }
    },

    // Update pagination button handlers
    previousPage() {
      if (this.hasPrevious) {
        this.currentPage--;
        this.fetchTransactions();
      }
    },

    nextPage() {
      if (this.hasNext) {
        this.currentPage++;
        this.fetchTransactions();
      }
    },

    // Keep existing formatting methods as they are
    formatDate(dateTimeString) {
      if (!dateTimeString) return "";
      const date = new Date(dateTimeString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    formatTime(dateTimeString) {
      if (!dateTimeString) return "";
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    formatNumber(value) {
      if (value === null || value === undefined) return "";
      return Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Content Layout */
.content-wrapper {
  display: flex;
  flex: 1;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #ffffff;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 5px;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
}

/* Transaction Filters */
.transaction-filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-container {
  flex: 1;
  max-width: 800px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.filter-select {
  position: relative;
}

.select-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

/* Transaction Table */
.transaction-table {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f9fafb;
}

th {
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

td {
  padding: 16px;
  font-size: 14px;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
}

tr:last-child td {
  border-bottom: none;
}

.transaction-row {
  transition: background-color 0.2s;
}

.transaction-row:hover {
  background-color: #f9fafb;
}

.date-column {
  width: 150px;
}

.date {
  font-weight: 500;
}

.time {
  color: #6b7280;
  font-size: 13px;
  margin-top: 2px;
}

.transaction-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.transaction-badge.buy {
  background-color: #dcfce7;
  color: #166534;
}

.transaction-badge.sell {
  background-color: #fee2e2;
  color: #b91c1c;
}

.investment-column {
  min-width: 200px;
}

.investment-name {
  font-weight: 500;
}

/* Loading, Error, and Empty States */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container svg,
.empty-container svg {
  margin-bottom: 16px;
  color: #9ca3af;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.pagination-button {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

/* Responsive styles */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 15px;
  }

  .transaction-filters {
    flex-direction: column;
    gap: 15px;
  }

  .filter-controls {
    width: 100%;
    justify-content: space-between;
  }

  .filter-select {
    flex: 1;
  }

  .select-input {
    width: 100%;
  }

  th,
  td {
    padding: 12px 10px;
    font-size: 13px;
  }

  .date-column {
    width: auto;
  }

  .transaction-badge {
    padding: 3px 8px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>