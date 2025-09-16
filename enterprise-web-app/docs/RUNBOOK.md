# RUNBOOK

## Overview

This runbook provides operational instructions for deploying and managing the enterprise web application. It outlines the steps required to set up the environment, deploy the application, and perform common operational tasks.

## Prerequisites

1. **Node.js**: Ensure Node.js version 18.x is installed. Use the `.nvmrc` and `.node-version` files to manage the Node version.
2. **Package Manager**: Use npm as the package manager. Ensure all dependencies are installed by running `npm install`.

## Environment Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd enterprise-web-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template and populate it with the necessary environment variables.

## Running the Application

To run the application in development mode, use the following command:
```
npm run dev
```
This will start the development server and watch for changes.

## Building the Application

To build the application for production, run:
```
npm run build
```
The built files will be located in the `dist` directory.

## Deploying the Application

### Vercel Deployment

1. Ensure you have the Vercel CLI installed:
   ```
   npm install -g vercel
   ```

2. Deploy the application:
   ```
   vercel
   ```

3. Follow the prompts to configure the deployment settings.

### Netlify Deployment

1. Ensure you have the Netlify CLI installed:
   ```
   npm install -g netlify-cli
   ```

2. Deploy the application:
   ```
   netlify deploy
   ```

3. Follow the prompts to configure the deployment settings.

## Monitoring and Logging

Integrate monitoring tools such as Sentry for error tracking. Ensure that the DSN is added to the `.env` file and initialized in the application.

## Common Operational Tasks

### Updating Dependencies

To update dependencies, run:
```
npm update
```

### Running Tests

To run tests, use:
```
npm test
```

### Linting Code

To lint the codebase, run:
```
npm run lint
```

### Formatting Code

To format the codebase, use:
```
npm run format
```

## Troubleshooting

- If you encounter issues with dependencies, consider using:
  ```
  npm install --legacy-peer-deps
  ```
- For build issues, check the logs for errors and ensure all environment variables are correctly set.

## Conclusion

This runbook serves as a guide for deploying and managing the enterprise web application. For further assistance, refer to the documentation in the `docs` directory or contact the development team.