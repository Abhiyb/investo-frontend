<template>
  <div class="new-ticket-container">
    <button class="back-btn" @click="$emit('back')">
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
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to Tickets
    </button>

    <div class="new-ticket-panel">
      <div class="new-ticket-header">
        <div class="icon-circle">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div>
          <h2>Create Support Ticket</h2>
          <p>
            Please provide details about your issue and we'll get back to you
            soon.
          </p>
        </div>
      </div>

      <form @submit.prevent="submitTicket" class="ticket-form">
        <div class="form-group">
          <label for="subject">Subject</label>
          <input
            id="subject"
            v-model="ticket.subject"
            type="text"
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="ticket.description"
            placeholder="Please provide detailed information about your issue"
            rows="6"
            required
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="priority">Priority</label>
            <!-- Enhanced Priority Dropdown -->
            <div class="priority-dropdown" ref="priorityDropdown">
              <div
                class="priority-selected"
                :class="'priority-' + ticket.priority.toLowerCase()"
                @click="togglePriorityDropdown"
              >
                <div class="priority-indicator-wrapper">
                  <span class="priority-indicator"></span>
                  <span>{{ getPriorityLabel(ticket.priority) }}</span>
                </div>
                <svg
                  class="dropdown-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <transition name="dropdown">
                <div class="priority-options" v-if="showPriorityDropdown">
                  <div
                    v-for="option in priorityOptions"
                    :key="option.value"
                    class="priority-option"
                    :class="[
                      { selected: ticket.priority === option.value },
                      'priority-' + option.value.toLowerCase(),
                    ]"
                    @click="selectPriority(option.value)"
                  >
                    <div class="priority-option-content">
                      <span class="priority-indicator"></span>
                      <span>{{ option.label }}</span>
                    </div>
                    <span
                      class="checkmark"
                      v-if="ticket.priority === option.value"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>
              </transition>
            </div>
            <p class="form-hint">How urgent is your issue?</p>
          </div>

          <div class="form-group half">
            <label for="investment">Related Investment (Optional)</label>
            <!-- Enhanced Investment Dropdown -->
            <div class="investment-dropdown" ref="investmentDropdown">
              <div
                class="investment-selected"
                @click="toggleInvestmentDropdown"
              >
                <div class="investment-selected-text">
                  {{ getSelectedInvestmentName() }}
                </div>
                <svg
                  class="dropdown-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <transition name="dropdown">
                <div class="investment-options" v-if="showInvestmentDropdown">
                  <div
                    class="investment-option"
                    :class="{ selected: ticket.investmentProductName === '' }"
                    @click="selectInvestment('')"
                  >
                    <div class="investment-option-content">
                      <span>Select investment</span>
                    </div>
                    <span
                      class="checkmark"
                      v-if="ticket.investmentProductName === ''"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  </div>
                  <div
                    v-for="inv in investments"
                    :key="inv.id"
                    class="investment-option"
                    :class="{
                      selected: ticket.investmentProductName === inv.name,
                    }"
                    @click="selectInvestment(inv.name)"
                  >
                    <div class="investment-option-content">
                      <span>{{ inv.name }}</span>
                    </div>
                    <span
                      class="checkmark"
                      v-if="ticket.investmentProductName === inv.name"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  </div>
                </div>
              </transition>
            </div>
            <p class="form-hint">
              If your issue is related to a specific investment
            </p>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            <span class="btn-content">
              <svg
                v-if="loading"
                class="spinner"
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>{{ loading ? "Submitting..." : "Submit Ticket" }}</span>
            </span>
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NewTicketForm",
  props: {
    investments: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      ticket: {
        subject: "",
        description: "",
        priority: "MEDIUM", // Default to Medium
        investmentProductName: "",
      },
      loading: false,
      error: null,
      showPriorityDropdown: false,
      priorityOptions: [
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
      ],
      showInvestmentDropdown: false,
    };
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener("click", this.closeDropdownOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdownOnClickOutside);
  },
  methods: {
    togglePriorityDropdown(event) {
      event.stopPropagation();
      this.showPriorityDropdown = !this.showPriorityDropdown;
    },
    closeDropdownOnClickOutside(event) {
      if (
        this.$refs.priorityDropdown &&
        !this.$refs.priorityDropdown.contains(event.target)
      ) {
        this.showPriorityDropdown = false;
      }
      if (
        this.$refs.investmentDropdown &&
        !this.$refs.investmentDropdown.contains(event.target)
      ) {
        this.showInvestmentDropdown = false;
      }
    },
    selectPriority(value) {
      this.ticket.priority = value;
      this.showPriorityDropdown = false;
    },
    getPriorityLabel(value) {
      const option = this.priorityOptions.find((opt) => opt.value === value);
      return option ? option.label : "Medium";
    },
    toggleInvestmentDropdown(event) {
      event.stopPropagation();
      this.showInvestmentDropdown = !this.showInvestmentDropdown;
    },
    selectInvestment(name) {
      this.ticket.investmentProductName = name;
      this.showInvestmentDropdown = false;
    },
    getSelectedInvestmentName() {
      if (!this.ticket.investmentProductName) return "Select investment";
      return this.ticket.investmentProductName;
    },
    async submitTicket() {
      this.error = null;
      this.loading = true;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8080" + "/support/createTicket",
          {
            subject: this.ticket.subject,
            description: this.ticket.description,
            priority: this.ticket.priority,
            investmentProductName: this.ticket.investmentProductName || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Emit the event
        this.$emit("ticket-created", response.data);

        // Reset form
        this.resetForm();

        // Navigate back to ticket list after successful submission
        this.$emit("back");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          this.error = err.response.data.message;
        } else {
          this.error =
            "Failed to create support ticket. Please try again later.";
        }
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.ticket.subject = "";
      this.ticket.description = "";
      this.ticket.priority = "MEDIUM";
      this.ticket.investmentProductName = "";
    },
  },
};
</script>

