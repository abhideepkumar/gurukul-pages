# School Fee Management System

A comprehensive web-based solution for managing school fees, built using Next.js and Supabase.

## Overview

This School Fee Management System is designed to streamline the process of managing student fees, providing an efficient and user-friendly interface for school administrators, accountants, and other staff members. The system offers features such as student registration, fee structure management, payment processing, and detailed reporting.

## Key Features

1. **Student Management**
   - Add new students with detailed information
   - Import students in bulk using CSV, XSL, or XLSX files
   - View and edit student profiles
   - Search functionality for quick access to student information

2. **Fee Structure Management**
   - Create and manage multiple fee slabs
   - Assign fee structures to individual students or classes
   - Support for various fee types (e.g., monthly, quarterly, annually)

3. **Payment Processing**
   - Record fee payments for individual students
   - Generate receipts for payments
   - Process multiple fee items in a single transaction

4. **Financial Tracking**
   - Dashboard with key financial metrics
   - Detailed transaction history
   - Cash flow management (deposits and withdrawals)

5. **Reporting**
   - Generate reports on fee collection, outstanding dues, and more
   - Export reports in various formats

6. **User-friendly Interface**
   - Responsive design for desktop and mobile devices
   - Intuitive navigation and data entry forms
   - Real-time updates and notifications

## Technology Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Next.js API routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/abhideepkumar/gurukul.git
   ```

2. Install dependencies:
   ```
   cd school-fee-management
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Key Components

1. **SearchBar**: Global search functionality for quick access to student information
2. **StudentProfile**: Displays detailed student information
3. **FutureReceipts**: Manages upcoming fee payments for a student
4. **TransactionHistory**: Shows past fee transactions for a student
5. **ProcessTransaction**: Handles the payment processing workflow

## Database Schema

The application uses the following main tables in Supabase:

- `students`: Stores student information
- `classes`: Manages class/grade information
- `fee_slabs`: Defines various fee structures
- `student_fee_status`: Tracks fee status for each student
- `transactions`: Records all financial transactions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.