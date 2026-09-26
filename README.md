# BookMySeat — Distributed Event Ticket Booking Platform

BookMySeat is a full-stack, microservices-based online ticket booking platform that allows users to discover events, view shows and seat availability, reserve seats, complete payments, and receive booking notifications.

The platform is designed around independently deployable services and uses an API Gateway, service discovery, synchronous service-to-service communication, event-driven messaging, distributed seat locking, payment processing, and search indexing.

## Overview

BookMySeat provides an end-to-end ticket booking workflow:

```text
User
 |
 v
React Frontend
 |
 v
API Gateway
 |
 +-------------------+-------------------+
 |                   |                   |
 v                   v                   v
User Service    Event Service      Payment Service
 |                   |                   |
 |                   |                   |
 |                   v                   v
 |                 Redis              Stripe
 |                   |
 |                   v
 |                 Kafka
 |                   |
 |          +--------+--------+
 |          |                 |
 v          v                 v
MySQL   Notification      Search Service
            Service             |
               |                v
               v          Elasticsearch
              Email
```

## Key Features

### User Authentication

* User registration and profile management
* Login and authentication through the API Gateway
* Google OAuth2 integration
* Protected routes and session-based authentication
* Secure HTTP-only session cookies
* User information managed through a dedicated User Service

### Event and Show Management

The Event Service manages the core event-booking domain.

* Event management
* Venue management
* Screen management
* Show management
* Seat management
* Show-specific seat availability
* Show pricing
* Ticket generation
* Event and show retrieval

### Seat Booking and Distributed Locking

BookMySeat implements Redis-based seat locking to prevent multiple users from attempting to reserve the same seat simultaneously.

The booking flow uses temporary seat locks before payment confirmation:

```text
User selects seats
       |
       v
Check seat availability
       |
       v
Acquire Redis seat lock
       |
       v
Create payment session
       |
       v
Complete payment
       |
       v
Confirm booking
       |
       v
Generate ticket
       |
       v
Release / expire temporary lock
```

This approach helps coordinate seat reservations across multiple service instances.

### Payment Processing

The Payment Service handles the payment workflow using Stripe.

* Create payment sessions
* Process booking payment information
* Handle Stripe webhook events
* Track booking payment status
* Communicate with the Event Service
* Confirm seats after successful payment

Stripe webhook events are processed separately from normal checkout requests so payment confirmation can be handled asynchronously.

### Event-Driven Notifications

BookMySeat uses Apache Kafka for asynchronous communication between services.

The Notification Service consumes booking-related events and handles email notifications.

```text
Event / Booking Service
          |
          v
        Kafka
          |
          v
Notification Service
          |
          v
        Email
```

This decouples notification processing from the main booking workflow.

### Search and Event Indexing

The Search Service consumes Kafka events and maintains searchable event data in Elasticsearch.

```text
Event Service
     |
     v
   Kafka
     |
     v
Search Service
     |
     v
Elasticsearch
```

This enables a dedicated search layer without tightly coupling search operations to the transactional Event Service database.

### Change Data Capture

The project includes Debezium and Kafka infrastructure for database change-data-capture workflows.

```text
MySQL
  |
  v
Debezium
  |
  v
Kafka
  |
  v
Downstream Services
```

Debezium Connect is included in the Docker Compose infrastructure alongside Kafka and ZooKeeper.

## Architecture

BookMySeat follows a distributed microservices architecture.

### API Gateway

The API Gateway acts as the primary entry point for client requests.

Responsibilities include:

* Routing requests to backend services
* Service discovery integration
* Load balancing
* Authentication and security
* OAuth2 client integration
* Session and cookie management
* Gateway actuator endpoints

The gateway uses Spring Cloud Gateway and Eureka service discovery.

### Service Registry

The Service Registry provides service discovery using Netflix Eureka.

Backend services register themselves with Eureka, allowing services to communicate using service discovery instead of relying entirely on hard-coded service locations.

### User Service

Responsible for:

* User registration
* User profiles
* User persistence
* User-related APIs

Technology:

* Spring Boot
* Spring Data JPA
* MySQL
* Eureka Client

### Event Service

Responsible for the primary ticket-booking domain:

* Events
* Venues
* Screens
* Shows
* Seats
* Pricing
* Ticket generation
* Seat locking

Technology:

* Spring Boot
* Spring Data JPA
* MySQL
* Redis
* Apache Kafka
* OpenFeign
* Eureka

### Payment Service

Responsible for payment processing and booking payment state.