<style scoped>
.back-btn {
  background-color: transparent;
  color: #4a5568;
  padding: 8px 12px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #f7fafc;
  transform: translateX(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.back-btn svg {
  margin-right: 8px;
}

.new-ticket-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 28px;
  border: 1px solid #e2e8f0;
}

.new-ticket-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ebf8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3182ce;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(66, 153, 225, 0.15);
}

.new-ticket-header h2 {
  margin: 0;
  font-size: 22px;
  color: #2d3748;
  font-weight: 600;
}

.new-ticket-header p {
  color: #718096;
  margin: 8px 0 0 0;
  font-size: 15px;
}

.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 24px;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  font-size: 15px;
}

.form-hint {
  margin: 6px 0 0 0;
  font-size: 13px;
  color: #718096;
}

.ticket-form input,
.ticket-form textarea {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  width: 100%;
  background-color: white;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.ticket-form input:focus,
.ticket-form textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.ticket-form input::placeholder,
.ticket-form textarea::placeholder {
  color: #a0aec0;
}

/* Enhanced Priority Dropdown Styling */
.priority-dropdown {
  position: relative;
  width: 100%;
  z-index: 100;
}

.priority-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.priority-selected:hover {
  border-color: #a0aec0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.priority-indicator-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.priority-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #a0aec0;
}

.priority-low .priority-indicator {
  background-color: #48bb78; /* Green for low */
}

.priority-medium .priority-indicator {
  background-color: #ecc94b; /* Yellow for medium */
}

.priority-high .priority-indicator {
  background-color: #f56565; /* Red for high */
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.priority-dropdown:has(.priority-options) .dropdown-icon {
  transform: rotate(180deg);
}

.priority-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 10;
}

.priority-option {
  padding: 14px 16px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority-option:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.priority-option:hover {
  background-color: #e1f1ff;
}

.priority-option.selected {
  background-color: #c9e4fb;
}

.priority-option-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Regular select wrapper for other dropdowns */
.select-wrapper {
  position: relative;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding: 14px;
  padding-right: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.select-wrapper select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.select-wrapper .select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #718096;
  pointer-events: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.submit-btn {
  background-color: #172b4d;
  color: white;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(23, 43, 77, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.submit-btn:hover:not(:disabled) {
  background-color: #0f1d35;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 43, 77, 0.25);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(23, 43, 77, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #e53e3e;
  margin-top: 10px;
  padding: 10px;
  background-color: #fff5f5;
  border-radius: 6px;
  border-left: 3px solid #e53e3e;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .new-ticket-header {
    flex-direction: column;
  }

  .icon-circle {
    margin-bottom: 8px;
  }

  .new-ticket-panel {
    padding: 20px;
  }
}

/* Enhanced Investment Dropdown Styling */
.investment-dropdown {
  position: relative;
  width: 100%;
  z-index: 100;
}

.investment-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.investment-selected:hover {
  border-color: #a0aec0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.investment-selected-text {
  display: flex;
  align-items: center;
  gap: 10px;
}

.investment-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.investment-option {
  padding: 14px 16px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.investment-option:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.investment-option:hover {
  background-color: #e1f1ff;
}

.investment-option.selected {
  background-color: #c9e4fb;
}

.investment-option-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
