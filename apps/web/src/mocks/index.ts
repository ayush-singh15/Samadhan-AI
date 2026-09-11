/**
 * TriSetu — Mock Data
 *
 * IMPORTANT: These mocks mirror the exact data shapes returned by the backend API.
 * They are used ONLY when the backend is unavailable locally.
 * Replace each mock reference with a real API call as endpoints become available.
 *
 * All mock exports are prefixed with `mock_` — search for that prefix to find
 * and replace them with real API calls.
 */

import type {
  User,
  Problem,
  Proposal,
  Project,
  UniversityProfile,
  UniversityMatch,
  DashboardStats,
} from '../types';

// ---- Users -------------------------------------------------

export const mock_users: User[] = [
  { id: 'usr-citizen-01', name: 'Ananya Sharma', email: 'ananya@citizen.in', role: 'CITIZEN', isVerified: true },
  { id: 'usr-univ-01',    name: 'Prof. Ravi Kumar', email: 'ravi@iitk.ac.in', role: 'UNIVERSITY', isVerified: true },
  { id: 'usr-gov-01',     name: 'Officer Singh', email: 'officer@gov.in', role: 'GOVERNMENT', isVerified: true },
  { id: 'usr-ind-01',     name: 'Meera Joshi', email: 'meera@techcorp.com', role: 'INDUSTRY', isVerified: true },
];

// ---- Problems (matches backend ProblemsService.sampleProblems shape) ----

export const mock_problems: Problem[] = [
  {
    id: 'prob-101',
    title: 'Contaminated Drinking Water Tank in Rampur Village',
    description: 'The overhead public water tank in Ward 4 has high sediment and algae build-up, causing waterborne illnesses among residents. Over 300 households are affected.',
    category: 'WATER_SANITATION',
    status: 'ASSIGNED_TO_UNIVERSITY',
    latitude: 26.8467,
    longitude: 80.9462,
    address: 'Ward 4, Rampur Village',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    mediaUrls: ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3'],
    submittedById: 'usr-citizen-01',
    assignedUniversityId: 'univ-iitk',
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-08-10T14:00:00Z',
    aiCategory: 'Rural Water Supply & Treatment',
    aiConfidence: 0.91,
  },
  {
    id: 'prob-102',
    title: 'Lack of Solar Cold Storage for Perishable Produce',
    description: 'Farmers lose 40% of tomato harvest due to lack of local grid-independent cold storage. A solar-powered cold chain facility is urgently needed.',
    category: 'AGRICULTURE',
    status: 'SUBMITTED',
    latitude: 25.3176,
    longitude: 82.9739,
    address: 'Kisan Mandi, Block B',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    mediaUrls: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854'],
    submittedById: 'usr-citizen-01',
    createdAt: '2026-08-01T10:30:00Z',
    updatedAt: '2026-08-01T10:30:00Z',
    aiCategory: 'Agricultural Cold Chain',
    aiConfidence: 0.86,
  },
  {
    id: 'prob-103',
    title: 'Potholes on NH-31 Bypass causing accidents',
    description: 'A 3 km stretch of NH-31 bypass has severe potholes that have caused 4 accidents in the past 2 months. The road was resurfaced poorly during the last contract.',
    category: 'INFRASTRUCTURE',
    status: 'AI_CATEGORIZED',
    latitude: 26.1445,
    longitude: 91.7362,
    address: 'NH-31 Bypass, near Kamrup',
    district: 'Kamrup',
    state: 'Assam',
    submittedById: 'usr-citizen-01',
    createdAt: '2026-08-18T07:00:00Z',
    updatedAt: '2026-08-18T09:15:00Z',
    aiCategory: 'Road Infrastructure',
    aiConfidence: 0.95,
    similarProblems: [
      { problemId: 'prob-104', title: 'Road Damage on NH-31 near airport', similarity: 0.78 },
    ],
  },
  {
    id: 'prob-104',
    title: 'Road Damage on NH-31 near airport',
    description: 'Road near Guwahati airport has subsidence and waterlogging issues during monsoon.',
    category: 'INFRASTRUCTURE',
    status: 'IN_PROGRESS',
    latitude: 26.1061,
    longitude: 91.5858,
    address: 'Near Lokpriya Gopinath Bordoloi Airport',
    district: 'Kamrup',
    state: 'Assam',
    submittedById: 'usr-citizen-01',
    createdAt: '2026-07-20T08:00:00Z',
    updatedAt: '2026-08-25T11:00:00Z',
  },
];

// ---- University Profiles -----------------------------------

