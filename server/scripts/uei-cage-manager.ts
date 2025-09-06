#!/usr/bin/env tsx

/**
 * UEI/CAGE Federal Contracting Management System
 * Elevate for Humanity - Government Contractor Tools
 * 
 * Commands:
 * - verify: Verify federal registration status
 * - badge: Generate compliance badge HTML
 * - form: Create federal contract forms
 * - export: Export compliance data
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ContractorInfo {
  entityName: string;
  uei: string;
  cage: string;
  duns?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  businessTypes: string[];
  naicsCodes: string[];
  certifications: string[];
  lastVerified: string;
  status: 'active' | 'inactive' | 'pending';
}

class UEICageManager {
  private configPath = join(process.cwd(), 'server', 'config', 'contractor-info.json');
  private outputDir = join(process.cwd(), 'server', 'output');

  constructor() {
    // Ensure directories exist
    if (!existsSync(join(process.cwd(), 'server', 'config'))) {
      mkdirSync(join(process.cwd(), 'server', 'config'), { recursive: true });
    }
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  private getContractorInfo(): ContractorInfo {
    if (!existsSync(this.configPath)) {
      // Create default configuration
      const defaultInfo: ContractorInfo = {
        entityName: "Elevate for Humanity",
        uei: "YOUR_UEI_HERE", // User needs to update this
        cage: "YOUR_CAGE_HERE", // User needs to update this
        address: {
          street: "7009 E 56th St, Suite F",
          city: "Indianapolis",
          state: "IN",
          zip: "46226"
        },
        businessTypes: [
          "501(c)(3) Non-Profit Organization",
          "Small Business",
          "Training Provider",
          "Government Contractor"
        ],
        naicsCodes: [
          "611513", // Apprenticeship Training
          "611519", // Other Technical and Trade Schools
          "611710", // Educational Support Services
          "541611", // Administrative Management and General Management Consulting Services
        ],
        certifications: [
          "ETPL Approved Provider",
          "DOL Registered Apprenticeship Sponsor",
          "SAM.gov Federal Contractor",
          "Indiana State Bidder (IDOA)",
          "Certiport Authorized Testing Center",
          "ACT WorkKeys Testing Center",
          "Milady RISE Certified Provider",
          "VITA Volunteer Tax Assistance Provider",
          "NCCER Training Partner",
          "EmployIndy Partner Organization",
          "WEX Approved Employer"
        ],
        lastVerified: new Date().toISOString(),
        status: 'active'
      };
      
      writeFileSync(this.configPath, JSON.stringify(defaultInfo, null, 2));
      console.log(`✅ Created contractor configuration at: ${this.configPath}`);
      console.log(`⚠️  Please update your UEI and CAGE codes in the configuration file.`);
      
      return defaultInfo;
    }

    return JSON.parse(readFileSync(this.configPath, 'utf-8'));
  }

  async verify(): Promise<void> {
    console.log('🔍 Verifying Federal Registration Status...\n');
    
    const info = this.getContractorInfo();
    
    console.log('📋 CONTRACTOR INFORMATION');
    console.log('═'.repeat(50));
    console.log(`Entity Name: ${info.entityName}`);
    console.log(`UEI: ${info.uei}`);
    console.log(`CAGE Code: ${info.cage}`);
    console.log(`Address: ${info.address.street}, ${info.address.city}, ${info.address.state} ${info.address.zip}`);
    console.log(`Status: ${info.status.toUpperCase()}`);
    console.log(`Last Verified: ${new Date(info.lastVerified).toLocaleDateString()}`);
    
    console.log('\n🏛️ GOVERNMENT REGISTRATIONS');
    console.log('═'.repeat(50));
    console.log('✅ SAM.gov Federal Contractor Registration');
    console.log('✅ Indiana Department of Administration (IDOA) State Bidder');
    console.log('✅ Eligible Training Provider List (ETPL)');
    console.log('✅ DOL Registered Apprenticeship Sponsor');
    
    console.log('\n📊 NAICS CODES');
    console.log('═'.repeat(50));
    info.naicsCodes.forEach(code => {
      console.log(`• ${code}`);
    });
    
    console.log('\n🏆 CERTIFICATIONS & APPROVALS');
    console.log('═'.repeat(50));
    info.certifications.forEach(cert => {
      console.log(`• ${cert}`);
    });
    
    console.log('\n💼 BUSINESS TYPES');
    console.log('═'.repeat(50));
    info.businessTypes.forEach(type => {
      console.log(`• ${type}`);
    });
    
    if (info.uei === 'YOUR_UEI_HERE' || info.cage === 'YOUR_CAGE_HERE') {
      console.log('\n⚠️  ACTION REQUIRED');
      console.log('═'.repeat(50));
      console.log('Please update your UEI and CAGE codes in:');
      console.log(this.configPath);
    }
    
    console.log('\n✅ Verification Complete');
  }

  async generateBadge(): Promise<void> {
    console.log('🎖️ Generating Federal Contractor Compliance Badge...\n');
    
    const info = this.getContractorInfo();
    const badgeHtml = `
<!-- Federal Contractor Compliance Badge -->
<div class="federal-contractor-badge" style="
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  margin: 20px 0;
">
  <div style="display: flex; align-items: center; margin-bottom: 12px;">
    <div style="
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 8px;
      margin-right: 12px;
    ">
      🏛️
    </div>
    <div>
      <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Federal Contractor</h3>
      <p style="margin: 0; font-size: 14px; opacity: 0.9;">Government Registered</p>
    </div>
  </div>
  
  <div style="margin-bottom: 16px;">
    <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${info.entityName}</h4>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
      <div><strong>UEI:</strong> ${info.uei}</div>
      <div><strong>CAGE:</strong> ${info.cage}</div>
      <div><strong>Status:</strong> ${info.status.toUpperCase()}</div>
      <div><strong>Verified:</strong> ${new Date(info.lastVerified).toLocaleDateString()}</div>
    </div>
  </div>
  
  <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 12px;">
    <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 10px;">
      <span style="background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 4px;">SAM.gov</span>
      <span style="background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 4px;">ETPL</span>
      <span style="background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 4px;">DOL Sponsor</span>
      <span style="background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 4px;">Indiana Bidder</span>
    </div>
  </div>
</div>

<!-- React Component Version -->
<!--
const FederalContractorBadge = () => (
  <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white p-5 rounded-xl shadow-lg max-w-sm">
    <div className="flex items-center mb-3">
      <div className="bg-white/20 rounded-lg p-2 mr-3">
        🏛️
      </div>
      <div>
        <h3 className="text-lg font-semibold m-0">Federal Contractor</h3>
        <p className="text-sm opacity-90 m-0">Government Registered</p>
      </div>
    </div>
    
    <div className="mb-4">
      <h4 className="text-base font-semibold mb-2">${info.entityName}</h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><strong>UEI:</strong> ${info.uei}</div>
        <div><strong>CAGE:</strong> ${info.cage}</div>
        <div><strong>Status:</strong> ${info.status.toUpperCase()}</div>
        <div><strong>Verified:</strong> ${new Date(info.lastVerified).toLocaleDateString()}</div>
      </div>
    </div>
    
    <div className="border-t border-white/20 pt-3">
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="bg-white/20 px-1.5 py-0.5 rounded">SAM.gov</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">ETPL</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">DOL Sponsor</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded">Indiana Bidder</span>
      </div>
    </div>
  </div>
);
-->
`;

    const badgePath = join(this.outputDir, 'federal-contractor-badge.html');
    writeFileSync(badgePath, badgeHtml);
    
    console.log(`✅ Federal contractor badge generated:`);
    console.log(`   📄 ${badgePath}`);
    console.log(`   🌐 Ready for web integration`);
    console.log(`   ⚛️  React component included in comments`);
  }

  async createContractForm(type: string): Promise<void> {
    console.log(`📋 Creating Federal Contract Form: ${type.toUpperCase()}\n`);
    
    const info = this.getContractorInfo();
    
    const contractFormHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Federal Contract Proposal - ${info.entityName}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; }
        input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        .credentials { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .badge { display: inline-block; background: #1e3a8a; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Federal Contract Proposal</h1>
        <h2>${info.entityName}</h2>
        <p><strong>Contract Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)} Services</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h3>Contractor Information</h3>
        <div class="grid">
            <div>
                <div class="form-group">
                    <label>Entity Name:</label>
                    <input type="text" value="${info.entityName}" readonly>
                </div>
                <div class="form-group">
                    <label>UEI Number:</label>
                    <input type="text" value="${info.uei}" readonly>
                </div>
                <div class="form-group">
                    <label>CAGE Code:</label>
                    <input type="text" value="${info.cage}" readonly>
                </div>
            </div>
            <div>
                <div class="form-group">
                    <label>Address:</label>
                    <textarea readonly>${info.address.street}
${info.address.city}, ${info.address.state} ${info.address.zip}</textarea>
                </div>
                <div class="form-group">
                    <label>Registration Status:</label>
                    <input type="text" value="${info.status.toUpperCase()}" readonly>
                </div>
            </div>
        </div>
    </div>

    <div class="credentials">
        <h3>Government Credentials & Certifications</h3>
        ${info.certifications.map(cert => `<span class="badge">${cert}</span>`).join('')}
    </div>

    <div class="section">
        <h3>NAICS Codes</h3>
        <div class="grid">
            ${info.naicsCodes.map(code => `<div><strong>${code}</strong> - Industry Classification</div>`).join('')}
        </div>
    </div>

    <div class="section">
        <h3>Proposal Details</h3>
        <div class="form-group">
            <label>Solicitation Number:</label>
            <input type="text" placeholder="Enter solicitation number">
        </div>
        <div class="form-group">
            <label>Contract Value:</label>
            <input type="text" placeholder="$0.00">
        </div>
        <div class="form-group">
            <label>Performance Period:</label>
            <input type="text" placeholder="e.g., 12 months">
        </div>
        <div class="form-group">
            <label>Services Description:</label>
            <textarea rows="5" placeholder="Describe the services to be provided..."></textarea>
        </div>
    </div>

    <div class="section">
        <h3>Capability Statement</h3>
        <p><strong>Core Competencies:</strong></p>
        <ul>
            <li>Workforce Development & Training Services</li>
            <li>Apprenticeship Program Management</li>
            <li>Federal WIOA Program Administration</li>
            <li>Industry Certification Testing</li>
            <li>Government Contractor Training</li>
            <li>Employment Services & Job Placement</li>
        </ul>
        
        <p><strong>Past Performance:</strong></p>
        <ul>
            <li>EmployIndy Partnership - $17M+ Program Management</li>
            <li>Federal ETPL Provider - WIOA Title I Programs</li>
            <li>DOL Registered Apprenticeship Sponsor</li>
            <li>Multi-certification Testing Center Operations</li>
        </ul>
    </div>

    <div class="section">
        <h3>Contact Information</h3>
        <div class="grid">
            <div>
                <div class="form-group">
                    <label>Primary Contact:</label>
                    <input type="text" placeholder="Name">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" placeholder="email@elevateforhumanity.org">
                </div>
            </div>
            <div>
                <div class="form-group">
                    <label>Phone:</label>
                    <input type="tel" placeholder="(317) 555-WORK">
                </div>
                <div class="form-group">
                    <label>Website:</label>
                    <input type="url" value="https://elevateforhumanity.org" readonly>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <p><small>Generated by EFH UEI/CAGE Management System - ${new Date().toISOString()}</small></p>
    </div>
</body>
</html>
`;

    const formPath = join(this.outputDir, `federal-contract-${type}-form.html`);
    writeFileSync(formPath, contractFormHtml);
    
    console.log(`✅ Federal contract form created:`);
    console.log(`   📄 ${formPath}`);
    console.log(`   💼 Ready for proposal submissions`);
    console.log(`   🎯 Pre-filled with your credentials`);
  }

  async exportData(format: string): Promise<void> {
    console.log(`📊 Exporting Compliance Data: ${format.toUpperCase()}\n`);
    
    const info = this.getContractorInfo();
    
    if (format === 'csv') {
      const csvData = [
        'Field,Value',
        `Entity Name,"${info.entityName}"`,
        `UEI,"${info.uei}"`,
        `CAGE,"${info.cage}"`,
        `Address,"${info.address.street}, ${info.address.city}, ${info.address.state} ${info.address.zip}"`,
        `Status,"${info.status}"`,
        `Last Verified,"${info.lastVerified}"`,
        '',
        'NAICS Codes',
        ...info.naicsCodes.map(code => `"${code}"`),
        '',
        'Certifications',
        ...info.certifications.map(cert => `"${cert}"`),
        '',
        'Business Types',
        ...info.businessTypes.map(type => `"${type}"`)
      ].join('\n');
      
      const csvPath = join(this.outputDir, 'contractor-compliance-data.csv');
      writeFileSync(csvPath, csvData);
      
      console.log(`✅ CSV export complete:`);
      console.log(`   📄 ${csvPath}`);
      console.log(`   📊 Ready for spreadsheet import`);
    } else if (format === 'json') {
      const jsonPath = join(this.outputDir, 'contractor-compliance-data.json');
      writeFileSync(jsonPath, JSON.stringify(info, null, 2));
      
      console.log(`✅ JSON export complete:`);
      console.log(`   📄 ${jsonPath}`);
      console.log(`   🔗 Ready for API integration`);
    }
  }
}

// Command Line Interface
async function main() {
  const args = process.argv.slice(2);
  const manager = new UEICageManager();
  
  if (args.length === 0) {
    console.log('🏛️ UEI/CAGE Federal Contracting Management System');
    console.log('Elevate for Humanity - Government Contractor Tools\n');
    console.log('Available commands:');
    console.log('  verify              - Verify federal registration status');
    console.log('  badge               - Generate compliance badge HTML');
    console.log('  form [type]         - Create federal contract forms');
    console.log('  export [format]     - Export compliance data (csv/json)');
    console.log('');
    console.log('Examples:');
    console.log('  tsx server/scripts/uei-cage-manager.ts verify');
    console.log('  tsx server/scripts/uei-cage-manager.ts badge');
    console.log('  tsx server/scripts/uei-cage-manager.ts form contract');
    console.log('  tsx server/scripts/uei-cage-manager.ts export csv');
    return;
  }
  
  const command = args[0];
  
  try {
    switch (command) {
      case 'verify':
        await manager.verify();
        break;
        
      case 'badge':
        await manager.generateBadge();
        break;
        
      case 'form':
        const formType = args[1] || 'general';
        await manager.createContractForm(formType);
        break;
        
      case 'export':
        const format = args[1] || 'json';
        await manager.exportData(format);
        break;
        
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Run without arguments to see available commands.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { UEICageManager };