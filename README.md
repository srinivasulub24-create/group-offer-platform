# Group Offer Platform

A backend platform that enables users to unlock discounts through collaborative group participation. Users join groups, unlock offers when participation thresholds are reached, and receive redeemable coupons.

## Features

- User Registration & Login
- JWT Authentication
- Role-Based Access Control (RBAC)
- Store Management
- Offer Management
- Group Creation & Joining
- Offer Unlock Engine
- Coupon Generation
- Coupon Retrieval
- Coupon Redemption

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Roles

### CUSTOMER
- Join groups
- View offers
- Retrieve coupons
- Redeem coupons

### STORE_OWNER
- Create stores
- Create offers
- Manage store-related operations

### ADMIN
- System-level access
- Manage platform operations

## Project Architecture

```text
User
 ↓
Authentication (JWT)
 ↓
Store
 ↓
Offer
 ↓
Group
 ↓
Contribution
 ↓
Unlock Engine
 ↓
Coupon Generation
 ↓
Coupon Redemption
```

## API Modules

- Auth APIs
- Store APIs
- Offer APIs
- Group APIs
- Contribution APIs
- Coupon APIs

## Future Enhancements

- Smart Group Matching
- Swagger API Documentation
- Docker Support
- Payment Gateway Integration
- Frontend Application
- Real-time Notifications

## Author

Banavath Srinivasulu

GitHub:
https://github.com/srinivasulub24-create

Linked Project:
https://github.com/srinivasulub24-create/group-offer-platform
