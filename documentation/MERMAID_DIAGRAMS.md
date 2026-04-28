# Campus Connect - Mermaid Diagrams

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph "Mobile App (Flutter)"
        A[Citizen App] --> B[Department App]
        B --> C[Admin Dashboard]
    end
    
    subgraph "Frontend Services"
        D[State Management<br/>Riverpod]
        E[Local Caching<br/>SharedPreferences]
        F[Image Compression]
        G[Local Notifications]
    end
    
    subgraph "Backend API (Node.js/Express)"
        H[REST API Server]
        I[Authentication Service]
        J[Grievance Service]
        K[AI Service]
        L[Route Optimization]
    end
    
    subgraph "AI & ML Services"
        M[Google Gemini AI<br/>Image Analysis]
        N[LangChain<br/>Orchestration]
        O[Problem Classification]
    end
    
    subgraph "Database & Storage"
        P[Firebase Firestore<br/>Real-time Database]
        Q[Firebase Storage<br/>Image Storage]
        R[Firebase Auth<br/>User Management]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    A --> F
    A --> G
    
    D --> H
    H --> I
    H --> J
    H --> K
    H --> L
    
    K --> N
    N --> M
    N --> O
    
    I --> R
    J --> P
    J --> Q
    K --> P
    
    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#FF9800
    style M fill:#9C27B0
    style N fill:#9C27B0
    style P fill:#FF5722
    style Q fill:#FF5722
    style R fill:#FF5722
```

---

## 2. Feed Algorithm Flow Diagram

```mermaid
flowchart TD
    A[Grievance Feed Request] --> B[Fetch All Grievances]
    B --> C{User Role?}
    
    C -->|Citizen| D[Apply Citizen Algorithm]
    C -->|Department/Admin| E[Apply Admin/Dept Algorithm]
    
    D --> F[Calculate Scores]
    E --> F
    
    F --> G[Upvote Score<br/>Weight: 0.4]
    F --> H[Priority Score<br/>Weight: 0.3]
    F --> I[Recency Score<br/>Weight: 0.2]
    F --> J[Status Score<br/>Weight: 0.1]
    
    G --> K[Combine Scores]
    H --> K
    I --> K
    J --> K
    
    K --> L[Sort by Combined Score<br/>Descending Order]
    L --> M[Apply Filters<br/>Status, Category, etc.]
    M --> N[Return Sorted Feed]
    
    style A fill:#E3F2FD
    style D fill:#C8E6C9
    style E fill:#FFF9C4
    style K fill:#FFE0B2
    style N fill:#4CAF50
```

---

## 3. Feed Algorithm Scoring Visualization

```mermaid
graph LR
    subgraph "Input Parameters"
        A[Upvotes: 15]
        B[Priority: High]
        C[Created: 2 days ago]
        D[Status: In Progress]
    end
    
    subgraph "Weighted Calculation"
        E[Upvote Score<br/>15 × 0.4 = 6.0]
        F[Priority Score<br/>3 × 0.3 = 0.9]
        G[Recency Score<br/>Timestamp × 0.2]
        H[Status Score<br/>2 × 0.1 = 0.2]
    end
    
    subgraph "Final Score"
        I[Combined Score<br/>6.0 + 0.9 + G + 0.2]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> I
    G --> I
    H --> I
    
    style E fill:#81C784
    style F fill:#64B5F6
    style G fill:#FFB74D
    style H fill:#BA68C8
    style I fill:#4CAF50
```

---

## 4. TSP Route Optimization Flow

```mermaid
flowchart TD
    A[Department Worker<br/>Opens Map] --> B[Fetch Assigned<br/>Grievances]
    B --> C[Extract Locations<br/>with Coordinates]
    C --> D[Apply TSP Algorithm]
    
    D --> E[Nearest Neighbor<br/>Heuristic]
    E --> F[2-Opt Optimization<br/>Improve Route]
    F --> G[Calculate Total<br/>Distance & Time]
    
    G --> H[Display Optimized Route<br/>on Map]
    H --> I[Worker Follows Route]
    I --> J[Update Status at<br/>Each Location]
    
    subgraph "TSP Algorithm Details"
        K[Start: Current Location]
        L[Find Nearest<br/>Unvisited Location]
        M[Move to Location]
        N{More Locations?}
        N -->|Yes| L
        N -->|No| O[Return to Start]
        O --> P[Apply 2-Opt Swap<br/>to Reduce Distance]
    end
    
    style A fill:#E3F2FD
    style D fill:#FFE0B2
    style H fill:#C8E6C9
    style P fill:#4CAF50