export const mock_universities: UniversityProfile[] = [
  {
    id: 'univ-iitk',
    userId: 'usr-univ-01',
    name: 'IIT Kanpur',
    code: 'IITK',
    expertiseTags: ['Water Treatment', 'Environmental Engineering', 'Civil Engineering'],
    department: 'Civil & Environmental Engineering',
    state: 'Uttar Pradesh',
    contactEmail: 'research@iitk.ac.in',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'univ-nitj',
    userId: 'usr-univ-02',
    name: 'NIT Jaipur',
    code: 'NITJ',
    expertiseTags: ['Renewable Energy', 'Agriculture Tech', 'IoT'],
    department: 'Electrical & Agricultural Engineering',
    state: 'Rajasthan',
    contactEmail: 'research@nitj.ac.in',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

// ---- University Match suggestions (AI service mock) --------

export const mock_matches: UniversityMatch[] = [
  {
    universityId: 'univ-iitk',
    universityName: 'IIT Kanpur',
    department: 'Civil & Environmental Engineering',
    matchReason: 'Strong track record in rural water treatment projects; 3 completed government assignments in UP.',
    matchScore: 0.92,
  },
  {
    universityId: 'univ-nitj',
    universityName: 'NIT Jaipur',
    department: 'Chemical Engineering',
    matchReason: 'Faculty specialising in low-cost water purification tech suitable for village-scale deployment.',
    matchScore: 0.81,
  },
];

// ---- Proposals ---------------------------------------------

export const mock_proposals: Proposal[] = [
  {
    id: 'prop-001',
    problemId: 'prob-101',
    universityId: 'univ-iitk',
    title: 'Smart Water Quality Monitoring & Treatment System',
    abstract: 'Deploy IoT-based water quality sensors on the tank and a solar-powered UV treatment unit. Real-time monitoring via mobile app for the gram panchayat.',
    budgetRequired: 1800000,
    timelineMonths: 12,
    status: 'APPROVED',
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-20T14:00:00Z',
    universityName: 'IIT Kanpur',
    problemTitle: 'Contaminated Drinking Water Tank in Rampur Village',
  },
  {
    id: 'prop-002',
    problemId: 'prob-103',
    universityId: 'univ-nitj',
    title: 'AI-Assisted Pothole Detection and Repair Prioritisation',
    abstract: 'Train a computer vision model on drone imagery to detect and severity-rank potholes. Output a prioritised repair schedule for the roads department.',
    budgetRequired: 1200000,
    timelineMonths: 8,
    status: 'SUBMITTED',
    createdAt: '2026-08-25T09:00:00Z',
    updatedAt: '2026-08-25T09:00:00Z',
    universityName: 'NIT Jaipur',
    problemTitle: 'Potholes on NH-31 Bypass causing accidents',
  },
];

// ---- Projects ----------------------------------------------

export const mock_projects: Project[] = [
  {
    id: 'proj-001',
    proposalId: 'prop-001',
    title: 'Smart Water Quality Monitoring & Treatment System',
    status: 'IN_DEVELOPMENT',
    fundedAmount: 800000,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-02T00:00:00Z',
    problemTitle: 'Contaminated Drinking Water Tank in Rampur Village',
    universityName: 'IIT Kanpur',
    milestones: [
      {
        id: 'ms-001',
        projectId: 'proj-001',
        title: 'Site Survey & Requirements',
        description: 'Complete site survey of all 4 wards, water quality baseline test, finalize sensor placement map.',
        dueDate: '2026-10-15T00:00:00Z',
        isCompleted: true,
        fundingPercentage: 15,
        createdAt: '2026-09-01T00:00:00Z',
      },
      {
        id: 'ms-002',
        projectId: 'proj-001',
        title: 'Sensor Procurement & Pilot',
        description: 'Procure 10 pilot IoT sensors, deploy in Ward 4, validate data accuracy against lab samples.',
        dueDate: '2026-12-31T00:00:00Z',
        isCompleted: false,
        fundingPercentage: 30,
        createdAt: '2026-09-01T00:00:00Z',
      },
      {
        id: 'ms-003',
        projectId: 'proj-001',
        title: 'UV Treatment Unit Installation',
        description: 'Install solar-powered UV treatment unit on the main tank and connect to monitoring system.',
        dueDate: '2027-03-31T00:00:00Z',
        isCompleted: false,
        fundingPercentage: 35,
        createdAt: '2026-09-01T00:00:00Z',
      },
      {
        id: 'ms-004',
        projectId: 'proj-001',
        title: 'App Launch & Community Training',
        description: 'Launch mobile app for gram panchayat, train operators, hand over to district administration.',
        dueDate: '2027-08-31T00:00:00Z',
        isCompleted: false,
        fundingPercentage: 20,
        createdAt: '2026-09-01T00:00:00Z',
      },
    ],
  },
];

// ---- Analytics (matches GET /api/v1/analytics/dashboard) ---

export const mock_dashboard_stats: DashboardStats = {
  totalProblems: mock_problems.length,
  problemsByStatus: {
    SUBMITTED: 1,
    AI_CATEGORIZED: 1,
    ASSIGNED_TO_UNIVERSITY: 1,
    PROPOSAL_SUBMITTED: 0,
    FUNDING_APPROVED: 0,
    IN_PROGRESS: 1,
    RESOLVED: 0,
    REJECTED: 0,
  },
  totalProposals: mock_proposals.length,
  activeProjects: mock_projects.filter((p) => p.status === 'IN_DEVELOPMENT').length,
  resolvedProblems: 0,
};
