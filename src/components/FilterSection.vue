<template>
  <div class="filter-section">
    <div class="filter-controls">
      <!-- Status Filter -->
      <div class="filter-group">
        <label>
          <span class="filter-dot"></span>
          Status
        </label>
        <div class="custom-select" :class="{ active: statusDropdownOpen }">
          <div class="select-selected" @click="toggleStatusDropdown">
            {{ filters.status || 'All Statuses' }}
            <span class="select-arrow"></span>
          </div>
          <div class="select-items" v-show="statusDropdownOpen">
            <div class="select-item" :class="{ selected: filters.status === '' }" @click="selectStatus('')">
              <span v-if="filters.status === ''" class="checkmark">✓</span>
              All Statuses
            </div>
            <div class="select-item" v-for="status in statusOptions" :key="status" :class="{ selected: filters.status === status }" @click="selectStatus(status)">
              <span v-if="filters.status === status" class="checkmark">✓</span>
              {{ status.charAt(0) + status.slice(1).toLowerCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Priority Filter -->
      <div class="filter-group">
        <label>
          <span class="filter-dot"></span>
          Priority
        </label>
        <div class="custom-select" :class="{ active: priorityDropdownOpen }">
          <div class="select-selected" @click="togglePriorityDropdown">
            {{ filters.priority || 'All Priorities' }}
            <span class="select-arrow"></span>
          </div>
          <div class="select-items" v-show="priorityDropdownOpen">
            <div class="select-item" :class="{ selected: filters.priority === '' }" @click="selectPriority('')">
              <span v-if="filters.priority === ''" class="checkmark">✓</span>
              All Priorities
            </div>
            <div class="select-item" v-for="priority in priorityOptions" :key="priority" :class="{ selected: filters.priority === priority }" @click="selectPriority(priority)">
              <span v-if="filters.priority === priority" class="checkmark">✓</span>
              {{ priority.charAt(0) + priority.slice(1).toLowerCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Apply Button -->
      <button class="apply-filter-btn" @click="$emit('apply-filters')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Apply Filters
      </button>
    </div>

    <!-- Active Filters -->
    <div v-if="isFiltered" class="active-filters">
      <div class="filter-tag">
        <span>Filtered by:</span>
        <span v-if="filters.status" class="filter-value">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -2px;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Status: {{ filters.status }}
        </span>
        <span v-if="filters.priority" class="filter-value">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -2px;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Priority: {{ filters.priority }}
        </span>
        <button class="clear-filters-btn" @click="$emit('clear-filters')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted ,defineEmits,defineProps} from 'vue';
const props = defineProps({
  filters: Object,
  isFiltered: Boolean
});
const emit = defineEmits(['update:filters', 'apply-filters', 'clear-filters']);

const statusOptions = ['OPEN', 'RESPONDED', 'CLOSED'];
const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

const statusDropdownOpen = ref(false);
const priorityDropdownOpen = ref(false);

function toggleStatusDropdown() {
  statusDropdownOpen.value = !statusDropdownOpen.value;
  if (statusDropdownOpen.value) priorityDropdownOpen.value = false;
}

function togglePriorityDropdown() {
  priorityDropdownOpen.value = !priorityDropdownOpen.value;
  if (priorityDropdownOpen.value) statusDropdownOpen.value = false;
}

function selectStatus(status) {
  emit('update:filters', { ...props.filters, status });
  statusDropdownOpen.value = false;
}

function selectPriority(priority) {
  emit('update:filters', { ...props.filters, priority });
  priorityDropdownOpen.value = false;
}

function handleClickOutside(event) {
  const container = document.querySelector('.filter-section');
  if (container && !container.contains(event.target)) {
    statusDropdownOpen.value = false;
    priorityDropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
/* Filter Styles */
.filter-section {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.filter-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.filter-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #3182ce;
  margin-right: 6px;
}

/* Custom Select Styles */
.custom-select {
  position: relative;
  user-select: none;
}

.select-selected {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 16px;
  color: #2d3748;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-select.active .select-selected {
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}

.select-arrow {
  position: relative;
  width: 10px;
  height: 10px;
}

.select-arrow:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #a0aec0;
  border-bottom: 2px solid #a0aec0;
  transform: rotate(45deg);
}

.custom-select.active .select-arrow:after {
  transform: rotate(-135deg);
  top: 5px;
}

.select-items {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: #f7fafc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
}

.select-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 16px;
  color: #2d3748;
  position: relative;
  padding-left: 40px;
}

.select-item:hover {
  background-color: #edf2f7;
}

.select-item.selected {
  background-color: #edf2f7;
  font-weight: 500;
}

.checkmark {
  position: absolute;
  left: 16px;
  color: #3182ce;
  font-weight: bold;
}

.apply-filter-btn {
  background-color: #3182ce;
  color: white;
  padding: 10px 18px;
  font-size: 14px;
  height: 44px;
  border-radius: 6px;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 4px rgba(49, 130, 206, 0.3);
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.apply-filter-btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(49, 130, 206, 0.35);
}

.apply-filter-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(49, 130, 206, 0.3);
}

.apply-filter-btn svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.active-filters {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.filter-tag {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #4a5568;
  font-size: 14px;
}

.filter-value {
  background-color: #edf2f7;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
}

.clear-filters-btn {
  background-color: transparent;
  color: #e53e3e;
  padding: 5px 10px;
  font-size: 13px;
  border: 1px solid #e53e3e;
  margin-left: auto;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.clear-filters-btn:hover {
  background-color: #fff5f5;
  box-shadow: 0 1px 3px rgba(229, 62, 62, 0.2);
}

.clear-filters-btn svg {
  margin-right: 4px;
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .apply-filter-btn {
    width: 100%;
  }
}
</style>