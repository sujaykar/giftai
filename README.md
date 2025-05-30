# GIFT AI - AI-Powered Gift Recommendation Platform

![GIFT AI Logo](generated-icon.png)

## 🎁 Overview

GIFT AI is a cutting-edge gift recommendation platform that leverages artificial intelligence to transform gift selection through intelligent matching and personalized suggestions. The platform combines advanced machine learning algorithms, collaborative filtering, and AI-powered relationship analysis to provide thoughtful, personalized gift recommendations.

**Live Application:** https://giftsai.com  
**Status:** Production Ready - Deployed on AWS Amplify  
**Backend:** AWS Lambda + API Gateway + PostgreSQL  
**AI Engine:** OpenAI GPT-4o

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Services   │
│   (React)       │◄──►│   (Express)     │◄──►│   (OpenAI/ML)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐               │
         │              │   PostgreSQL    │               │
         │              │   Database      │               │
         │              └─────────────────┘               │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SendGrid      │    │   Session       │    │   External      │
│   Email Service │    │   Storage       │    │   Product APIs  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
gift-ai/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── ui/            # shadcn/ui Components
│   │   │   ├── Header.tsx     # Main Navigation Header
│   │   │   └── RecipientQuiz.tsx # Preference Collection Component
│   │   ├── pages/             # Application Pages
│   │   │   ├── dashboard.tsx   # User Dashboard
│   │   │   ├── recipients/     # Recipient Management
│   │   │   ├── recommendations.tsx # AI Recommendations
│   │   │   ├── how-it-works.tsx   # Onboarding Carousel
│   │   │   └── not-found.tsx   # 404 Page
│   │   ├── hooks/             # Custom React Hooks
│   │   │   └── useAuth.ts     # Authentication Hook
│   │   ├── lib/               # Utility Libraries
│   │   │   ├── queryClient.ts # TanStack Query Config
│   │   │   └── utils.ts       # Helper Functions
│   │   ├── App.tsx           # Main Application Component
│   │   ├── main.tsx          # Application Entry Point
│   │   └── index.css         # Global Styles
│   └── index.html            # HTML Template
├── server/                    # Backend Express Application
│   ├── controllers/          # API Route Controllers
│   │   ├── auth-controller.ts       # Authentication Logic
│   │   ├── recipient-controller.ts  # Recipient Management
│   │   ├── recommendation-controller.ts # AI Recommendations
│   │   ├── product-controller.ts    # Product Management
│   │   ├── hybrid-recommendation-controller.ts # ML Algorithms
│   │   ├── relationship-gift-controller.ts # Relationship Analysis
│   │   ├── product-scraper-controller.ts # Web Scraping
│   │   └── feedback-controller.ts   # User Feedback System
│   ├── services/             # Business Logic Services
│   │   ├── email-service.ts         # SendGrid Integration
│   │   ├── recommendation-service.ts # Core Recommendation Engine
│   │   ├── collaborative-filtering-service.ts # User Similarity
│   │   ├── product-classification-service.ts # AI Product Analysis
│   │   ├── reinforcement-learning-service.ts # Learning System
│   │   ├── hybrid-recommendation-service.ts # Combined Algorithms
│   │   ├── openai-service.ts        # OpenAI Integration
│   │   └── verification-service.ts  # Email Verification
│   ├── middleware/           # Express Middleware
│   │   ├── admin-auth.ts     # Admin Authentication
│   │   └── api-key-auth.ts   # API Key Validation
│   ├── config/               # Configuration Files
│   │   └── passport.ts       # Authentication Strategies
│   ├── utils/                # Utility Functions
│   │   ├── auth.ts           # Auth Helpers
│   │   ├── encryption.ts     # Data Encryption
│   │   └── password-utils.ts # Password Hashing
│   ├── scripts/              # Database Scripts
│   ├── index.ts              # Server Entry Point
│   ├── routes.ts             # API Route Definitions
│   ├── storage.ts            # Data Access Layer
│   ├── vite.ts               # Development Server
│   └── db.ts                 # Database Configuration
├── shared/                   # Shared TypeScript Types
│   └── schema.ts             # Database Schema & Types
├── types/                    # TypeScript Declarations
├── attached_assets/          # Documentation Assets
├── admin/                    # Admin Panel (Future)
└── Configuration Files
    ├── package.json          # Dependencies & Scripts
    ├── tsconfig.json         # TypeScript Configuration
    ├── tailwind.config.ts    # Tailwind CSS Configuration
    ├── vite.config.ts        # Vite Build Configuration
    ├── drizzle.config.ts     # Database Migration Configuration
    └── components.json       # shadcn/ui Configuration
