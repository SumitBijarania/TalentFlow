# TalentFlow - Applicant Tracking System (ATS)

A modern, full-featured Applicant Tracking System built with React, featuring job management, candidate tracking with kanban boards, and assessment builders.

## 🚀 Live Demo

[View Live Application](https://your-app-url.vercel.app) *(Update after deployment)*

## 📋 Features

- **Job Board Management**
  - Create, edit, and archive job postings
  - Drag-and-drop job reordering
  - Tag-based filtering and search
  - Active/Archived status management

- **Candidate Tracking**
  - Comprehensive candidate list with filtering
  - Kanban board view with drag-and-drop stage transitions
  - Detailed candidate profiles with timeline history
  - Stage-based candidate management (Applied → Screening → Interview → Offer → Hired/Rejected)

- **Assessment Builder**
  - Create custom assessments per job
  - Multiple question types support
  - Assessment submission and storage

- **Real-time Data Persistence**
  - IndexedDB-based local storage using Dexie
  - Mock Service Worker (MSW) for API simulation
  - Optimistic UI updates with error handling

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Styling**: Custom CSS
- **Database**: Dexie (IndexedDB wrapper)
- **API Mocking**: MSW (Mock Service Worker)
- **State Management**: React Hooks (useState, useEffect)
- **Drag & Drop**: Custom implementation with HTML5 Drag and Drop API

## 📦 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SumitBijarania/TalentFlow1.git
   cd TalentFlow1/talentflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically seed sample data on first load

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Architecture

### Project Structure

```
talentflow/
├── src/
│   ├── components/          # React components
│   │   ├── JobsBoard.jsx           # Job listings with drag-drop
│   │   ├── JobDetail.jsx           # Job details and editing
│   │   ├── CandidatesList.jsx      # Candidate table view
│   │   ├── CandidateKanban.jsx     # Kanban board for candidates
│   │   ├── CandidateCard.jsx       # Reusable candidate card
│   │   ├── CandidateProfile.jsx    # Candidate profile with timeline
│   │   ├── AssessmentsList.jsx     # Assessment listings
│   │   ├── AssessmentsBuilder.jsx  # Assessment creation tool
│   │   ├── Layout.jsx              # App layout wrapper
│   │   └── ...
│   ├── db/                  # Database layer
│   │   ├── index.js                # Dexie database configuration
│   │   ├── seed.js                 # Initial data seeding
│   │   └── speed.js                # Database optimization
│   ├── mocks/               # API mocking
│   │   ├── handlers.js             # MSW API handlers
│   │   └── browser.js              # MSW browser worker setup
│   ├── stores/              # State management
│   │   └── jobs.js                 # Job-related state
│   ├── types/               # TypeScript-style type definitions
│   │   └── index.js
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/
│   └── mockServiceWorker.js # MSW service worker
├── package.json
├── vite.config.js
└── vercel.json              # Vercel deployment config
```

### Data Flow

1. **Components** make API calls to `/jobs`, `/candidates`, etc.
2. **MSW handlers** intercept these requests in both dev and production
3. **Dexie (IndexedDB)** stores and retrieves data persistently
4. **React state** updates trigger UI re-renders
5. **Optimistic updates** provide instant feedback, with rollback on errors

### Database Schema

#### Jobs Table
```javascript
{
  id: string (UUID),
  title: string,
  slug: string,
  status: "active" | "archived",
  description: string,
  requiredSkills: string[],
  location: string,
  salaryRange: string,
  order: number,
  tags: string[]
}
```

#### Candidates Table
```javascript
{
  id: string (UUID),
  name: string,
  email: string,
  phone: string,
  jobId: string,
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected",
  appliedDate: Date,
  resumeUrl: string,
  skills: string[],
  experience: number,
  notes: { text: string, timestamp: Date }[]
}
```

#### Assessments Table
```javascript
{
  jobId: string,
  sections: [{
    title: string,
    questions: [{
      type: "text" | "multiple-choice" | "code",
      question: string,
      options?: string[]
    }]
  }]
}
```

## 🎨 Key Features & Implementation

### 1. Drag and Drop Functionality

- **Jobs Reordering**: Implemented custom drag-and-drop for job cards with visual feedback
- **Candidate Kanban**: Stage-based drag-and-drop with automatic stage updates
- **Features**:
  - Visual indicators during drag (opacity changes, drop zones)
  - Optimistic updates with error handling
  - Prevents invalid drops

### 2. API Mocking with MSW

- All API endpoints are mocked for development and demo purposes
- Simulates network delays (200-1200ms) for realistic UX
- Random error simulation (7.5% failure rate) for robust error handling
- Works in both development and production builds

### 3. State Management

- Used React's built-in hooks instead of external libraries
- Local component state for UI-specific data
- Context-free architecture for simplicity
- Direct IndexedDB access for persistent state

### 4. Responsive Design

- Mobile-first CSS approach
- Flexible grid layouts
- Adapts to different screen sizes

## 🐛 Known Issues & Limitations

### Current Issues

1. **Timeline Data Structure**
   - Timeline events may have duplicate timestamps
   - **Workaround**: Combined timestamp + index for unique React keys
   - **Future**: Add unique event IDs

2. **Service Worker Caching**
   - MSW service worker may need manual refresh after updates
   - **Workaround**: Hard refresh (Ctrl+Shift+R) after deployment
   - **Future**: Implement service worker update notifications

3. **Large Dataset Performance**
   - Kanban board may slow with 1000+ candidates
   - **Current**: All candidates rendered at once
   - **Future**: Implement virtualization for large lists

### Limitations

- **No Authentication**: Currently no user authentication system
- **Single User**: No multi-user or role-based access control
- **No Real Backend**: Uses mock API and local storage
- **No File Upload**: Resume URLs are text fields only
- **No Email Integration**: No automated email notifications
- **Browser-Based Storage**: Data is stored locally per browser

## 🔧 Technical Decisions

### Why Vite?

- **Fast**: Instant HMR and lightning-fast builds
- **Modern**: Native ES modules support
- **Simple**: Minimal configuration required
- Better developer experience compared to Create React App

### Why IndexedDB (Dexie)?

- **Persistent**: Data survives page refreshes
- **Large Storage**: Can store much more than localStorage
- **Fast Queries**: Efficient indexing and querying
- **Observable**: Can subscribe to database changes
- Better than localStorage for complex data structures

### Why MSW?

- **Realistic**: Intercepts actual network requests
- **Flexible**: Easy to modify mock responses
- **Testing**: Same mocks can be used in tests
- **Development Speed**: No backend needed for frontend development
- **Demo-Ready**: Works in production for portfolio/demo purposes

### Why Custom CSS?

- **Learning**: Better understanding of CSS fundamentals
- **Performance**: No extra library bundle size
- **Control**: Full control over styling
- **Simplicity**: No CSS-in-JS or utility class learning curve

### Why No TypeScript?

- **Rapid Development**: Faster prototyping
- **Simplicity**: Reduced build complexity
- **JSDoc**: Used PropTypes for type checking where needed
- **Future**: Easy to migrate to TypeScript if needed

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Set **Root Directory** to `talentflow`
   - Click "Deploy"

3. **Configuration**
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Environment Variables

No environment variables required for the current setup.

## 🔮 Future Enhancements

### High Priority
- [ ] Add real backend API (Node.js + Express or Next.js API routes)
- [ ] Implement user authentication and authorization
- [ ] Add email notifications for stage changes
- [ ] File upload for resumes and documents
- [ ] Advanced search and filtering

### Medium Priority
- [ ] Export data to CSV/PDF
- [ ] Interview scheduling system
- [ ] Candidate communication history
- [ ] Analytics dashboard
- [ ] Multi-job application support per candidate

### Low Priority
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Undo/Redo functionality
- [ ] Candidate notes with rich text editor
- [ ] Integration with LinkedIn/Indeed

## 🤝 Contributing

This is a portfolio/demo project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Sumit Bijarania**

- GitHub: [@SumitBijarania](https://github.com/SumitBijarania)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile) *(Update with your profile)*

## 🙏 Acknowledgments

- React team for the amazing framework
- MSW team for the excellent API mocking solution
- Dexie team for the IndexedDB wrapper
- Vercel for easy deployment

---

**Built with ❤️ using React and Vite**
