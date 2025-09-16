# New Ecosystem Project

## Overview
This project is a React application that utilizes Vite as the build tool and Supabase as the backend service. It is designed to provide a modern web experience with fast development and deployment capabilities.

## Project Structure
```
new-ecosysstem
├── src
│   ├── main.jsx          # Entry point of the application
│   ├── App.jsx           # Main application component
│   ├── components        # Directory for reusable components
│   │   └── ExampleComponent.jsx # Example reusable component
│   └── supabase         # Directory for Supabase related files
│       └── client.js     # Supabase client instance
├── public
│   └── index.html        # Main HTML template
├── vite.config.js        # Vite configuration file
├── package.json          # NPM configuration file
├── README.md             # Project documentation
└── .gitignore            # Git ignore file
```

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd new-ecosysstem
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Supabase URL and key:
   ```
   VITE_SUPABASE_KEY=your_supabase_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   The application will automatically open in your default browser at `http://localhost:3000`.

## Usage
- The main application logic is contained within `src/App.jsx`.
- Reusable components can be found in the `src/components` directory.
- The Supabase client is configured in `src/supabase/client.js` for backend interactions.

## License
This project is licensed under the Commercial License. No resale, sublicensing, or redistribution is allowed. See the LICENSE file for details.