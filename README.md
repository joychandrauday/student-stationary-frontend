# Student Stationary Frontend

A powerful and dynamic frontend application designed for managing products, orders, and users in the Student Stationary ecosystem. Built with modern web technologies, this application offers seamless interaction with the backend, providing real-time updates and smooth functionality for users and administrators.
Checkout a frontend: [live frontend website](https://student-stationary-frontend.vercel.app/)

## Features
- 🌟 **Real-time Stock Updates**: Check product availability with real-time stock level updates.
- 👤 **User Management**: Register and log in users, manage their profiles and orders.
- 📧 **Order Management**: Place orders, track their status, and manage order history.
- 📦 **Dynamic Product Management**: Add, update, and delete products seamlessly.
- 🔍 **Stock Management**: Real-time product availability updates based on stock levels.
- 📊 **Scalable Architecture**: Built for extensibility with modular design.
- 🔐 **Role-Based Access**: Secure routes based on user roles (Admin and User).
- 🛒 **Shopping Cart**: Add products to the cart and proceed to checkout.
- 🌍 **Responsive Design**: Optimized for both mobile and desktop users.
- 🚀 **Ready for Deployment**: Preconfigured for Vercel or other deployment platforms.

## Tech Stack

- **Frontend Framework**: React.js
- **State Management**: Redux, React Context
- **Routing**: React Router
- **API Communication**: Axios
- **CSS Framework**: Tailwind CSS, ShadcnUI
- **Build Tool**: TypeScript
- **Deployment Platform**: Vercel

## Getting Started

Follow the steps below to set up the project locally on your machine.

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** (version 16 or above)  
  [Download Node.js](https://nodejs.org/)
- **Package Manager**: NPM (comes with Node.js) or Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/joychandrauday/student-stationary-frontend.git
    ```
2.  Navigate to the project directory
    ```bash
    cd student-stationary-frontend
    ```
3.  Install dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

4.  Environment Variables:

    Create a .env file in the root directory and provide the necessary variables:

    ```bash
        BACKEND_URL= https://studentstationary-backend.vercel.app/api/v1
    ```

6.  Run the Application:
    Start the server in development mode:



    ```bash
        npm run dev
    ```


### 🌟 Key Pages

1. **Home Page**
   - Displays a list of all products.
   - Filter products by category.
   - Product details are visible on hover.
   - Users can add products to their cart.

2. **Product Details**
   - Displays detailed information about each product.
   - Shows availability, description, and price.
   - Users can add the product to the cart.

3. **Shopping Cart**
   - Users can view and modify the contents of their cart.
   - Update quantities or remove products from the cart.

4. **Order Summary & Checkout**
   - Displays all items in the cart and allows users to place an order.
   - Payment verification and order tracking features are included.

5. **Admin Dashboard (For Admin Users)**
   - Manage products: Add, update, and delete products.
   - View orders placed by users and manage their statuses.
   - User management functionality for admin users.

## Project Structure
📦project-root
┣ 📂public # Public assets (e.g., images, icons)
┣ 📂src # Source code
┃ ┣ 📂assets # Static assets like images and fonts
┃ ┣ 📂components # Reusable UI components (buttons, cards, etc.)
┃ ┣ 📂hooks # Custom hooks for business logic
┃ ┣ 📂pages # Different pages like Home, Cart, Admin
┃ ┣ 📂redux # Redux slices for managing global state
┃ ┣ 📂services # API communication using Axios
┃ ┣ 📂styles # Custom CSS and Tailwind configurations
┃ ┣ 📂utils # Utility functions and helpers
┃ ┣ App.tsx # Main application component
┃ ┗ index.tsx # Entry point for React application
┣ 📜package.json # Project dependencies and scripts
┣ 📜README.md # Project documentation
┣ .env # Environment variables
┗ tailwind.config.js # Tailwind CSS configuration file

## Contributing

We welcome contributions to enhance this project!

1. Fork the repository
2. Create a branch for your feature:
   ```bash
   git checkout -b feature-name
    ```
3. Commit your changes
    ```bash
    git commit -m 'Add new feature'
    ```
4.  Push your feature
    ```bash
    git push origin feature-name
    ```

## Contact

For questions or feedback, contact:

- **Name**: Joy Chandra Uday
- **Email**: joychandrauda@gmail.com
- **Website**: [https://joychandrauday.web.app/](https://joychandrauday.web.app/)