```

---

## 5. TSP Route Comparison

```mermaid
graph TB
    subgraph "Before Optimization"
        A1[Location 1] --> A2[Location 4]
        A2 --> A3[Location 2]
        A3 --> A4[Location 5]
        A4 --> A5[Location 3]
        A5 --> A6[Total: 45 km<br/>Time: 2.5 hours]
    end
    
    subgraph "After TSP Optimization"
        B1[Location 1] --> B2[Location 2]
        B2 --> B3[Location 3]
        B3 --> B4[Location 4]
        B4 --> B5[Location 5]
        B5 --> B6[Total: 28 km<br/>Time: 1.5 hours]
    end
    
    A6 -.->|38% Reduction| B6
    
    style A6 fill:#FFCDD2
    style B6 fill:#C8E6C9
```

---

## 6. Two-Tier Caching Strategy

```mermaid
flowchart TD
    A[User Request Data] --> B{Check In-Memory<br/>Cache?}
    
    B -->|Hit| C[Return Data<br/>Instant]
    B -->|Miss| D{Check Persistent<br/>Cache?}
    
    D -->|Hit| E[Return Data<br/>Fast]
    D -->|Miss| F[Fetch from API]
    
    E --> G[Update In-Memory<br/>Cache]
    F --> H[Store in Both Caches]
    
    G --> I[Return to User]
    H --> I
    
    subgraph "Cache Layers"
        J[In-Memory Cache<br/>5 min TTL<br/>Fast Access]
        K[Persistent Cache<br/>SharedPreferences<br/>30 min TTL<br/>Offline Support]
    end
    
    subgraph "Cache Management"
        L[LRU Eviction<br/>Memory Management]
        M[TTL Expiry<br/>Data Freshness]
    end
    
    style C fill:#4CAF50
    style E fill:#81C784
    style F fill:#FFB74D
    style J fill:#E1BEE7
    style K fill:#BBDEFB
```

---

## 7. AI Problem Classification Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant API
    participant LangChain
    participant Gemini AI
    participant Firestore
    
    User->>App: Submit Grievance<br/>(Photo + Description)
    App->>App: Compress Image
    App->>API: POST /grievances
    API->>API: Check Duplicates
    
    alt Duplicate Found
        API-->>App: Error: Duplicate
    else New Grievance
        API->>LangChain: Orchestrate AI Workflow
        LangChain->>Gemini AI: Analyze Image
        Gemini AI-->>LangChain: Image Analysis<br/>(Objects, Issues)
        LangChain->>Gemini AI: Analyze Description
        Gemini AI-->>LangChain: Text Analysis<br/>(Keywords, Context)
        LangChain->>LangChain: Classify Problem Type
        LangChain->>LangChain: Determine Department
        LangChain->>LangChain: Assign Priority
        LangChain-->>API: Classification Result
        API->>Firestore: Store Grievance<br/>with AI Metadata
        Firestore-->>API: Success
        API-->>App: Grievance Created
        App-->>User: Success Notification
    end
```

---

## 8. User Journey Flow

```mermaid
journey
    title Citizen User Journey
    section Report Problem
      Take Photo: 5: Citizen
      Write Description: 4: Citizen
      Submit: 5: Citizen
      AI Classification: 5: System
      Auto-Route to Dept: 5: System
    section Track Progress
      Receive Notification: 4: Citizen
      View Status Update: 5: Citizen
      See Timeline: 5: Citizen
    section Resolution
      Get Resolved Notification: 5: Citizen
      View Before/After Photos: 5: Citizen
      Upvote or Revive: 4: Citizen
```