Technology:

* Spring Boot
* Stripe
* Spring Data JPA
* MySQL
* OpenFeign
* Eureka

### Notification Service

Responsible for sending email notifications generated from asynchronous events.

Technology:

* Spring Boot
* Apache Kafka
* Spring Mail
* Spring Data JPA
* MySQL
* Eureka

### Search Service

Responsible for consuming event-related messages and indexing searchable data.

Technology:

* Spring Boot
* Apache Kafka
* Elasticsearch
* OpenFeign
* Eureka

## Technology Stack

### Frontend

* React 19
* Vite
* React Router
* Tailwind CSS
* JavaScript
* React Hot Toast
* React Toastify
* React Icons
* Motion

### Backend

* Java 21
* Spring Boot 4.1.1
* Spring MVC
* Spring Data JPA
* Hibernate
* Spring Security
* Spring Cloud Gateway
* Spring Cloud Netflix Eureka
* Spring Cloud OpenFeign
* Lombok

### Databases and Storage

* MySQL
* Redis
* Elasticsearch

### Messaging and Event Streaming

* Apache Kafka
* Apache ZooKeeper
* Debezium

### Payment

* Stripe

### Infrastructure

* Docker
* Docker Compose

## Microservices

| Service              | Responsibility                                               |
| -------------------- | ------------------------------------------------------------ |
| API Gateway          | Central entry point, routing, security and authentication    |
| Service Registry     | Service discovery using Eureka                               |
| User Service         | User registration, profiles and user data                    |
| Event Service        | Events, shows, venues, screens, seats and booking operations |
| Payment Service      | Stripe payment processing and payment state                  |
| Notification Service | Kafka-based email notifications                              |
| Search Service       | Kafka-based indexing and Elasticsearch search                |
| React Frontend       | User-facing booking interface                                |

## Infrastructure

The repository includes a Docker Compose configuration for the supporting infrastructure.

Current infrastructure includes:

```text
+----------------+
|   ZooKeeper    |
+-------+--------+
        |
        v
+----------------+
|     Kafka      |
+---+---------+--+
    |         |
    v         v
Debezium   Services
    |
    v
Database CDC


+----------------+
| Elasticsearch  |
+----------------+
```

The Docker Compose configuration currently provisions:

* ZooKeeper
* Apache Kafka
* Debezium Connect
* Elasticsearch

Kafka is exposed on port `9092`, Debezium Connect on `8888`, and Elasticsearch on `9200`.

## Project Structure

```text
BookMySeat/
│
├── api-gateway/
│   └── Spring Cloud Gateway
│
├── user_service/
│   └── User management service
│
├── event-service/
│   └── Event, show, seat and ticket management
│
├── payment-service/
│   └── Stripe payment processing
│
├── notification-service/
│   └── Email notification processing
│
├── search-service/
│   └── Kafka consumer and Elasticsearch indexing
│
├── service-registry/
│   └── Eureka service registry
│
├── BookMySeat-frontend/
│   └── React + Vite frontend
│
└── docker-compose.yml
    └── Kafka, ZooKeeper, Debezium and Elasticsearch
```

## Service Communication

BookMySeat uses multiple communication patterns depending on the use case.

### Synchronous Communication

OpenFeign is used for service-to-service HTTP communication.

```text
Service A
   |
   | HTTP / OpenFeign
   v
Service B
```

### Asynchronous Communication

Kafka is used for event-driven communication.

```text
Producer
   |
   v
Kafka Topic
   |
   v
Consumer
```

This allows operations such as notifications and search indexing to be processed independently from the main request flow.

## Booking Workflow

A typical booking workflow follows these stages:

```text
1. User logs in
        |
        v
2. Browse events
        |
        v
3. Select event and show
        |
        v
4. Retrieve available seats
        |
        v
5. Select seats
        |
        v
6. Temporarily lock seats in Redis
        |
        v
7. Create Stripe payment session
        |
        v
8. Complete payment
        |
        v
9. Receive payment confirmation
        |
        v
10. Confirm booking
        |
        v
11. Generate ticket
        |
        v
12. Publish notification event
        |
        v
13. Send confirmation email
```

## Redis Seat Locking

One of the important parts of the system is temporary seat reservation.

When a user selects a seat, the Event Service attempts to create a temporary Redis key for that seat.

```text
seat:booking:<showId>:<seatId>
```

The key contains a temporary booking token and expires after a configured period.

Conceptually:

