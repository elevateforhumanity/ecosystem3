const fs = require('fs');
const path = require('path');

/**
 * Ecosystem Status API - Provides detailed health checks for all system components
 * Responds to the question "where are we at now" with factual system assessment
 */

class EcosystemStatusChecker {
    constructor() {
        this.results = {};
        this.basePath = __dirname;
    }

    async runAllChecks() {
        const checks = [
            this.checkCoreInfrastructure(),
            this.checkSisterSites(),
            this.checkPaymentSystem(),
            this.checkLearningManagement(),
            this.checkTestingQuality(),
            this.checkDeploymentReadiness()
        ];

        const results = await Promise.all(checks);
        
        return {
            timestamp: new Date().toISOString(),
            overallHealth: this.calculateOverallHealth(results),
            sections: results,
            summary: this.generateSummary(results)
        };
    }

    async checkCoreInfrastructure() {
        const checks = {
            packageJson: this.fileExists('package.json'),
            nodeModules: this.directoryExists('node_modules'),
            envExample: this.fileExists('.env.example'),
            prismaSchema: this.fileExists('prisma/schema.prisma'),
            buildScript: this.hasNpmScript('build'),
            startScript: this.hasNpmScript('dev')
        };

        const results = await this.executeChecks(checks);
        
        return {
            name: 'Core Infrastructure',
            status: this.getSectionStatus(results),
            checks: results,
            criticalIssues: this.getCriticalIssues(results, [
                'packageJson', 'nodeModules', 'buildScript'
            ])
        };
    }

    async checkSisterSites() {
        const siteFiles = [
            'index.html',
            'programs.html', 
            'lms.html',
            'connect.html',
            'account.html',
            'hub.html'
        ];

        const checks = {};
        siteFiles.forEach(file => {
            checks[file.replace('.html', 'Site')] = this.fileExists(file);
        });

        const results = await this.executeChecks(checks);
        
        return {
            name: 'Sister Sites',
            status: this.getSectionStatus(results),
            checks: results,
            criticalIssues: this.getCriticalIssues(results, ['indexSite', 'programsSite'])
        };
    }

    async checkPaymentSystem() {
        const checks = {
            stripeIntegration: this.fileExists('stripe-payment-system.js'),
            enhancedCheckout: this.fileExists('pay-enhanced-checkout.js'),
            webhookHandler: this.fileExists('webhook-handler.js'),
            revenueSplits: this.fileExists('payment-processing-with-splits.js'),
            stripeProducts: this.fileExists('stripe-products-creator.js'),
            bnplSystem: this.fileExists('bnpl-webhook-handler.js'),
            paymentRoutes: this.fileExists('pay-approval-routes.js')
        };

        const results = await this.executeChecks(checks);
        
        return {
            name: 'Payment System',
            status: this.getSectionStatus(results),
            checks: results,
            criticalIssues: this.getCriticalIssues(results, [
                'stripeIntegration', 'webhookHandler'
            ])
        };
    }

    async checkLearningManagement() {
        const checks = {
            lmsApi: this.fileExists('lms-api-advanced.js'),
            lmsHtml: this.fileExists('lms.html'),
            curriculumDir: this.directoryExists('curriculum'),
            skillsAssessment: this.fileExists('skills-assessment.html'),
            digitalBinder: this.fileExists('digital-binder.html'),
            lmsAdvanced: this.fileExists('lms-advanced.html'),
            studentDashboard: this.fileExists('student-dashboard.html')
        };

        const results = await this.executeChecks(checks);
        
        return {
            name: 'Learning Management',
            status: this.getSectionStatus(results),
            checks: results,
            criticalIssues: this.getCriticalIssues(results, ['lmsApi', 'lmsHtml'])
        };
    }