```

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **TanStack Query (React Query)** - Data fetching and caching
- **Wouter** - Lightweight React router
- **React Hook Form** - Performant form library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **bcrypt** - Password hashing
- **crypto** - Data encryption

### AI & Machine Learning
- **OpenAI GPT-4** - Natural language processing and relationship analysis
- **Custom ML Algorithms**:
  - Collaborative Filtering (Jaccard Similarity)
  - Content-Based Filtering
  - Hybrid Recommendation System
  - Reinforcement Learning for preference optimization
  - Product Classification AI

### External Services
- **SendGrid** - Email delivery service
- **Google OAuth 2.0** - Social authentication
- **Facebook OAuth** - Social authentication
- **Apple OAuth** - Social authentication

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Drizzle Kit** - Database migration tool

## 🗄️ Database Schema

### Core Tables

#### Users
```sql
users {
  id: SERIAL PRIMARY KEY
  email: VARCHAR UNIQUE (encrypted)
  password: VARCHAR (hashed)
  firstName: VARCHAR (encrypted)
  lastName: VARCHAR (encrypted)
  phone: VARCHAR (encrypted, optional)
  profileImageUrl: VARCHAR
  isVerified: BOOLEAN
  verificationToken: VARCHAR
  verificationTokenExpiry: TIMESTAMP
  googleId: VARCHAR (optional)
  facebookId: VARCHAR (optional)
  appleId: VARCHAR (optional)
  role: ENUM('user', 'admin')
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
  lastLogin: TIMESTAMP
}
```

#### Recipients
```sql
recipients {
  id: SERIAL PRIMARY KEY
  uuid: VARCHAR UNIQUE
  userId: INTEGER → users.id
  name: VARCHAR
  relationship: VARCHAR
  age: INTEGER
  gender: VARCHAR
  interests: TEXT[]
  personalityTraits: TEXT[]
  occasion: VARCHAR
  budget: DECIMAL
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

#### Products
```sql
products {
  id: SERIAL PRIMARY KEY
  uuid: VARCHAR UNIQUE
  name: VARCHAR
  description: TEXT
  price: DECIMAL
  currency: VARCHAR
  category: VARCHAR
  subcategory: VARCHAR
  tags: TEXT[]
  imageUrl: VARCHAR
  purchaseUrl: VARCHAR
  vendor: VARCHAR
  rating: DECIMAL
  reviewCount: INTEGER
  availability: VARCHAR
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

#### Recommendations
```sql
recommendations {
  id: SERIAL PRIMARY KEY
  uuid: VARCHAR UNIQUE
  userId: INTEGER → users.id
  recipientId: INTEGER → recipients.id
  productId: INTEGER → products.id
  score: DECIMAL (0-1)
  reasoning: TEXT
  algorithm: VARCHAR
  metadata: JSONB
  createdAt: TIMESTAMP
}
```

### Machine Learning Tables

#### User Similarity
```sql
user_similarity {
  id: SERIAL PRIMARY KEY
  userId: INTEGER → users.id
  similarUserId: INTEGER → users.id
  similarityScore: DECIMAL (0-1)
  algorithm: VARCHAR
  calculatedAt: TIMESTAMP
}
```

#### User Feedback
```sql
user_feedback {
  id: SERIAL PRIMARY KEY
  userId: INTEGER → users.id
  productId: INTEGER → products.id
  recommendationId: INTEGER → recommendations.id
  feedbackType: VARCHAR ('like', 'dislike', 'purchase', 'view')
  rating: INTEGER (1-5)
  reason: VARCHAR
  createdAt: TIMESTAMP
}
```

#### Product Classification
```sql
product_classification {
  id: SERIAL PRIMARY KEY
  productId: INTEGER → products.id
  sentimentScore: DECIMAL (-1 to 1)
  practicalityScore: DECIMAL (0-1)
  uniquenessScore: DECIMAL (0-1)
  personalityFit: TEXT[]
  relationshipAppropriateFor: TEXT[]
  occasionSuitability: TEXT[]
  ageGroupSuitability: TEXT[]
  createdAt: TIMESTAMP
}
```

## 🤖 AI & Machine Learning Architecture

### 1. Hybrid Recommendation System

The platform uses a sophisticated hybrid approach combining multiple algorithms:

#### Content-Based Filtering
- Analyzes product features, categories, and attributes
- Matches with recipient preferences and interests
- Uses TF-IDF for text similarity matching

#### Collaborative Filtering
- Implements Jaccard Similarity for user-based recommendations
- Finds users with similar taste profiles
- Recommends products liked by similar users

#### AI-Powered Analysis
- OpenAI GPT-4 for relationship context understanding
- Natural language processing of product descriptions
- Personality-based gift matching

### 2. Machine Learning Pipeline

```
User Input → Preference Analysis → Similarity Calculation → AI Enhancement → Ranking → Recommendations
```

#### Reinforcement Learning
- Learns from user feedback (likes, dislikes, purchases)
- Adjusts recommendation weights based on success rates
- Improves algorithm performance over time

#### Product Classification
- AI analyzes products for:
  - Sentiment (romantic, practical, fun, etc.)
  - Uniqueness score
  - Relationship appropriateness
  - Personality fit assessment

### 3. Recommendation Scoring

Each recommendation receives a composite score from:
- **Content Match** (40%): Product-preference alignment
- **Collaborative Score** (30%): Similar user preferences
- **AI Context** (20%): Relationship and occasion analysis
- **Feedback Learning** (10%): Historical user behavior

## 🔐 Authentication & Security

### Multi-Provider Authentication
- **Google OAuth 2.0**: Secure social login
- **Facebook OAuth**: Alternative social authentication
- **Apple OAuth**: iOS-optimized authentication
- **Email/Password**: Traditional registration with verification

### Security Features
- **Data Encryption**: All PII encrypted at rest using AES-256
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Email Verification**: SendGrid-powered verification flow
- **CSRF Protection**: Built-in Express security
- **Input Validation**: Zod schema validation

### Data Privacy
- All personally identifiable information encrypted
- Secure key management
- GDPR-compliant data handling
- User data anonymization options

## 📧 Email Integration (SendGrid)

### Email Services
- **Verification Emails**: Beautiful HTML templates for account verification
- **Welcome Emails**: Onboarding email sequence
- **Recommendation Notifications**: Personalized gift suggestions
- **Password Reset**: Secure password recovery flow

### Email Templates
- Responsive HTML design
- GIFT AI branding
- Professional styling with Tailwind CSS
- Plain text fallbacks

## 🚀 API Endpoints

### Authentication Endpoints
```
POST /api/auth/register          # User registration
POST /api/auth/login             # Email/password login
POST /api/auth/logout            # User logout
GET  /api/auth/current-user      # Get current user
GET  /api/auth/verify-email      # Email verification
GET  /api/auth/google           # Google OAuth
GET  /api/auth/facebook         # Facebook OAuth
GET  /api/auth/apple            # Apple OAuth
```

### Recipient Management
```
GET    /api/recipients          # Get user recipients
POST   /api/recipients          # Create new recipient
GET    /api/recipients/:id      # Get specific recipient
PUT    /api/recipients/:id      # Update recipient
DELETE /api/recipients/:id      # Delete recipient
```

### Recommendation Engine
```
GET  /api/recommendations                    # Get user recommendations
POST /api/recommendations/generate           # Generate new recommendations
GET  /api/recommendations/hybrid/:recipientId # Hybrid algorithm recommendations
POST /api/recommendations/relationship       # Relationship-based recommendations
POST /api/recommendations/feedback           # Submit user feedback
```

### Product Management
```
GET    /api/products            # Search products
GET    /api/products/:id        # Get product details
POST   /api/products            # Add new product (admin)
PUT    /api/products/:id        # Update product (admin)
DELETE /api/products/:id        # Delete product (admin)
```

## 🧪 Development Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- SendGrid API key
- Google OAuth credentials
- OpenAI API key

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/giftai
PGHOST=localhost
PGPORT=5432
PGUSER=giftai_user
PGPASSWORD=your_password
PGDATABASE=giftai

# Authentication
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@giftai.com

# AI Services
OPENAI_API_KEY=your-openai-api-key

# Application
BASE_URL=http://localhost:5000
NODE_ENV=development
```

### Installation & Setup
```bash
# Clone repository
git clone <repository-url>
cd gift-ai

# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

### Database Management
```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:migrate   # Run migrations
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev          # Start both frontend and backend
```

### Production Build
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Testing
```bash
npm test            # Run test suite
npm run test:watch  # Run tests in watch mode
```

## 🎨 Frontend Architecture

### Component Structure
```
components/
├── ui/                    # Base UI Components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── form.tsx
├── Header.tsx             # Navigation & User Menu
├── RecipientQuiz.tsx      # Preference Collection
└── FeatureComponents/     # Feature-specific components
```

### State Management
- **TanStack Query**: Server state management and caching
- **React Hooks**: Local component state
- **Context API**: Authentication state
- **Wouter**: Client-side routing

### Styling Approach
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Consistent component design system
- **CSS Variables**: Theme customization
- **Responsive Design**: Mobile-first approach

## 🖥️ Backend Architecture

### Service Layer Pattern
```
Controllers → Services → Storage → Database
```

### Key Services

#### Recommendation Service
- Core recommendation logic
- Algorithm orchestration
- Result ranking and filtering

#### Email Service
- SendGrid integration
- Template management
- Delivery tracking

#### Authentication Service
- Multi-provider OAuth
- Session management
- Security validation

### Data Access Layer
- **Drizzle ORM**: Type-safe database queries
- **Connection Pooling**: Optimized database performance
- **Migration Management**: Version-controlled schema changes

## 🤖 Machine Learning Components

### Recommendation Algorithms

#### 1. Content-Based Filtering
```typescript
// Matches products to recipient preferences
const contentScore = calculateContentSimilarity(
  product.features,
  recipient.preferences
);
```

#### 2. Collaborative Filtering
```typescript
// Finds similar users using Jaccard similarity
const jaccardSimilarity = (userA, userB) => {
  const intersection = userA.filter(x => userB.includes(x));
  const union = [...new Set([...userA, ...userB])];
  return intersection.length / union.length;
};
```

#### 3. AI Enhancement
```typescript
// OpenAI analysis for relationship context
const aiAnalysis = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{
    role: "system",
    content: "Analyze gift appropriateness for relationship..."
  }]
});
```

### Learning System
- **Feedback Loop**: User actions improve recommendations
- **A/B Testing**: Algorithm performance comparison
- **Performance Metrics**: Success rate tracking

## 📊 Performance & Optimization

### Frontend Optimization
- **Code Splitting**: Lazy-loaded route components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Minimized JavaScript bundles
- **Caching Strategy**: Service worker implementation

### Backend Optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis for frequently accessed data
- **API Rate Limiting**: Protection against abuse

### Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Behavior tracking
- **ML Model Performance**: Recommendation accuracy metrics

## 🚢 Deployment

### Production Environment
- **Platform**: AWS/Replit Deployments
- **Database**: PostgreSQL RDS
- **CDN**: CloudFront for static assets
- **SSL**: TLS encryption
- **Monitoring**: CloudWatch logs

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Code commit
- Automated testing
- Build optimization
- Deployment to staging
- Production deployment
```

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: User flow testing
- **E2E Tests**: Cypress for critical paths
- **Accessibility Tests**: WCAG compliance

