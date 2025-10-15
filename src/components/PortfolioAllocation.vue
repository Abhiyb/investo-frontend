<script setup>
import { ref, onMounted } from 'vue';
import { getPortfolioAllocation } from '../api/portfolioApi'; 

const allocations = ref([]);
const chartRef = ref(null);
const tooltipRef = ref(null);

const tooltip = ref({
  visible: false,
  text: '',
  style: {
    top: '0px',
    left: '0px',
    position: 'absolute',
    backgroundColor: '#1a202c',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transform: 'translate(-50%, -120%)',
    zIndex: '10',
  }
});

// Color mapping based on InvestmentType
const getColorForType = (type) => {
  const colorMap = {
    // Low Risk
    'FIXED_DEPOSIT': '#4ade80',
    'GOVERNMENT_BOND': '#22c55e',
    'PUBLIC_PROVIDENT_FUND': '#86efac',

    // Medium Risk
    'MUTUAL_FUND': '#60a5fa',
    'CORPORATE_BOND': '#3b82f6',
    'REAL_ESTATE_INVESTMENT_TRUST': '#818cf8',

    // High Risk
    'STOCK': '#fbbf24',
    'CRYPTOCURRENCY': '#f97316',
    'OPTIONS': '#ef4444',
  };
  return colorMap[type] || '#94a3b8';
};

onMounted(async () => {
  try {
    const response = await getPortfolioAllocation();
    allocations.value = response.data.map((item) => ({
      type: item.assetType,
      percentage: item.percentage,
      color: getColorForType(item.assetType),
    }));
    renderDonutChart();
  } catch (error) {
    console.error('Failed to fetch allocation data', error);
  }
});

const renderDonutChart = () => {
  const chartEl = chartRef.value;
  if (!chartEl) return;

  chartEl.innerHTML = ''; // Clear previous content

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '180');
  svg.setAttribute('height', '180');
  svg.setAttribute('viewBox', '0 0 180 180');

  const centerX = 90;
  const centerY = 90;
  const radius = 70;
  const innerRadius = 45;
  const total = allocations.value.reduce((sum, a) => sum + a.percentage, 0);

  if (allocations.value.length === 1) {
    // Full circle for single allocation
    const allocation = allocations.value[0];

    // Outer full circle
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', allocation.color);

    // Inner circle (hole)
    const innerCircle = document.createElementNS(svgNS, 'circle');
    innerCircle.setAttribute('cx', centerX);
    innerCircle.setAttribute('cy', centerY);
    innerCircle.setAttribute('r', innerRadius);
    innerCircle.setAttribute('fill', '#ffffff'); // background color

    // Tooltip Events
    circle.addEventListener('mouseenter', (e) => {
      circle.style.filter = 'brightness(1.1)';
      tooltip.value.text = allocation.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      tooltip.value.visible = true;

      const rect = chartRef.value?.getBoundingClientRect();
      if (rect) {
        tooltip.value.style.top = `${e.clientY - rect.top}px`;
        tooltip.value.style.left = `${e.clientX - rect.left}px`;
      }
    });

    circle.addEventListener('mousemove', (e) => {
      const rect = chartRef.value?.getBoundingClientRect();
      if (rect) {
        tooltip.value.style.top = `${e.clientY - rect.top}px`;
        tooltip.value.style.left = `${e.clientX - rect.left}px`;
      }
    });

    circle.addEventListener('mouseleave', () => {
      circle.style.filter = 'none';
      tooltip.value.visible = false;
    });

    svg.appendChild(circle);
    svg.appendChild(innerCircle);

  } else {
    // Multiple allocations - draw slices
    let startAngle = 0;
    allocations.value.forEach((allocation) => {
      const angle = (allocation.percentage / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;

      // Outer arc points
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      // Inner arc points
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);

      const largeArc = angle > Math.PI ? 1 : 0;

      const path = document.createElementNS(svgNS, 'path');
      const d = [
        `M ${x4} ${y4}`,                    
        `L ${x1} ${y1}`,                    
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`, 
        `L ${x3} ${y3}`,                    
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`, 
        'Z'
      ].join(' ');

      path.setAttribute('d', d);
      path.setAttribute('fill', allocation.color);
      path.setAttribute('stroke', '#ffffff');
      path.setAttribute('stroke-width', '1');

      // Tooltip Events
      path.addEventListener('mouseenter', (e) => {
        path.setAttribute('stroke-width', '2');
        path.style.filter = 'brightness(1.1)';
        tooltip.value.text = allocation.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        tooltip.value.visible = true;

        const rect = chartRef.value?.getBoundingClientRect();
        if (rect) {
          tooltip.value.style.top = `${e.clientY - rect.top}px`;
          tooltip.value.style.left = `${e.clientX - rect.left}px`;
        }
      });

      path.addEventListener('mousemove', (e) => {
        const rect = chartRef.value?.getBoundingClientRect();
        if (rect) {
          tooltip.value.style.top = `${e.clientY - rect.top}px`;
          tooltip.value.style.left = `${e.clientX - rect.left}px`;
        }
      });

      path.addEventListener('mouseleave', () => {
        path.setAttribute('stroke-width', '1');
        path.style.filter = 'none';
        tooltip.value.visible = false;
      });

      svg.appendChild(path);
      startAngle = endAngle;
    });
  }

  chartEl.appendChild(svg);
};
</script>

<template>
  <div class="portfolio-allocation">
    <div class="allocation-header">
      
      <div>
        <h2>Asset Allocation</h2>
        <p class="subtitle">Distribution of your investments</p>
      </div>
    </div>

    <div class="allocation-content">
      <div class="chart-container">
        <div ref="chartRef" class="donut-chart"></div>
        <div ref="tooltipRef" class="chart-tooltip" v-show="tooltip.visible" :style="tooltip.style">
          {{ tooltip.text }}
        </div>
      </div>

      <div class="allocation-legend" v-if="allocations.length">
        <div 
          v-for="(asset, index) in allocations" 
          :key="index" 
          class="legend-item"
        >
          <div class="legend-color" :style="{ backgroundColor: asset.color }"></div>
          <div class="legend-text">
            <div class="legend-type">{{ asset.type }}</div>
            <div class="legend-percentage">{{ asset.percentage }}%</div>
          </div>
        </div>
      </div>
      <div v-else>Loading allocation...</div>
    </div>
  </div>
</template>

<style scoped>
.portfolio-allocation {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.portfolio-allocation:hover {
  
  transform: translateY(-2px);
}

.allocation-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.icon {
  font-size: 24px;
  margin-right: 16px;
}

h2 {
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a202c;
}

.subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.allocation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-container {
  position: relative;
  margin-bottom: 24px;
}

.donut-chart {
  width: 180px;
  height: 180px;
}

.chart-tooltip {
  position: absolute;
  background-color: #1a202c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  pointer-events: none;
  white-space: nowrap;
  transform: translate(-50%, -120%);
  z-index: 10;
}

.allocation-legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background-color: #f8fafc;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 12px;
}

.legend-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.legend-type {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a202c;
}

.legend-percentage {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
}

@media (min-width: 768px) {
  .allocation-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .chart-container {
    margin-bottom: 0;
    margin-right: 24px;
  }

  .allocation-legend {
    flex: 1;
  }
}
</style>