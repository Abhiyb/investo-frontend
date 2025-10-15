<template>
  <div class="investment-card">
    <div class="card-header">
      <div class="card-title-section">
        <h3 class="card-title">{{ investment.name }}</h3>
        <div class="card-subtitle">{{ formatType(investment.type) }}</div>
      </div>
      <div class="header-badges">
        <StatusBadge
          v-if="showRiskBadge"
          type="risk"
          :value="investment.riskLevel"
          suffix="Risk"
          class="risk-badge"
        />
        <!-- Only show non-edit/toggle actions in header -->
        <ActionButtons
          v-if="
            showActions &&
            (showDelete || showPrimary || showInactive) &&
            !showEdit &&
            !showToggle
          "
          :show-edit="false"
          :show-toggle="false"
          :is-active="investment.active"
          :show-delete="showDelete"
          :show-primary="showPrimary"
          :show-inactive="showInactive"
          :primary-text="primaryActionText"
          @delete="$emit('delete', investment)"
          @primary="$emit('primary-action', investment)"
        />
      </div>
    </div>

    <div class="card-content">
      <div class="metrics-grid">
        <div class="metric-item highlight-metric">
          <div class="metric-label">Expected Return</div>
          <div class="metric-value primary">
            {{ formatPercentage(investment.expectedAnnualReturnRate) }}
          </div>
        </div>

        <div class="metric-item">
          <div class="metric-label">Current NAV</div>
          <div class="metric-value">
            {{ formatCurrency(investment.currentNetAssetValuePerUnit) }}
          </div>
        </div>
      </div>

      <div class="metrics-grid-bottom">
        <div class="metric-item full-width">
          <div class="metric-label">Min. Investment</div>
          <div class="metric-value">
            {{ formatCurrency(investment.minimumInvestment) }}
          </div>
        </div>

        <div v-if="showRiskLevel" class="metric-item full-width">
          <div class="metric-label">Risk Level</div>
          <div class="metric-value">
            {{ formatRiskLevel(investment.riskLevel) }}
          </div>
        </div>
      </div>

      <div
        v-if="investment.description && showDescription"
        class="investment-description"
      >
        {{ investment.description }}
      </div>
    </div>

    <!-- Centered Edit/Toggle Actions Below Content -->
    <div
      v-if="showActions && (showEdit || showToggle)"
      class="card-actions-center"
    >
      <ActionButtons
        :show-edit="showEdit"
        :show-toggle="showToggle"
        :is-active="investment.active"
        :show-delete="false"
        :show-primary="false"
        :show-inactive="false"
        @edit="$emit('edit', investment)"
        @toggle="handleToggle"
      />
    </div>

    <div v-if="showFooterAction" class="card-footer">
      <button
        class="footer-action-btn"
        @click="$emit('footer-action', investment)"
      >
        <span class="btn-text">{{ footerActionText }}</span>
        <svg
          class="btn-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
  
<script>
import StatusBadge from "../common/StatusBadge.vue";
import ActionButtons from "../common/ActionButtons.vue";
import investmentService from "../../services/investmentService";

import {
  formatType,
  formatRiskLevel,
  formatCurrency,
  formatPercentage,
} from "../../utils/formatters";

