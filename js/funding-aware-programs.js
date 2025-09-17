/**
 * Funding-Aware Program Display System
 * Dynamically shows/hides tuition and funding information based on program type
 */

// Program funding types and their display rules
const FUNDING_TYPES = {
  WIOA: {
    name: 'WIOA Funded',
    description: 'Federally funded for qualifying adults - covers 100% tuition',
    showTuition: false,
    badge: '🏛️ Federally Funded',
    badgeColor: '#10b981',
    note: '<strong>No Cost:</strong> Fully funded for eligible participants through WIOA'
  },
  WRG: {
    name: 'Workforce Ready Grant',
    description: 'Indiana-funded programs for high-demand careers',
    showTuition: false,
    badge: '🎯 State Funded',
    badgeColor: '#3b82f6',
    note: '<strong>No Cost:</strong> Covered by Indiana Workforce Ready Grant'
  },
  APPRENTICESHIP: {
    name: 'Registered Apprenticeship',
    description: 'Earn-while-you-learn with union partnerships',
    showTuition: false,
    badge: '🔧 Apprenticeship',
    badgeColor: '#f59e0b',
    note: '<strong>Earn While Learning:</strong> No tuition - get paid during training'
  },
  SELF_PAY: {
    name: 'Self-Pay Option',
    description: 'Flexible payment plans available',
    showTuition: true,
    badge: '💳 Self-Pay',
    badgeColor: '#6b7280',
    note: '<strong>Tuition Required:</strong> Financing and payment plans available'
  },
  SCHOLARSHIP: {
    name: 'Scholarship Available',
    description: 'Merit-based and need-based scholarships',
    showTuition: true,
    badge: '🎓 Scholarship',
    badgeColor: '#8b5cf6',
    note: '<strong>Scholarships Available:</strong> Apply for financial assistance'
  }
};

// Program database with funding information
const PROGRAMS = [
  {
    id: 'ai-data-science',
    title: 'AI & Data Science Bootcamp',
    description: 'Python, machine learning, and data analytics training with Google Cloud and Microsoft partnerships.',
    duration: '16 weeks',
    schedule: 'Full-time or Part-time',
    funding: ['WIOA', 'WRG', 'SELF_PAY'],
    tuition: 4999,
    outcomes: {
      placementRate: '89%',
      avgSalary: '$75,000',
      timeToEmployment: '3 months'
    },
    features: [
      'Python Programming',
      'Machine Learning',
      'Data Visualization',
      'Cloud Computing (AWS/Azure)',
      'Portfolio Projects',
      'Job Placement Support'
    ],
    employers: ['Amazon', 'Microsoft', 'Salesforce', 'IU Health']
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Specialist',
    description: 'CompTIA Security+ certification pathway with ethical hacking and security analysis training.',
    duration: '12 weeks',
    schedule: 'Evening classes available',
    funding: ['WIOA', 'WRG', 'SELF_PAY'],
    tuition: 3999,
    outcomes: {
      placementRate: '92%',
      avgSalary: '$65,000',
      timeToEmployment: '2 months'
    },
    features: [
      'CompTIA Security+ Prep',
      'Ethical Hacking',
      'Network Security',
      'Incident Response',
      'Security Analysis',
      'Industry Certifications'
    ],
    employers: ['AT&T', 'Anthem', 'Cummins', 'Indiana University']
  },
  {
    id: 'electrical-apprenticeship',
    title: 'IBEW Electrical Apprenticeship',
    description: 'Registered apprenticeship with IBEW Local 481. Earn while you learn with union benefits.',
    duration: '4 years',
    schedule: 'Full-time with classroom instruction',
    funding: ['APPRENTICESHIP'],
    tuition: 0,
    outcomes: {
      placementRate: '98%',
      avgSalary: '$70,000',
      timeToEmployment: 'Immediate'
    },
    features: [
      'Union Partnership',
      'Paid Training',
      'Health Benefits',
      'Retirement Plan',
      'Journeyman Certification',
      'Career Advancement'
    ],
    employers: ['IBEW Local 481', 'Duke Energy', 'Schneider Electric']
  },
  {
    id: 'healthcare-assistant',
    title: 'Healthcare Assistant Certification',
    description: 'CNA and medical assistant training with clinical rotations at partner healthcare facilities.',
    duration: '8 weeks',
    schedule: 'Day and evening options',
    funding: ['WIOA', 'WRG', 'SCHOLARSHIP', 'SELF_PAY'],
    tuition: 2499,
    outcomes: {
      placementRate: '94%',
      avgSalary: '$35,000',
      timeToEmployment: '1 month'
    },
    features: [
      'CNA Certification',
      'Medical Assistant Training',
      'Clinical Rotations',
      'CPR/First Aid',
      'Electronic Health Records',
      'Job Placement Assistance'
    ],
    employers: ['IU Health', 'Community Health', 'Franciscan Health']
  },
  {
    id: 'advanced-manufacturing',
    title: 'Advanced Manufacturing Technology',
    description: 'CNC machining, robotics, and automation training for modern manufacturing careers.',
    duration: '14 weeks',
    schedule: 'Full-time program',
    funding: ['WIOA', 'WRG', 'APPRENTICESHIP', 'SELF_PAY'],
    tuition: 3499,
    outcomes: {
      placementRate: '91%',
      avgSalary: '$55,000',
      timeToEmployment: '2 months'
    },
    features: [
      'CNC Programming',
      'Robotics Operation',
      'Quality Control',
      'Safety Protocols',
      'Industry 4.0 Concepts',
      'Hands-on Training'
    ],
    employers: ['Cummins', 'Caterpillar', 'Rolls-Royce', 'Allison Transmission']
  }
];

