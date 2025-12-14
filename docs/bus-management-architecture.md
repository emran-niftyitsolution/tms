# Bus Management System - Architecture & Flow Design

## 1. SYSTEM ARCHITECTURE

### 1.1 Data Model Hierarchy
```
Company
  ├── Bus (Fleet)
  │   ├── Maintenance Records
  │   ├── Assignments (Driver/Helper)
  │   ├── Expenses
  │   └── Schedules
  ├── Route
  │   └── Stoppages
  ├── Schedule
  │   ├── Bus Reference
  │   └── Route Reference
  └── Staff
      └── Assignments
```

### 1.2 Core Entities & Relationships
- **Bus**: Central entity, linked to Company, Routes (via Schedules), Staff (via Assignments)
- **Route**: Defines travel paths, contains Stoppages
- **Schedule**: Links Bus + Route + Time, creates bookable trips
- **Maintenance**: Tracks service history per Bus
- **Assignment**: Links Bus + Staff (Driver/Helper) + Route
- **Expense**: Financial tracking per Bus

### 1.3 User Flows

#### Flow 1: Bus Onboarding
1. Register Bus → Basic Info (Number, Type, Capacity)
2. Add Details → Brand, Model, Registration
3. Upload Documents → Fitness, Insurance, Tax Token
4. Configure Facilities → WiFi, AC, etc.
5. Set Status → Active/Inactive

#### Flow 2: Route & Schedule Creation
1. Create Route → From/To, Stoppages
2. Create Schedule → Assign Bus + Route + Time + Price
3. Assign Staff → Driver + Helper to Schedule
4. Publish → Make available for booking

#### Flow 3: Operations Management
1. View Dashboard → Fleet status, upcoming maintenance
2. Assign Driver → Link staff to bus/route
3. Track Expenses → Fuel, tolls, maintenance
4. Monitor Status → Active trips, maintenance due

#### Flow 4: Maintenance Workflow
1. Schedule Maintenance → Type, date, cost estimate
2. Track Progress → Status updates
3. Record Completion → Actual cost, next service date
4. Alert System → Expiring documents, due services

## 2. COMPONENT ARCHITECTURE

### 2.1 Shared Components
- `BusCard` - Bus summary card
- `StatusBadge` - Status indicators
- `DocumentExpiryAlert` - Document warnings
- `FilterBar` - Reusable filter component
- `DataTable` - Enhanced table with actions

### 2.2 Feature Components
- `BusForm` - Create/Edit bus form
- `MaintenanceHistory` - Maintenance list/table
- `AssignmentManager` - Driver assignment interface
- `ExpenseTracker` - Expense list/forms
- `BusDashboard` - Overview cards and stats

### 2.3 Page Structure
```
/dashboard/buses
  ├── / (List with filters)
  ├── /new (Create form - multi-step)
  ├── /[id] (Detail page with tabs)
  │   ├── Overview Tab
  │   ├── Maintenance Tab
  │   ├── Assignments Tab
  │   ├── Expenses Tab
  │   └── Schedules Tab
  └── /analytics (Fleet analytics)
```

## 3. DATA FLOW

### 3.1 Bus Creation Flow
```
User Input → Validation → API Call → Database → Response → UI Update
```

### 3.2 Real-time Updates
- Status changes propagate to all related entities
- Document expiry triggers alerts
- Maintenance due dates update bus status

## 4. UI/UX DESIGN PRINCIPLES

### 4.1 Information Hierarchy
1. **Primary**: Bus number, status, company
2. **Secondary**: Type, capacity, documents
3. **Tertiary**: Maintenance history, expenses

### 4.2 Action Priorities
1. **Quick Actions**: Edit, View Details
2. **Context Actions**: Add Maintenance, Assign Driver
3. **Bulk Actions**: Export, Bulk Status Update

### 4.3 Visual Indicators
- Color-coded status badges
- Document expiry warnings
- Maintenance due alerts
- Capacity utilization indicators

## 5. API DESIGN

### 5.1 Endpoint Structure
```
GET    /api/buses              - List with filters
POST   /api/buses              - Create
GET    /api/buses/:id          - Detail
PUT    /api/buses/:id          - Update
DELETE /api/buses/:id          - Delete
GET    /api/buses/:id/stats    - Analytics
```

### 5.2 Query Parameters
- `?status=Active`
- `?company=companyId`
- `?type=AC`
- `?search=busNumber`

## 6. STATE MANAGEMENT

### 6.1 Local State
- Form inputs
- Modal visibility
- Tab selection
- Filter values

### 6.2 Server State
- Bus list (with caching)
- Bus details (fetch on demand)
- Related data (maintenance, expenses)

## 7. ERROR HANDLING

### 7.1 Validation
- Client-side: Immediate feedback
- Server-side: API error responses
- Display: Toast notifications

### 7.2 Edge Cases
- Missing documents
- Overlapping assignments
- Maintenance conflicts
- Expense validation