export default {
  name: "InvestmentCard",
  components: {
    StatusBadge,
    ActionButtons,
  },

  props: {
    investment: {
      type: Object,
      required: true,
    },
    showRiskBadge: {
      type: Boolean,
      default: true,
    },
    showRiskLevel: {
      type: Boolean,
      default: false,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    showToggle: {
      type: Boolean,
      default: true, // Enable toggle by default
    },
    showPrimary: {
      type: Boolean,
      default: false,
    },
    showInactive: {
      type: Boolean,
      default: false,
    },
    primaryActionText: {
      type: String,
      default: "Action",
    },
    showFooterAction: {
      type: Boolean,
      default: false,
    },
    footerActionText: {
      type: String,
      default: "Invest Now",
    },
  },
  emits: ["edit", "delete", "primary-action", "footer-action", "toggle-active"],
  methods: {
    handleToggle(isActive) {
      console.log("InvestmentCard - Toggle triggered:", {
        investmentId: this.investment.id,
        investmentName: this.investment.name,
        newStatus: isActive,
      });
      try {
        // Call the toggleInvestmentStatus API with investment id and new active status
        const updatedInvestment = investmentService.toggleInvestmentStatus(
          this.investment.id,
          !this.investment.active
        );

        // Emit an event to notify the parent about the status change (optional)
        this.$emit(
          "update-status",
          updatedInvestment.data || updatedInvestment
        );

        // Optionally update the local investment object to reflect the change
        this.investment.active = updatedInvestment.data
          ? updatedInvestment.data.active
          : updatedInvestment.active;
      } catch (error) {
        console.error("Failed to toggle investment status:", error);
        // Optionally show an error notification here
      }
    },
  },
  setup() {
    return {
      formatType,
      formatRiskLevel,
      formatCurrency,
      formatPercentage,
    };
  },
};
</script>
  
<style scoped>
.investment-card {
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.investment-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e398a 0%, #1d4ed8 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.investment-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.investment-card:hover::before {
  opacity: 1;
}

.card-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.card-title-section {
  flex: 1;
  min-width: 0;
}

.card-title {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  word-wrap: break-word;
}

.card-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  flex-shrink: 0;
}

.risk-badge {
  border-radius: 8px;
  font-weight: 600;
}

.card-content {
  flex-grow: 1;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.metrics-grid-bottom {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.metric-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease;
  border: 1px solid #f1f5f9;
  text-align: left;
}

.metric-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.highlight-metric {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.highlight-metric:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.full-width {
  grid-column: 1 / -1;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  text-align: left;
}

.metric-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1f3a8a;
  line-height: 1.2;
  text-align: left;
}

.metric-value.primary {
  color: #1f3a8a;
  font-size: 1.125rem;
}

.investment-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #e2e8f0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}

/* New centered actions section */
.card-actions-center {
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafbfc;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}

.footer-action-btn {
  width: 100%;
  height: 48px;
  padding: 0 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e398a 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px 0 rgba(30, 57, 138, 0.25),
    0 2px 4px 0 rgba(30, 57, 138, 0.12);
  position: relative;
  overflow: hidden;
}

.footer-action-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-action-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.footer-action-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 8px 25px 0 rgba(37, 99, 235, 0.35),
    0 4px 12px 0 rgba(37, 99, 235, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transform: translateY(-2px) scale(1.02);
}

.footer-action-btn:hover::before {
  left: 100%;
}

.footer-action-btn:hover::after {
  opacity: 1;
}

.footer-action-btn:active {
  transform: translateY(-1px) scale(1.01);
  transition-duration: 0.1s;
  box-shadow: 0 4px 14px 0 rgba(30, 57, 138, 0.4),
    0 2px 6px 0 rgba(30, 57, 138, 0.25);
}

.footer-action-btn:focus-visible {
  outline: none;
  box-shadow: 0 8px 25px 0 rgba(37, 99, 235, 0.35),
    0 4px 12px 0 rgba(37, 99, 235, 0.2), 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn-text {
  flex: 1;
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.footer-action-btn:hover .btn-text {
  transform: translateX(-1px);
}

.footer-action-btn:hover .btn-icon {
  transform: translateX(4px) scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem 1.25rem 1rem 1.25rem;
  }

  .header-badges {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }

  .card-content {
    padding: 1rem 1.25rem;
  }

  .card-actions-center {
    padding: 1rem 1.25rem;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .card-footer {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .footer-action-btn {
    height: 44px;
    font-size: 0.875rem;
  }

  .footer-action-btn:hover {
    transform: translateY(-1px) scale(1.01);
  }
}

@media (max-width: 480px) {
  .investment-card {
    border-radius: 12px;
  }

  .card-header {
    padding: 1rem 1rem 0.75rem 1rem;
  }

  .card-content {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .card-actions-center {
    padding: 0.75rem 1rem;
  }

  .card-footer {
    padding: 1rem;
  }

  .metric-item {
    padding: 0.75rem;
  }

  footer-action-btn {
    height: 42px;
    padding: 0 1.25rem;
    font-size: 0.875rem;
  }

  .footer-action-btn:hover {
    transform: translateY(-1px);
  }
}
</style>