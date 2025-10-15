<template>
  <div class="app-container">
    <!-- Import Navbar component -->
    <AppNavbar />

    <div class="content-wrapper">
      <!-- Import Sidebar component -->
      <AppSidebar />
      <div class="main-content">
        <!-- Header Section - Different for admin and user -->
        <div class="support-header">
          <h1>{{ isAdmin ? "Support Ticket Management" : "Support" }}</h1>
          <p class="support-subtitle">
            {{
              isAdmin
                ? "Manage and respond to user support tickets."
                : "Need help with your investments? Our support team is here to assist you."
            }}
          </p>
        </div>

        <!-- Ticket List View -->
        <TicketList
          v-if="currentView === 'list'"
          :filters="filters"
          :is-filtered="isFiltered"
          :is-admin="isAdmin"
          @view-ticket="viewTicketDetails"
          @new-ticket="showNewTicketForm"
          @update:filters="filters = $event"
          @apply-filters="applyFilters"
          @clear-filters="clearFilters"
        />

        <!-- Ticket Details View -->
        <TicketDetails
          v-if="currentView === 'details'"
          :ticket="currentTicket"
          :new-reply="newReply"
          :loading="ticketDetailsLoading"
          :error="ticketDetailsError"
          :selected-status="selectedStatus"
          :is-admin="isAdmin"
          @update:new-reply="newReply = $event"
          @update:selected-status="selectedStatus = $event"
          @back="currentView = 'list'"
          @send-reply="sendReply"
          @retry="viewTicketDetails"
        />

        <!-- New Ticket Form View - Only for regular users -->
        <NewTicketForm
          v-if="currentView === 'new'"
          :investments="investments"
          :new-ticket="newTicket"
          @update:new-ticket="newTicket = $event"
          @back="currentView = 'list'"
          @submit="submitNewTicket"
          @ticket-created="handleTicketCreated"
        />

        <!-- Enhanced Toast Notification -->
        <transition name="toast">
          <div v-if="showToast" class="toast-notification" :class="toastType">
            <div class="toast-content">
              <div class="toast-icon">
                <svg
                  v-if="toastType === 'success'"
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <svg
                  v-else-if="toastType === 'error'"
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
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <svg
                  v-else
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
              </div>
              <div class="toast-message">
                <h4>{{ toastTitle }}</h4>
                <p>{{ toastMessage }}</p>
              </div>
              <button class="toast-close" @click="closeToast">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div class="toast-progress-bar">
                <div
                  class="toast-progress"
                  :style="{ width: toastProgress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted, watch, onMounted } from "vue";
