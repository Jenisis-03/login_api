Developed an API for email-based OTP login, utilizing Swagger UI for documentation and MySQL for database management.
TIMELINE 
20/5/25:
The API implements a secure authentication system using email-based OTP verification. The system is built with Node.js, Express, and MySQL, featuring Swagger documentation for easy API testing. The API handles user authentication through a two-step process. First, users register with their email and profile details, receiving an OTP via email. Upon successful OTP verification, they receive a JWT token for accessing protected routes .The API provides email-based OTP authentication, JWT token generation, and profile management. Users can register, verify their email through OTP, login, and manage their profiles. The system includes rate limiting and OTP expiration for security. The API endpoints are documented using Swagger UI. Providing an interactive documentation for testing endpoints directly and view request/response schemas.

Date: 21/05/25:
Implemented role-based access control by modifying the existing API to include user roles (admin/user). Created a new migration file for adding the role field to the Users table and implemented a role check middleware for protecting admin-only routes. The authentication flow was updated to handle role-based signup and user creation. Same time enhanced the Swagger documentation to reflect these changes, adding new endpoints for admin operations and updating the API schemas to include role-based parameters, by making necessary Changes
Also Created (Working) On the API audit log Table for storing the request and the response
of the API when called and the Operation is Initiated during the flow.
the table contains data with timestamp in the JSON format ( trying to store it in the JSON format) and Also show the same on the Swagger UI.