---

## 9. Department Worker Flow

```mermaid
flowchart LR
    A[Login as<br/>Department] --> B[View Dashboard]
    B --> C[See Assigned<br/>Grievances]
    C --> D[Filter by<br/>Priority/Status]
    D --> E[Click Optimize<br/>Routes]
    E --> F[TSP Algorithm<br/>Calculates Route]
    F --> G[View Route on Map]
    G --> H[Start Working]
    H --> I[Update Status:<br/>In Progress]
    I --> J[Visit Locations]
    J --> K[Fix Problems]
    K --> L[Upload After Photos]
    L --> M[Mark as Resolved]
    M --> N[Citizens Notified]
    
    style A fill:#2196F3
    style F fill:#FFE0B2
    style M fill:#4CAF50
```

---

## 10. Duplicate Detection Algorithm

```mermaid
flowchart TD
    A[New Grievance Submission] --> B[Extract Features]
    B --> C[Title Hash]
    B --> D[Image Hash]
    B --> E[Location Coordinates]
    B --> F[Timestamp]
    
    C --> G[Check Title Similarity<br/>Levenshtein Distance]
    D --> H[Check Image Similarity<br/>Perceptual Hash]
    E --> I[Check Location Proximity<br/>Haversine Distance]
    F --> J[Check Time Window<br/>< 10 minutes]
    
    G --> K{Similar?}
    H --> L{Similar?}
    I --> M{Close?}
    J --> N{Recent?}
    
    K -->|Yes| O[Flag as Potential Duplicate]
    L -->|Yes| O
    M -->|Yes| O
    N -->|Yes| O
    
    K -->|No| P[Allow Submission]
    L -->|No| P
    M -->|No| P
    N -->|No| P
    
    O --> Q[Show Confirmation Dialog]
    Q --> R{User Confirms?}
    R -->|Yes| P
    R -->|No| S[Block Submission]
    
    style O fill:#FFF9C4
    style P fill:#C8E6C9
    style S fill:#FFCDD2
```

---

## 11. Status Timeline Flow

```mermaid
stateDiagram-v2
    [*] --> Submitted: Citizen Reports
    Submitted --> Assigned: Admin Assigns
    Submitted --> Rejected: Admin Rejects
    Assigned --> In_Progress: Worker Starts
    In_Progress --> Resolved: Worker Completes
    Resolved --> Closed: Auto-Close (30 days)
    Resolved --> Submitted: Citizen Revives
    Closed --> Submitted: Citizen Revives
    
    note right of Submitted
        Initial Status
        Timestamp Recorded
        User Info Stored
    end note
    
    note right of Resolved
        After Photos Uploaded
        Before/After Comparison
        Resolution Time Calculated
    end note
```

---

## 12. Complete System Data Flow

```mermaid
graph TB
    subgraph "User Actions"
        U1[Citizen Reports]
        U2[Department Works]
        U3[Admin Manages]
    end
    
    subgraph "Processing Layer"
        P1[Image Compression]
        P2[AI Classification]
        P3[Feed Algorithm]
        P4[Route Optimization]
        P5[Duplicate Detection]
    end
    
    subgraph "Storage Layer"
        S1[Firestore<br/>Grievances]
        S2[Firestore<br/>Users]
        S3[Firebase Storage<br/>Images]
        S4[Local Cache<br/>Performance]
    end
    
    subgraph "Notification System"
        N1[In-App Notifications]
        N2[Push Notifications]
        N3[Email Alerts]
    end
    
    U1 --> P1
    U1 --> P2
    U1 --> P5
    U2 --> P4
    U3 --> P3
    
    P1 --> S3
    P2 --> S1
    P3 --> S4
    P4 --> S1
    P5 --> S1
    
    S1 --> N1
    S1 --> N2
    S2 --> N3
    
    style P2 fill:#9C27B0
    style P3 fill:#4CAF50
    style P4 fill:#FF9800
    style S1 fill:#FF5722
```

---

## 13. Performance Optimization Architecture