import axios from "axios";
import TicketList from "./TicketList.vue";
import TicketDetails from "./TicketDetails.vue";
import NewTicketForm from "./NewTicketForm.vue";
import AppNavbar from "./Navbar.vue";
import AppSidebar from "./Sidebar.vue";
export default {
  name: "SupportTicketSystem",
  components: {
    AppNavbar,
    AppSidebar,
    TicketList,
    TicketDetails,
    NewTicketForm,
  },
  setup() {
    // Check if user is admin
    const isAdmin = ref(false);

    onMounted(() => {
      // Check if user is admin by parsing JWT
      const token = localStorage.getItem("token");
      console.log("JWT token found:", !!token);

      if (token) {
        try {
          // Extract payload from JWT
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));

          console.log("JWT payload:", payload);
          console.log("Roles in JWT:", payload.roles);

          // Assuming your JWT contains role information
          isAdmin.value =
            Array.isArray(payload.roles) &&
            payload.roles.includes("ROLE_ADMIN");

          console.log("User is admin:", isAdmin.value);
        } catch (error) {
          console.error("Error parsing JWT:", error);
          isAdmin.value = false;
        }
      }
    });

    // View state management
    const currentView = ref("list"); // 'list', 'details', 'new'
    const currentTicketId = ref(null);
    const newReply = ref("");
    const selectedStatus = ref("");

    // Toast notification state
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastTitle = ref("Success!");
    const toastType = ref("success"); // 'success', 'error', 'info'
    const toastTimeout = ref(null);
    const toastProgress = ref(100);
    const toastInterval = ref(null);

    // Filter state
    const filters = ref({
      status: "",
      priority: "",
    });

    // Sample data for investments
    const investments = ref([]);

    // Current ticket data
    const currentTicket = ref({});
    const ticketDetailsLoading = ref(false);
    const ticketDetailsError = ref("");

    // Computed property to check if filters are applied
    const isFiltered = computed(() => {
      return filters.value.status !== "" || filters.value.priority !== "";
    });

    // Reset selected status when ticket changes
    watch(currentTicket, () => {
      selectedStatus.value = "";
    });

    // Function to show toast notification
    function showToastNotification(
      message,
      title = "Success!",
      type = "success",
      duration = 5000
    ) {
      // Clear any existing toast
      if (toastTimeout.value) {
        clearTimeout(toastTimeout.value);
      }
      if (toastInterval.value) {
        clearInterval(toastInterval.value);
      }

      // Set toast properties
      toastMessage.value = message;
      toastTitle.value = title;
      toastType.value = type;
      toastProgress.value = 100;
      showToast.value = true;

      // Set up progress bar
      const updateInterval = 30; // Update every 30ms
      const decrementAmount = (updateInterval / duration) * 100;

      toastInterval.value = setInterval(() => {
        toastProgress.value -= decrementAmount;
        if (toastProgress.value <= 0) {
          clearInterval(toastInterval.value);
        }
      }, updateInterval);

      // Auto-hide toast after duration
      toastTimeout.value = setTimeout(() => {
        closeToast();
      }, duration);
    }

    // Function to close toast notification
    function closeToast() {
      showToast.value = false;
      if (toastInterval.value) {
        clearInterval(toastInterval.value);
      }
    }

    // Function to apply filters
    function applyFilters() {
      console.log("Filters applied:", filters.value);
    }

    // Function to clear all filters
    function clearFilters() {
      filters.value = {
        status: "",
        priority: "",
      };
    }

    // Function to view ticket details
    async function viewTicketDetails(id) {
      ticketDetailsLoading.value = true;
      ticketDetailsError.value = "";
      currentTicketId.value = id;

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080" + `/support/ticket/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        currentTicket.value = response.data;
        currentView.value = "details";
      } catch (error) {
        console.error("Failed to fetch ticket details:", error);
        ticketDetailsError.value =
          "Failed to load ticket details. Please try again.";

        // If we're not already on the details view, go back to list
        if (currentView.value !== "details") {
          currentView.value = "list";
        }
      } finally {
        ticketDetailsLoading.value = false;
      }
    }

    // Function to show new ticket form - only for regular users
    async function showNewTicketForm() {
      // Check if user is admin - if so, don't allow creating tickets
      if (isAdmin.value) {
        console.log("Admins cannot create tickets");
        return;
      }

      try {
        // Fetch investments for the dropdown
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080" + "/investments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Extract the investments array from the response data
        investments.value = response.data.data || [];
      } catch (error) {
        console.error("Failed to fetch investments:", error);
        investments.value = [];
      }

      // Reset form
      newTicket.value = {
        subject: "",
        description: "",
        priority: "MEDIUM",
        investmentProductName: "",
      };

      currentView.value = "new";
    }

    // New ticket form data
    const newTicket = ref({
      subject: "",
      description: "",
      priority: "LOW",
      investmentProductName: "",
    });

    // Function to handle ticket creation
    function handleTicketCreated(ticket) {
      showToastNotification(
        `Your ticket "${ticket.subject}" has been submitted successfully!`,
        "Ticket Created!",
        "success"
      );
      currentView.value = "list";
    }

    // Function to send a reply to a ticket
    async function sendReply() {
      if (!newReply.value.trim()) return;

      try {
        const token = localStorage.getItem("token");

        // Create request body according to the provided data structure
        const requestBody = {
          ticketId: currentTicketId.value,
          responseMessage: newReply.value,
        };

        // Only include status if admin is changing it
        if (isAdmin.value && selectedStatus.value) {
          requestBody.status = selectedStatus.value;
        }

        console.log("Sending reply with data:", requestBody);

        // Send POST request to the reply endpoint
        await axios.put(
          "http://localhost:8080" + "/support/reply/",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Refresh ticket details to show the new reply
        await viewTicketDetails(currentTicketId.value);

        // Clear the reply field and selected status
        newReply.value = "";
        selectedStatus.value = "";

        // Show toast notification
        showToastNotification(
          "Your response has been sent successfully!",
          "Message Sent!",
          "success"
        );
      } catch (error) {
        console.error("Failed to send reply:", error);
        showToastNotification(
          "Failed to send your response. Please try again.",
          "Error!",
          "error"
        );
      }
    }

    // Function to submit a new ticket
    async function submitNewTicket() {
      if (!newTicket.value.subject || !newTicket.value.description) {
        showToastNotification(
          "Please fill in all required fields.",
          "Missing Information",
          "error"
        );
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8080" + "/support/ticket",
          newTicket.value,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        handleTicketCreated(response.data);
      } catch (error) {
        console.error("Failed to create ticket:", error);
        showToastNotification(
          "Failed to create ticket. Please try again.",
          "Error!",
          "error"
        );
      }
    }

    // Clean up timeouts when component is unmounted
    onUnmounted(() => {
      if (toastTimeout.value) {
        clearTimeout(toastTimeout.value);
      }
      if (toastInterval.value) {
        clearInterval(toastInterval.value);
      }
    });

    return {
      isAdmin,
      currentView,
      currentTicketId,
      newReply,
      selectedStatus,
      filters,
      investments,
      currentTicket,
      ticketDetailsLoading,
      ticketDetailsError,
      isFiltered,
      newTicket,
      showToast,
      toastMessage,
      toastTitle,
      toastType,
      toastProgress,
      viewTicketDetails,
      showNewTicketForm,
      handleTicketCreated,
      submitNewTicket,
      sendReply,
      applyFilters,
      clearFilters,
      closeToast,
    };
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
.support-container {
  max-width: 1000px;
  margin: 0 auto;
  color: #333;
  position: relative;
}

.support-header {
  margin-bottom: 24px;
}

h1 {
  font-size: 28px;
  color: #1a202c;
  margin: 0;
  font-weight: 600;
}

.support-subtitle {
  color: #718096;
  margin-top: 5px;
  font-size: 16px;
}

/* Enhanced Toast Notification Styles */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  width: calc(100% - 40px);
}

.toast-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.toast-notification.success .toast-content {
  border-left: 4px solid #10b981;
}

.toast-notification.error .toast-content {
  border-left: 4px solid #ef4444;
}

.toast-notification.info .toast-content {
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success .toast-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.error .toast-icon {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.info .toast-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.toast-message {
  flex: 1;
}

.toast-message h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #1a202c;
  font-weight: 600;
}

.toast-message p {
  margin: 0;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.4;
}

.toast-close {
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 4px;
  margin: -4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #718096;
  background-color: #f7fafc;
}

/* Toast Progress Bar */
.toast-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #e2e8f0;
}

.success .toast-progress {
  background-color: #10b981;
}

.error .toast-progress {
  background-color: #ef4444;
}

.info .toast-progress {
  background-color: #3b82f6;
}

.toast-progress {
  height: 100%;
  width: 100%;
  transition: width 0.1s linear;
}

/* Toast Animation */
.toast-enter-active {
  animation: slide-in 0.3s ease-out forwards;
}

.toast-leave-active {
  animation: slide-out 0.3s ease-in forwards;
}

@keyframes slide-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .toast-notification {
    top: 10px;
    right: 10px;
    width: calc(100% - 20px);
  }
}
</style>