    async checkTestingQuality() {
        const checks = {
            vitestConfig: this.fileExists('vitest.config.js'),
            eslintConfig: this.fileExists('.eslintrc.cjs'),
            prettierConfig: this.fileExists('.prettierrc.json'),
            testDirectory: this.directoryExists('test'),
            testsDirectory: this.directoryExists('tests'),
            jestConfig: this.fileExists('jest.config.js'),
            lighthouseConfig: this.fileExists('lighthouserc.json')
        };

        const results = await this.executeChecks(checks);
        
        return {
            name: 'Testing & Quality',
            status: this.getSectionStatus(results),
            checks: results,
            criticalIssues: this.getCriticalIssues(results, ['vitestConfig', 'eslintConfig'])
        };
    }

    async checkDeploymentReadiness() {
        const checks = {
            dockerfile: this.fileExists('Dockerfile'),
            vercelConfig: this.fileExists('vercel.json'),
            gitignore: this.fileExists('.gitignore'),
            githubWorkflows: this.directoryExists('.github/workflows'),
            deploymentChecklist: this.fileExists('DEPLOYMENT_CHECKLIST.md'),
            envValidation: this.fileExists('scripts/validate-env.js'),
            buildScript: this.fileExists('build-and-start.sh'),
            startServer: this.fileExists('start-server.sh')
        };

        const results = await this.executeChecks(checks);
        
        return {
            name: 'Deployment Readiness',
            status: this.getSectionStatus(results),
            checks: results,
            criticalIssues: this.getCriticalIssues(results, [
                'dockerfile', 'vercelConfig', 'envValidation'
            ])
        };
    }

    async executeChecks(checks) {
        const results = {};
        
        for (const [name, checkPromise] of Object.entries(checks)) {
            try {
                results[name] = await checkPromise;
            } catch (error) {
                results[name] = {
                    status: 'error',
                    message: `Check failed: ${error.message}`,
                    details: error.stack
                };
            }
        }
        
        return results;
    }

    fileExists(filePath) {
        return new Promise((resolve) => {
            const fullPath = path.join(this.basePath, filePath);
            fs.access(fullPath, fs.constants.F_OK, (err) => {
                if (err) {
                    resolve({
                        status: 'error',
                        message: `File not found: ${filePath}`,
                        path: fullPath
                    });
                } else {
                    // Get file stats for additional info
                    fs.stat(fullPath, (statErr, stats) => {
                        if (statErr) {
                            resolve({
                                status: 'working',
                                message: `File exists: ${filePath}`,
                                path: fullPath
                            });
                        } else {
                            resolve({
                                status: 'working',
                                message: `File exists: ${filePath} (${this.formatBytes(stats.size)})`,
                                path: fullPath,
                                size: stats.size,
                                modified: stats.mtime
                            });
                        }
                    });
                }
            });
        });
    }

    directoryExists(dirPath) {
        return new Promise((resolve) => {
            const fullPath = path.join(this.basePath, dirPath);
            fs.access(fullPath, fs.constants.F_OK, (err) => {
                if (err) {
                    resolve({
                        status: 'error',
                        message: `Directory not found: ${dirPath}`,
                        path: fullPath
                    });
                } else {
                    // Count files in directory
                    fs.readdir(fullPath, (readErr, files) => {
                        if (readErr) {
                            resolve({
                                status: 'working',
                                message: `Directory exists: ${dirPath}`,
                                path: fullPath
                            });
                        } else {
                            resolve({
                                status: 'working',
                                message: `Directory exists: ${dirPath} (${files.length} items)`,
                                path: fullPath,
                                itemCount: files.length
                            });
                        }
                    });
                }
            });
        });
    }

    hasNpmScript(scriptName) {
        return new Promise((resolve) => {
            const packagePath = path.join(this.basePath, 'package.json');
            fs.readFile(packagePath, 'utf8', (err, data) => {
                if (err) {
                    resolve({
                        status: 'error',
                        message: `Cannot read package.json: ${err.message}`
                    });
                    return;
                }

                try {
                    const packageJson = JSON.parse(data);
                    if (packageJson.scripts && packageJson.scripts[scriptName]) {
                        resolve({
                            status: 'working',
                            message: `NPM script '${scriptName}' configured: ${packageJson.scripts[scriptName]}`,
                            script: packageJson.scripts[scriptName]
                        });
                    } else {
                        resolve({
                            status: 'error',
                            message: `NPM script '${scriptName}' not found`
                        });
                    }
                } catch (parseErr) {
                    resolve({
                        status: 'error',
                        message: `Invalid package.json: ${parseErr.message}`
                    });
                }
            });
        });
    }