class FundingAwareProgramDisplay {
  constructor() {
    this.programs = PROGRAMS;
    this.fundingTypes = FUNDING_TYPES;
    this.init();
  }

  init() {
    this.createProgramCards();
    this.setupFundingFilters();
    this.setupAccessibilityFeatures();
  }

  createProgramCards() {
    const container = document.getElementById('programs-container');
    if (!container) return;

    container.innerHTML = this.programs.map(program => this.createProgramCard(program)).join('');
  }

  createProgramCard(program) {
    const fundingOptions = program.funding.map(type => this.fundingTypes[type]);
    const primaryFunding = fundingOptions[0];
    
    return `
      <div class="program-card" data-funding="${program.funding.join(',')}" data-program-id="${program.id}">
        <div class="program-header">
          <h3 class="program-title">${program.title}</h3>
          <div class="funding-badges">
            ${program.funding.map(type => 
              `<span class="funding-badge" style="background-color: ${this.fundingTypes[type].badgeColor}">
                ${this.fundingTypes[type].badge}
              </span>`
            ).join('')}
          </div>
        </div>
        
        <div class="program-content">
          <p class="program-description">${program.description}</p>
          
          <div class="program-details">
            <div class="detail-item">
              <strong>Duration:</strong> ${program.duration}
            </div>
            <div class="detail-item">
              <strong>Schedule:</strong> ${program.schedule}
            </div>
            <div class="detail-item">
              <strong>Job Placement:</strong> ${program.outcomes.placementRate}
            </div>
            <div class="detail-item">
              <strong>Average Salary:</strong> ${program.outcomes.avgSalary}
            </div>
          </div>

          ${this.createTuitionSection(program, primaryFunding)}
          
          <div class="funding-note">
            ${primaryFunding.note}
          </div>

          <div class="program-features">
            <h4>What You'll Learn:</h4>
            <ul>
              ${program.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>

          <div class="employer-partners">
            <h4>Hiring Partners:</h4>
            <div class="employer-list">
              ${program.employers.map(employer => `<span class="employer-tag">${employer}</span>`).join('')}
            </div>
          </div>

          <div class="program-actions">
            <button class="btn btn-primary" onclick="applyForProgram('${program.id}')">
              Apply Now
            </button>
            <button class="btn btn-secondary" onclick="learnMore('${program.id}')">
              Learn More
            </button>
            <button class="btn btn-info" onclick="checkEligibility('${program.id}')">
              Check Funding Eligibility
            </button>
          </div>
        </div>
      </div>
    `;
  }

  createTuitionSection(program, primaryFunding) {
    if (!primaryFunding.showTuition || program.tuition === 0) {
      return `
        <div class="tuition-section no-cost">
          <div class="cost-display">
            <span class="cost-label">Program Cost:</span>
            <span class="cost-amount no-cost-text">No Cost to You</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="tuition-section has-cost">
        <div class="cost-display">
          <span class="cost-label">Tuition:</span>
          <span class="cost-amount">$${program.tuition.toLocaleString()}</span>
        </div>
        <div class="payment-options">
          <small>💳 Payment plans available • 🎓 Scholarships may apply</small>
        </div>
      </div>
    `;
  }

  setupFundingFilters() {
    const filterContainer = document.getElementById('funding-filters');
    if (!filterContainer) return;

    const filters = Object.entries(this.fundingTypes).map(([key, type]) => 
      `<button class="filter-btn" data-funding="${key}" onclick="filterByFunding('${key}')">
        ${type.badge}
      </button>`
    ).join('');

    filterContainer.innerHTML = `
      <div class="filter-section">
        <h3>Filter by Funding Type:</h3>
        <div class="filter-buttons">
          <button class="filter-btn active" onclick="showAllPrograms()">All Programs</button>
          ${filters}
        </div>
      </div>
    `;
  }

  setupAccessibilityFeatures() {
    // Add ARIA labels and keyboard navigation
    document.querySelectorAll('.program-card').forEach((card, index) => {
      card.setAttribute('role', 'article');
      card.setAttribute('aria-labelledby', `program-title-${index}`);
      card.querySelector('.program-title').id = `program-title-${index}`;
    });

    // Add focus management for filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', 'false');
    });
  }
}

// Global functions for program interactions
window.filterByFunding = function(fundingType) {
  const cards = document.querySelectorAll('.program-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  // Update button states
  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  
  const activeBtn = document.querySelector(`[data-funding="${fundingType}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }
  
  // Filter cards
  cards.forEach(card => {
    const cardFunding = card.dataset.funding.split(',');
    if (cardFunding.includes(fundingType)) {
      card.style.display = 'block';
      card.setAttribute('aria-hidden', 'false');
    } else {
      card.style.display = 'none';
      card.setAttribute('aria-hidden', 'true');
    }
  });
};

window.showAllPrograms = function() {
  const cards = document.querySelectorAll('.program-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  
  document.querySelector('.filter-btn').classList.add('active');
  
  cards.forEach(card => {
    card.style.display = 'block';
    card.setAttribute('aria-hidden', 'false');
  });
};

window.applyForProgram = function(programId) {
  // Redirect to application with program pre-selected
  window.location.href = `/apply?program=${programId}`;
};

window.learnMore = function(programId) {
  // Show detailed program information
  window.location.href = `/programs/${programId}`;
};

window.checkEligibility = function(programId) {
  // Open funding eligibility checker
  window.location.href = `/funding-eligibility?program=${programId}`;
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new FundingAwareProgramDisplay();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FundingAwareProgramDisplay, PROGRAMS, FUNDING_TYPES };
}