```mermaid
graph TD
    A[User Opens App] --> B{Cache Available?}
    B -->|Yes| C[Load from Cache<br/>< 100ms]
    B -->|No| D[Fetch from API]
    
    D --> E{Network Speed?}
    E -->|Fast| F[Load Data<br/>500ms]
    E -->|Slow| G[Show Cached Data<br/>+ Background Sync]
    
    C --> H[Display UI]
    F --> H
    G --> H
    
    H --> I[User Interacts]
    I --> J[Update Cache<br/>In Background]
    J --> K[Sync with Server]
    
    subgraph "Optimization Strategies"
        L[Image Compression<br/>70% size reduction]
        M[Lazy Loading<br/>Load on demand]
        N[Pagination<br/>Batch requests]
        O[Debouncing<br/>Reduce API calls]
    end
    
    style C fill:#4CAF50
    style F fill:#81C784
    style G fill:#FFF9C4
```

---

## 14. AI Orchestration with LangChain

```mermaid
graph TB
    A[Grievance Input] --> B[LangChain Orchestrator]
    
    B --> C[Step 1: Image Analysis]
    C --> D[Gemini Vision API]
    D --> E[Extract Objects<br/>Identify Issues]
    
    B --> F[Step 2: Text Analysis]
    F --> G[Gemini Text API]
    G --> H[Extract Keywords<br/>Understand Context]
    
    E --> I[Step 3: Classification]
    H --> I
    I --> J[Problem Type<br/>Category]
    
    I --> K[Step 4: Department Mapping]
    K --> L[Route to Correct<br/>Department]
    
    I --> M[Step 5: Priority Assignment]
    M --> N[Urgent/High/Medium/Low]
    
    L --> O[Final Result]
    N --> O
    O --> P[Store in Database]
    
    style B fill:#9C27B0
    style D fill:#673AB7
    style G fill:#673AB7
    style O fill:#4CAF50
```

---

## 15. Role-Based Access Control

```mermaid
graph TB
    A[User Login] --> B{User Role?}
    
    B -->|Citizen| C[Citizen Features]
    B -->|Department| D[Department Features]
    B -->|Admin| E[Admin Features]
    
    C --> C1[Report Problems]
    C --> C2[View Feed]
    C --> C3[Upvote Issues]
    C --> C4[Track Own Reports]
    C --> C5[Revive Resolved]
    
    D --> D1[View Assigned Issues]
    D --> D2[Update Status]
    D --> D3[Upload After Photos]
    D --> D4[Optimize Routes]
    D --> D5[Filter Dashboard]
    
    E --> E1[View All Issues]
    E --> E2[Assign to Departments]
    E --> E3[Manage Users]
    E --> E4[View Analytics]
    E --> E5[Update Any Status]
    
    style C fill:#4CAF50
    style D fill:#2196F3
    style E fill:#FF9800
```

---

## How to Use These Diagrams

### For LinkedIn:
1. Copy the Mermaid code
2. Use online tools like:
   - [Mermaid Live Editor](https://mermaid.live/)
   - [GitHub Gists](https://gist.github.com/) (GitHub renders Mermaid)
   - [Notion](https://notion.so) (supports Mermaid)
   - [Obsidian](https://obsidian.md/) (supports Mermaid)

### For Documentation:
- GitHub automatically renders Mermaid in `.md` files
- Many documentation platforms support Mermaid
- Can be exported as PNG/SVG from Mermaid Live Editor

### For Presentations:
1. Use Mermaid Live Editor to generate images
2. Export as PNG (high resolution)
3. Insert into PowerPoint/Google Slides

### Recommended Diagrams for LinkedIn Post:
- **Diagram #2**: Feed Algorithm Flow (shows algorithm thinking)
- **Diagram #4**: TSP Route Optimization (shows practical algorithm application)
- **Diagram #6**: Two-Tier Caching (shows data structure application)
- **Diagram #1**: System Architecture (shows overall technical depth)

### Tips:
- Use 1-2 diagrams per post (don't overwhelm)
- Add a caption explaining what the diagram shows
- Mention "Built using Mermaid diagrams" to show attention to detail
- Link to your GitHub if you have the diagrams there

