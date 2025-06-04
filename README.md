# Veracode Visualizer

A modern web application for visualizing and analyzing Veracode security scan findings. This tool provides an intuitive interface to explore, filter, and understand security vulnerabilities identified in your codebase.

## Features

- 📊 Interactive findings table with sorting and filtering capabilities
- 🔍 Detailed view of individual findings
- 🎨 Modern, clean UI with intuitive navigation
- 🔄 Real-time filtering and search
- 📄 Pagination for handling large sets of findings
- 🎯 Severity-based visualization with color coding

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Next.js

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/veracode-visualizer.git
cd veracode-visualizer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Viewing Findings

The main findings table provides a comprehensive view of all security findings:

- Use the search bar to filter findings by title, file, CWE ID, or severity
- Click column headers to sort findings
- Click "View" on any finding to see detailed information
- Navigate through pages using the pagination controls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Veracode for providing the security scanning platform
- The open-source community for the amazing tools and libraries used in this project