    getSectionStatus(results) {
        const statuses = Object.values(results).map(r => r.status);
        const errorCount = statuses.filter(s => s === 'error').length;
        const warningCount = statuses.filter(s => s === 'warning').length;
        const workingCount = statuses.filter(s => s === 'working').length;

        if (errorCount > workingCount) return 'error';
        if (warningCount > 0 || errorCount > 0) return 'warning';
        return 'working';
    }

    getCriticalIssues(results, criticalChecks) {
        const issues = [];
        criticalChecks.forEach(checkName => {
            if (results[checkName] && results[checkName].status === 'error') {
                issues.push({
                    check: checkName,
                    message: results[checkName].message
                });
            }
        });
        return issues;
    }

    calculateOverallHealth(sections) {
        let totalChecks = 0;
        let workingChecks = 0;
        let warningChecks = 0;
        let errorChecks = 0;

        sections.forEach(section => {
            Object.values(section.checks).forEach(check => {
                totalChecks++;
                switch (check.status) {
                    case 'working': workingChecks++; break;
                    case 'warning': warningChecks++; break;
                    case 'error': errorChecks++; break;
                }
            });
        });

        const healthPercentage = Math.round((workingChecks / totalChecks) * 100);
        
        let overallStatus = 'critical';
        if (healthPercentage >= 90) overallStatus = 'excellent';
        else if (healthPercentage >= 70) overallStatus = 'good';
        else if (healthPercentage >= 50) overallStatus = 'fair';

        return {
            percentage: healthPercentage,
            status: overallStatus,
            totalChecks,
            workingChecks,
            warningChecks,
            errorChecks,
            criticalIssues: this.getAllCriticalIssues(sections)
        };
    }

    getAllCriticalIssues(sections) {
        const allIssues = [];
        sections.forEach(section => {
            if (section.criticalIssues) {
                section.criticalIssues.forEach(issue => {
                    allIssues.push({
                        section: section.name,
                        ...issue
                    });
                });
            }
        });
        return allIssues;
    }

    generateSummary(sections) {
        const summary = {
            readyForProduction: false,
            majorIssues: [],
            recommendations: [],
            nextSteps: []
        };

        // Analyze each section for specific insights
        sections.forEach(section => {
            switch (section.name) {
                case 'Core Infrastructure':
                    if (section.status === 'error') {
                        summary.majorIssues.push('Core infrastructure has critical failures');
                        summary.recommendations.push('Fix package.json and dependency issues');
                    }
                    break;
                    
                case 'Payment System':
                    if (section.status === 'working') {
                        summary.nextSteps.push('Configure Stripe environment variables');
                    } else {
                        summary.majorIssues.push('Payment system incomplete');
                    }
                    break;
                    
                case 'Testing & Quality':
                    if (section.status === 'error') {
                        summary.recommendations.push('Set up proper testing infrastructure');
                    }
                    break;
                    
                case 'Deployment Readiness':
                    if (section.status === 'working') {
                        summary.nextSteps.push('Configure environment variables for deployment');
                    }
                    break;
            }
        });

        // Determine production readiness
        const workingSections = sections.filter(s => s.status === 'working').length;
        const totalSections = sections.length;
        summary.readyForProduction = (workingSections / totalSections) >= 0.8;

        if (!summary.readyForProduction) {
            summary.majorIssues.push('System not ready for production deployment');
            summary.nextSteps.push('Address critical issues before deployment');
        }

        return summary;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

module.exports = EcosystemStatusChecker;