```text
User A
  |
  | Select Seat A1
  v
Redis
  |
  | SET IF ABSENT
  v
Seat A1 Locked
  |
  +----> Payment Successful
  |            |
  |            v
  |       Confirm Booking
  |
  +----> Payment Failed / Timeout
               |
               v
          Lock Expires
```

This provides a distributed locking mechanism for concurrent seat-booking requests.

## Search Architecture

The Search Service maintains an Elasticsearch-based search layer.

```text
Event Service
      |
      | Event
      v
    Kafka
      |
      v
Search Service
      |
      v
Elasticsearch
```

This separates transactional operations from search workloads and allows Elasticsearch to maintain a dedicated searchable representation of event data.

## Getting Started

### Prerequisites

Install the following:

* Java 21
* Maven
* Node.js and npm
* Docker Desktop
* MySQL
* Git

You will also need:

* GitHub repository access
* Google OAuth credentials if using Google login
* Stripe API credentials
* Email service credentials

### Clone the Repository

```bash
git clone https://github.com/AniketMatte21/BookMySeat.git

cd BookMySeat
```

### Start Infrastructure

Start the Docker-based infrastructure:

```bash
docker compose up -d
```

This starts the Kafka, ZooKeeper, Debezium and Elasticsearch containers defined in the project configuration.

### Configure Backend Services

The services use environment/property placeholders for configuration.

Examples include:

```text
server-port
eureka-server-url
jdbc-url
datasource-username
datasource-password
redis-host
redis-port
kafka-server
elastic-search-url
frontend-url
backend-url
```

Configure these values according to your local environment before starting the services.

Do not commit credentials, API keys, OAuth secrets or payment secrets to GitHub.

### Start the Service Registry

Navigate to:

```bash
cd service-registry
```

Run:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

### Start Backend Services

Each service is an independent Spring Boot application.

For example:

```bash
cd user_service
mvnw.cmd spring-boot:run
```

Similarly start:

```text
api-gateway
event-service
payment-service
notification-service
search-service
```

### Start the Frontend

Navigate to:

```bash
cd BookMySeat-frontend/bookmyseat
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend is built with React and Vite.

## Environment Configuration

The application is designed to keep environment-specific configuration outside the source code.

Typical configuration categories include:

### Database

```text
JDBC URL
Database username
Database password
```

### Service Discovery

```text
Eureka server URL
```

### Redis

```text
Redis host
Redis port
```

### Kafka

```text
Kafka bootstrap server
```

### Elasticsearch

```text
Elasticsearch URL
```

### Authentication

```text
Google OAuth Client ID
Google OAuth Client Secret
Session configuration
```

### Payment

```text
Stripe API credentials
Stripe webhook configuration
```

## Security Considerations

The project separates authentication, gateway access and service responsibilities across the microservices architecture.

Important security practices when running the project:

* Never commit OAuth credentials
* Never commit Stripe secret keys
* Never commit database passwords
* Never commit encryption keys
* Store environment-specific secrets outside Git
* Use HTTPS when deploying authentication and payment flows
* Configure secure cookies appropriately for production

## Development Highlights

This project demonstrates practical implementation of:

* Microservices architecture
* API Gateway pattern
* Service discovery
* REST APIs
* Inter-service communication
* OpenFeign
* Distributed seat locking
* Redis
* Event-driven architecture
* Apache Kafka
* Database change-data-capture
* Debezium
* Elasticsearch
* Stripe payment integration
* OAuth2 authentication
* Email notifications
* React frontend
* Docker-based infrastructure

## Future Improvements

Potential improvements include:

* Centralized configuration using Spring Cloud Config
* Distributed tracing with OpenTelemetry
* Centralized logging
* Resilience patterns using circuit breakers
* Improved API documentation
* Automated CI/CD pipelines
* Kubernetes deployment
* Improved observability and monitoring
* Automated integration testing across services
* Horizontal scaling of booking services

## Author

**Aniket Matte**

Computer Engineering
Sinhgad Institute of Technology and Science, Pune

GitHub: [AniketMatte21](https://github.com/AniketMatte21)

## License

This project is currently provided for educational and portfolio purposes.

---

## Project Status

BookMySeat is an actively developed full-stack microservices project focused on implementing real-world distributed-system concepts in an online ticket booking workflow.


## Complete Architecture

<img width="1536" height="1024" alt="ChatGPT Image Sep 26, 2026, 01_20_05 PM" src="https://github.com/user-attachments/assets/8b279cd7-962c-4f24-a2ce-b29f5456d986" />
