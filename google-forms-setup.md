
# Google Forms Setup Instructions

## How to Replace Form URLs with Your Actual Google Forms

### 1. Create Google Forms
1. Go to [Google Forms](https://forms.google.com)
2. Create separate forms for each use case:
   - **Indiana Connect Application** (for connect.html)
   - **Program Interest Form** (for programs.html)
   - **Support Request Form** (for account.html)
   - **Eligibility Application** (for eligibility-verification.html)

### 2. Get Form URLs
1. In each Google Form, click the "Send" button
2. Select the "Link" tab
3. Copy the URL that looks like: `https://docs.google.com/forms/d/e/FORM_ID/viewform`
4. Change `viewform` to `formResponse` for direct submission

### 3. Get Field Entry Names
1. In your Google Form, right-click on any field and "Inspect Element"
2. Find the `name` attribute that looks like `entry.1234567890`
3. Replace the placeholder entry numbers in the HTML with your actual ones

### 4. Update HTML Files
Replace these placeholder URLs and entry names in your HTML files:

**connect.html:**
- Form action: `YOUR_GOOGLE_FORM_ID` 
- Entry names: `entry.1234567890`, `entry.0987654321`, etc.

**programs.html:**
- Form action: `YOUR_PROGRAM_INTEREST_FORM_ID`
- Entry names: `entry.1111111111`, `entry.2222222222`, etc.

**account.html:**
- Form action: `YOUR_SUPPORT_FORM_ID`
- Entry names: `entry.7777777777`, `entry.8888888888`, etc.

**eligibility-verification.html:**
- Form action: `YOUR_ELIGIBILITY_FORM_ID`
- Entry names: `entry.1010101010`, `entry.2020202020`, etc.

### 5. Test the Forms
1. Fill out and submit each form on your website
2. Check that responses appear in your Google Forms responses
3. Verify email notifications are set up if needed

### 6. Benefits of This Approach
- ✅ No iframes - better SEO and mobile experience
- ✅ Forms integrate seamlessly with your site design
- ✅ All responses go directly to Google Sheets
- ✅ You can set up email notifications
- ✅ Forms work offline and sync when online
- ✅ Full control over styling and user experience

### 7. Optional Enhancements
- Add form validation with JavaScript
- Show success messages after submission
- Add Google Analytics tracking for form submissions
- Integrate with your existing user database
