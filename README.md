# Invoice Generating App

A full-stack invoice generating application built with React frontend and Java Spring Boot backend.

## Features

- **Customer Management**: Add, edit, and manage customer information
- **Product Catalog**: Maintain a catalog of products/services with pricing
- **Invoice Generation**: Create professional invoices with automatic calculations
- **PDF Export**: Export invoices as PDF files
- **Invoice History**: View and manage previous invoices
- **Tax Calculations**: Automatic tax calculations with configurable rates
- **Responsive Design**: Modern, mobile-friendly UI

## Technology Stack

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Axios for API calls

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- H2 Database (for development)
- Maven

## Project Structure

```
invoice-app/
├── frontend/          # React application
├── backend/           # Java Spring Boot application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+

### Backend Setup
1. Navigate to the backend directory
2. Run: `mvn spring-boot:run`
3. Backend will start on `http://localhost:8888`

### Frontend Setup
1. Navigate to the frontend directory
2. Run: `npm install`
3. Run: `npm start`
4. Frontend will start on `http://localhost:3000`

## API Endpoints

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/{id}/pdf` - Download invoice PDF

## 🚀 Deployment

### Local Development
Follow the instructions in `SETUP-GUIDE.md` for local setup.

### Production Deployment
- **Frontend**: Can be deployed to Netlify, Vercel, or any static hosting service
- **Backend**: Can be deployed to Heroku, AWS, Google Cloud, or any Java hosting service
- **Database**: Configure with PostgreSQL, MySQL, or any production database

## 📁 Repository Structure

```
invoice-generator/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/invoice/
│   │       ├── entity/         # JPA Entities
│   │       ├── repository/     # Data Access Layer
│   │       ├── service/        # Business Logic
│   │       ├── controller/     # REST API Endpoints
│   │       └── dto/            # Data Transfer Objects
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql           # Sample data
│   └── pom.xml                # Maven dependencies
├── frontend/                   # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Main pages
│   │   ├── services/          # API communication
│   │   └── types/             # TypeScript interfaces
│   ├── package.json           # NPM dependencies
│   └── tsconfig.json          # TypeScript config
├── .gitignore                 # Git ignore rules
├── SETUP-GUIDE.md            # Detailed setup instructions
├── setup-and-run.bat         # Automated setup script
└── README.md                 # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the `SETUP-GUIDE.md` for troubleshooting
2. Run `setup-and-run.bat` for automated diagnostics
3. Create an issue on GitHub

## License

MIT License 