### Backend Testing
- **Unit Tests**: Service and controller testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Schema and query testing
- **Load Tests**: Performance under stress

## 📈 Analytics & Metrics

### Business Metrics
- User engagement rates
- Recommendation click-through rates
- Purchase conversion rates
- User retention statistics

### Technical Metrics
- API response times
- Database query performance
- Error rates and types
- ML model accuracy scores

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: React Native implementation
- **Voice Interface**: Alexa/Google Assistant integration
- **Advanced ML**: Deep learning recommendation models
- **Social Features**: Gift sharing and wishlists
- **Enterprise API**: B2B gift recommendation service

### Scalability Improvements
- **Microservices**: Service decomposition
- **Kubernetes**: Container orchestration
- **GraphQL**: Flexible API queries
- **Real-time Features**: WebSocket integration

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Code review process
6. Merge to main branch

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team & Support

### Development Team
- **Frontend**: React/TypeScript specialists
- **Backend**: Node.js/Express developers
- **AI/ML**: Machine learning engineers
- **DevOps**: Infrastructure and deployment

### Contact
- **Technical Support**: [support@giftai.com]
- **Business Inquiries**: [business@giftai.com]
- **Documentation**: [docs.giftai.com]

---

**GIFT AI** - Transforming gift-giving through artificial intelligence 🎁✨