# HomeSquare Expense: Enterprise Project Management & Expense Tracking

## 🔗 Live Demo
[Live Application](https://homesquareinternal.netlify.app/)

### Demo Credentials
1. **Admin View**
   - Email: dvigneshkumar3@gmail.com
   - Password: home_square
2. **Employee View**
   - Email: dvigneshkumar99@gmail.com
   - Password: home_square

## 📑 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [PWA Features](#pwa-features)
- [Contributing](#contributing)

## 🎯 Overview
HomeSquare Expense is an enterprise-grade project expense management system that enables organizations to efficiently track project budgets, allocate funds, and monitor expenses. Built with scalability and user experience in mind, it provides real-time insights through interactive visualizations and supports both admin and employee workflows.

## 🏗️ Architecture
```mermaid
flowchart TB
    subgraph Client["Frontend Layer"]
        direction TB
        UI["React + TypeScript"]
        RC["Recharts\nData Visualization"]
        PWA["PWA Layer\nService Worker"]
        
        subgraph StateManagement["Application State"]
            Context["React Context"]
            Hooks["Custom Hooks"]
        end
    end

    subgraph Auth["Authentication Layer"]
        FireAuth["Firebase Auth"]
        subgraph Roles["Role Management"]
            Admin["Admin Access"]
            Employee["Employee Access"]
        end
    end

    subgraph DB["Database Layer"]
        FireStore["Cloud Firestore"]
        subgraph Collections["Data Collections"]
            Projects["Projects"]
            Expenses["Expenses"]
            Users["Users"]
            Budgets["Budget Allocations"]
        end
    end

    UI --> StateManagement
    UI --> RC
    StateManagement --> FireAuth
    FireAuth --> Roles
    StateManagement --> FireStore
    PWA --> UI

    Collections --> Projects
    Collections --> Expenses
    Collections --> Users
    Collections --> Budgets

    classDef frontend fill:#61DAFB,stroke:#20232a,stroke-width:2px
    classDef auth fill:#FFA611,stroke:#1A1A1A,stroke-width:2px
    classDef database fill:#4CAF50,stroke:#1A1A1A,stroke-width:2px
    classDef pwa fill:#FF4081,stroke:#1A1A1A,stroke-width:2px,color:white

    class Client frontend
    class Auth auth
    class DB database
    class PWA pwa
```
## 🚀 Features

### Project Management
- Create and manage multiple projects
- Set and adjust project budgets
- Track project timeline and status
- Real-time budget utilization monitoring

### Budget Allocation
- Allocate funds to team members
- Track allocation history
- Monitor spending limits
- Real-time balance updates

### Expense Tracking
- Add and categorize expenses
- Tag expenses to specific projects
- Upload receipt documentation
- Track expense history

### Analytics & Reporting
- Interactive charts and graphs
- Project profit visualization
- Budget utilization trends
- Custom report generation

## 🛠️ Tech Stack
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
- ![Recharts](https://img.shields.io/badge/recharts-%23FF6384.svg?style=for-the-badge&logo=chartdotjs&logoColor=white)

## 📸 Screenshots
**Profile Overview**

<img width="1280" alt="Screenshot 2025-01-05 at 12 09 04 AM" src="https://github.com/user-attachments/assets/2d5ed4b1-8e3e-40e8-ad0c-55ed9350556a" />

**Project Management Interface**

<img width="1280" alt="Screenshot 2025-01-05 at 12 07 52 AM" src="https://github.com/user-attachments/assets/b8ed199e-6259-4fef-932e-dcc8fa245906" />

**Expense Entry Form**
  
<img width="1279" alt="Screenshot 2025-01-05 at 12 11 22 AM" src="https://github.com/user-attachments/assets/d6488fa2-97ee-49f1-814f-9b25608bc26d" />

**Analytics Dashboard**

<img width="1280" alt="Screenshot 2025-01-05 at 12 07 42 AM" src="https://github.com/user-attachments/assets/5ae84663-9bfc-4004-9623-006c742f3a96" />

**Budget Allocation Interface**
  
<img width="1280" alt="Screenshot 2025-01-05 at 12 08 32 AM" src="https://github.com/user-attachments/assets/e779fc04-f667-4948-90ca-1a2434611b46" />


## ⚙️ Installation

### Prerequisites
- Node.js >= 14.x
- npm >= 6.x
- Firebase account

### Local Development
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Firebase configuration to .env

# Start development server
npm start
```
### Environment Configuration
Required environment variables:
- REACT_APP_FIREBASE_API_KEY
- REACT_APP_FIREBASE_AUTH_DOMAIN
- REACT_APP_FIREBASE_PROJECT_ID
- REACT_APP_FIREBASE_STORAGE_BUCKET
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- REACT_APP_FIREBASE_APP_ID

## 📱 PWA Features
- Responsive design for all device sizes
- Progressive Web App capabilities
- Offline support (Coming Soon)
- Custom offline page with service worker implementation
- Install to home screen functionality

## 🌟 Key Technical Features
- TypeScript for enhanced type safety
- Real-time data synchronization
- Role-based access control
- Responsive design implementation
- Scalable architecture
- Comprehensive error handling
- Performance optimized charts
- Secure authentication flow

## 🤝 Contributing
This is an open-source project and contributions are welcome. Please follow these steps:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License
[MIT](LICENSE)
