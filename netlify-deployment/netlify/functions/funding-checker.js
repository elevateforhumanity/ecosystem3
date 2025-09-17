// Netlify Function for Funding Eligibility Checker
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { 
      employmentStatus, 
      ageGroup, 
      incomeLevel, 
      education,
      location,
      email,
      firstName 
    } = data;

    // Funding eligibility logic
    const eligibilityResults = {
      wioa: false,
      workforceReadyGrant: false,
      employerSponsorship: false,
      youthPrograms: false,
      estimatedCoverage: 0,
      recommendedPrograms: [],
      nextSteps: []
    };

    // WIOA Eligibility Check
    if (
      (employmentStatus === 'unemployed' || employmentStatus === 'underemployed') &&
      (incomeLevel === 'low' || incomeLevel === 'moderate')
    ) {
      eligibilityResults.wioa = true;
      eligibilityResults.estimatedCoverage = Math.max(eligibilityResults.estimatedCoverage, 100);
      eligibilityResults.nextSteps.push('Contact WorkOne for WIOA eligibility assessment');
    }

    // Workforce Ready Grant Eligibility
    if (
      location === 'indiana' &&
      (employmentStatus !== 'employed' || incomeLevel === 'low')
    ) {
      eligibilityResults.workforceReadyGrant = true;
      eligibilityResults.estimatedCoverage = Math.max(eligibilityResults.estimatedCoverage, 100);
      eligibilityResults.nextSteps.push('Apply for Indiana Workforce Ready Grant');
    }

    // Youth Programs
    if (ageGroup === '16-17' || ageGroup === '18-24') {
      eligibilityResults.youthPrograms = true;
      eligibilityResults.estimatedCoverage = Math.max(eligibilityResults.estimatedCoverage, 90);
      eligibilityResults.nextSteps.push('Explore youth-specific funding opportunities');
      eligibilityResults.recommendedPrograms.push('Barbering Youth Bootcamp');
      eligibilityResults.recommendedPrograms.push('Youth Entrepreneurship');
    }

    // Employer Sponsorship Potential
    if (employmentStatus === 'employed') {
      eligibilityResults.employerSponsorship = true;
      eligibilityResults.estimatedCoverage = Math.max(eligibilityResults.estimatedCoverage, 75);
      eligibilityResults.nextSteps.push('Discuss training opportunities with your employer');
    }

    // Program Recommendations based on profile
    if (employmentStatus === 'unemployed' || employmentStatus === 'underemployed') {
      eligibilityResults.recommendedPrograms.push('IT Support & Help Desk');
      eligibilityResults.recommendedPrograms.push('Home Health Aide');
      eligibilityResults.recommendedPrograms.push('Customer Service');
    }

    // Generate personalized message
    let personalizedMessage = `Hi ${firstName || 'there'}! `;
    
    if (eligibilityResults.estimatedCoverage >= 90) {
      personalizedMessage += `Great news! You appear to qualify for funding that could cover up to ${eligibilityResults.estimatedCoverage}% of your training costs.`;
    } else if (eligibilityResults.estimatedCoverage >= 50) {
      personalizedMessage += `You may qualify for partial funding covering up to ${eligibilityResults.estimatedCoverage}% of training costs.`;
    } else {
      personalizedMessage += `While you may not qualify for full funding, we have payment plans and other options available.`;
    }

    // Log for follow-up (in production, save to database/CRM)
    console.log('Funding eligibility check:', {
      email,
      firstName,
      eligibilityResults,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        eligibility: eligibilityResults,
        personalizedMessage,
        contactInfo: {
          phone: '(317) 999-9999',
          email: 'info@elevateforhumanity.org',
          nextStep: 'Schedule a free consultation to discuss your options'
        }
      })
    };

  } catch (error) {
    console.error('Funding checker error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Unable to process eligibility check. Please call us at (317) 999-9999.'
      })
    };
  }
};