<template>
  <div class="ticket-list-container">
    <div class="ticket-list-header">
      <p>
        {{ isAdmin ? "" : "View your existing tickets or create a new one." }}
      </p>
      <!-- Only show New Ticket button for regular users -->
      <button
        v-if="!isAdmin"
        class="new-ticket-btn"
        @click="$emit('new-ticket')"
      >
        <span class="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
        </span>
        New Support Ticket
      </button>
    </div>

    <FilterSection
      :filters="filters"
      :is-filtered="isFiltered"
      @update:filters="updateFilters"
      @apply-filters="applyFilters"
      @clear-filters="clearFilters"
    />

    <div class="tickets-panel">
      <h2>{{ isAdmin ? "All Support Tickets" : "Your Support Tickets" }}</h2>

      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading tickets...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button
          class="retry-btn"
          @click="isFiltered ? fetchFilteredTickets() : fetchTickets()"
        >
          Retry
        </button>
      </div>

      <div v-else class="tickets-table">
        <div class="tickets-header">
          <div class="col-subject">Subject</div>
          <div class="col-status">Status</div>
          <div class="col-priority">Priority</div>
          <div class="col-created">Created</div>
          <div class="col-investment">Investment</div>
        </div>

        <div
          v-for="ticket in tickets"
          :key="ticket.ticketId"
          class="ticket-row"
          @click="viewTicket(ticket.ticketId)"
        >
          <div class="col-subject">{{ ticket.subject }}</div>
          <div class="col-status">
            <span class="status-badge" :class="getStatusClass(ticket.status)">
              {{ ticket.status }}
            </span>
          </div>
          <div class="col-priority">
            <span
              class="priority-badge"
              :class="getPriorityClass(ticket.priority)"
            >
              {{ ticket.priority }}
            </span>
          </div>
          <div class="col-created">{{ formatDate(ticket.createdAt) }}</div>
          <div class="col-investment">
            {{ ticket.investmentProductName || "N/A" }}
          </div>
        </div>

        <div v-if="tickets.length === 0" class="no-tickets">
          {{
            isFiltered
              ? "No tickets match your filter criteria."
              : "You don't have any support tickets yet."
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FilterSection from "./FilterSection.vue";
import { getStatusClass, getPriorityClass, formatDate } from "../utils/helpers";

export default {
  name: "TicketList",
  components: {
    FilterSection,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    isFiltered: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "view-ticket",
    "new-ticket",
    "update:filters",
    "apply-filters",
    "clear-filters",
  ],
  data() {
    return {
      tickets: [],
      loading: false,
      error: null,
    };
  },
  mounted() {
    console.log("TicketList - isAdmin prop value:", this.isAdmin);
    this.fetchTickets();
  },
  watch: {
    isAdmin: {
      handler(newValue) {
        console.log("TicketList - isAdmin changed to:", newValue);
        this.fetchTickets();
      },
      immediate: true,
    },
  },
  methods: {
    async fetchTickets() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        console.log("ticket-list testinggggg: " + this.isAdmin);

        // Use different endpoint based on user role
        const endpoint = this.isAdmin
          ? "http://localhost:8080" + "/support/admin" // Admin endpoint
          : "http://localhost:8080" + "/support/user"; // User endpoint
        console.log("endpont testingggggg: " + endpoint);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.tickets = await response.json();
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        this.error = "Failed to load tickets. Please try again later.";
        this.tickets = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchFilteredTickets() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        // Only include non-empty filter values
        const filterParams = {};
        if (this.filters.status) filterParams.status = this.filters.status;
        if (this.filters.priority)
          filterParams.priority = this.filters.priority;

        console.log("Calling filter endpoint with params:", filterParams);

        // Use different filter endpoint based on user role
        const endpoint = this.isAdmin
          ? "http://localhost:8080" + "/support/filter" // Admin filter endpoint
          : "http://localhost:8080" + "/support/user/filter"; // User filter endpoint

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filterParams,
        });

        this.tickets = response.data;
      } catch (error) {
        console.error("Failed to fetch filtered tickets:", error);
        this.error = "Failed to apply filters. Please try again later.";
        // Keep the current tickets if filtering fails
      } finally {
        this.loading = false;
      }
    },

    updateFilters(newFilters) {
      this.$emit("update:filters", newFilters);
    },

    applyFilters() {
      if (this.isFiltered) {
        this.fetchFilteredTickets();
      } else {
        this.fetchTickets();
      }
      this.$emit("apply-filters");
    },

    clearFilters() {
      this.$emit("clear-filters");
      this.fetchTickets();
    },

    viewTicket(ticketId) {
      this.$emit("view-ticket", ticketId);
    },

    getStatusClass,
    getPriorityClass,
    formatDate,
  },
};
</script>

<style scoped>
.ticket-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ticket-list-header p {
  color: #7a95bd;
  margin: 0;
}

.new-ticket-btn {
  background-color: #172b4d;
  color: white;
  padding: 10px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.new-ticket-btn:hover {
  background-color: #0f1d35;
}

.new-ticket-btn svg {
  margin-right: 8px;
}

.tickets-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.tickets-panel h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #2d3748;
  font-weight: 600;
}

.tickets-table {
  width: 100%;
  border-collapse: collapse;
}

.tickets-header {
  display: flex;
  padding: 12px 16px;
  background-color: #f7fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
}

.ticket-row {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ticket-row:hover {
  background-color: #f7fafc;
}

.col-subject {
  flex: 3;
}

.col-status,
.col-priority,
.col-created,
.col-investment {
  flex: 1;
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  min-width: 80px;
  text-align: center;
  white-space: nowrap;
}

.status-open {
  background-color: #c6ebff;
  color: #1273da;
}

.status-responded {
  background-color: #c1ffd2;
  color: #0bac5b;
}

.status-closed {
  background-color: #ffb6ab;
  color: #d50a0a;
}

.status-reopened {
  background-color: #ffebb1;
  color: #f22828;
}

.priority-low {
  background-color: #c1ffd2;
  color: #0bac5b;
}

.priority-medium {
  background-color: #fff585;
  color: #fcae14;
}

.priority-high {
  background-color: #ffb6ab;
  color: #d50a0a;
}

.no-tickets {
  padding: 40px 0;
  text-align: center;
  color: #718096;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error message */
.error-message {
  text-align: center;
  padding: 20px;
  color: #e53e3e;
}

.retry-btn {
  background-color: #3182ce;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-btn:hover {
  background-color: #2b6cb0;
}

@media (max-width: 768px) {
  .ticket-row,
  .tickets-header {
    font-size: 13px;
  }

  .col-created,
  .col-investment {
    display: none;
  }

  .col-subject {
    flex: 2;
  }
}

@media (max-width: 480px) {
  .ticket-list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .new-ticket-btn {
    width: 100%;
  }

  .ticket-row,
  .tickets-header {
    padding: 10px;
  }

  .col-priority {
    display: none;
  }
}
</style>
