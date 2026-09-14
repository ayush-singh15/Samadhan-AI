import { PrismaClient, ProblemCategory, ProblemStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding on Neon PostgreSQL...');

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Upsert Demo Users
  console.log('Creating demo users...');
  const citizenUser = await prisma.user.upsert({
    where: { email: 'citizen@trisetu.in' },
    update: {},
    create: {
      email: 'citizen@trisetu.in',
      name: 'Ramesh Kumar (Ward 4 Resident)',
      role: Role.CITIZEN,
      passwordHash,
      phone: '+91 98765 43210',
      isVerified: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@trisetu.gov.in' },
    update: {},
    create: {
      email: 'admin@trisetu.gov.in',
      name: 'Smt. Priya Nair (Zonal Commissioner)',
      role: Role.ADMIN,
      passwordHash,
      phone: '+91 91234 56789',
      isVerified: true,
    },
  });

  const uniUser = await prisma.user.upsert({
    where: { email: 'prof.sharma@iitk.ac.in' },
    update: {},
    create: {
      email: 'prof.sharma@iitk.ac.in',
      name: 'Prof. Alok Sharma (Dept of Civil Engineering)',
      role: Role.UNIVERSITY,
      passwordHash,
      phone: '+91 94567 89012',
      isVerified: true,
    },
  });

  const bhuUser = await prisma.user.upsert({
    where: { email: 'dr.verma@iitbhu.ac.in' },
    update: {},
    create: {
      email: 'dr.verma@iitbhu.ac.in',
      name: 'Dr. Neha Verma (Renewable Energy Lab)',
      role: Role.UNIVERSITY,
      passwordHash,
      phone: '+91 94123 45678',
      isVerified: true,
    },
  });

  const industryUser = await prisma.user.upsert({
    where: { email: 'csr.head@tatatrusts.org' },
    update: {},
    create: {
      email: 'csr.head@tatatrusts.org',
      name: 'Vikramaditya Roy (CSR Director)',
      role: Role.INDUSTRY,
      passwordHash,
      phone: '+91 99887 76655',
      isVerified: true,
    },
  });

  // 2. Upsert University Profiles
  console.log('Creating university profiles...');
  const iitkProfile = await prisma.universityProfile.upsert({
    where: { code: 'UNI-IITK-01' },
    update: {},
    create: {
      userId: uniUser.id,
      name: 'IIT Kanpur - Centre for Smart Civic Infra',
      code: 'UNI-IITK-01',
      department: 'Civil & Environmental Engineering',
      state: 'Uttar Pradesh',
      contactEmail: 'prof.sharma@iitk.ac.in',
      expertiseTags: ['Water Purification', 'IoT Sensors', 'Structural Diagnostics', 'GIS Mapping'],
    },
  });

  const iitbhuProfile = await prisma.universityProfile.upsert({
    where: { code: 'UNI-BHU-02' },
    update: {},
    create: {
      userId: bhuUser.id,
      name: 'IIT BHU - Clean Energy & Agricultural Tech Hub',
      code: 'UNI-BHU-02',
      department: 'Mechanical & Agricultural Engineering',
      state: 'Uttar Pradesh',
      contactEmail: 'dr.verma@iitbhu.ac.in',
      expertiseTags: ['Solar Refrigeration', 'Crop Preservation', 'Biomass Systems', 'Off-grid Power'],
    },
  });

  // 3. Upsert Industry Profiles
  console.log('Creating industry profiles...');
  const tataProfile = await prisma.industryProfile.upsert({
    where: { registrationNumber: 'CSR-IND-9021' },
    update: {},
    create: {
      userId: industryUser.id,
      companyName: 'Tata Trusts & Sustainability Foundation',
      registrationNumber: 'CSR-IND-9021',
      csrFocusAreas: ['Water Sanitation', 'Clean Energy', 'Rural Livelihood', 'Urban Resilience'],
      totalBudgetAllocated: 50000000,
      totalBudgetCommitted: 18500000,
      contactEmail: 'csr.head@tatatrusts.org',
    },
  });

  // 4. Upsert Real Civic Problems
  console.log('Creating civic problems...');
  const prob1 = await prisma.problem.create({
    data: {
      title: 'Contaminated Drinking Water Overhead Tank in Ward 4',
      description: 'The primary overhead storage tank supplying 1,400 households has heavy algal bloom and iron contamination. Multiple waterborne illness cases reported over last 3 weeks.',
      category: ProblemCategory.WATER_SANITATION,
      status: ProblemStatus.ASSIGNED_TO_UNIVERSITY,
      latitude: 26.8467,
      longitude: 80.9462,
      address: 'Near Old Panchayat Bhawan, Ward 4',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      mediaUrls: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=60',
      ],
      submittedById: citizenUser.id,
      assignedUniversityId: iitkProfile.id,
    },
  });

  const prob2 = await prisma.problem.create({
    data: {
      title: 'Severe Post-Harvest Tomato Rot Due to Lack of Solar Cold Storage',
      description: 'Smallholder tomato farmers face 42% produce spoilage during summer months before reaching mandi. Immediate requirement for decentralized 5MT solar cold rooms.',
      category: ProblemCategory.AGRICULTURE,
      status: ProblemStatus.PROPOSAL_SUBMITTED,
      latitude: 25.3176,
      longitude: 82.9739,
      address: 'Kisan Mandi Yard, Block B, Rohaniya',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      mediaUrls: [
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60',
      ],
      submittedById: citizenUser.id,
      assignedUniversityId: iitbhuProfile.id,
    },
  });

  const prob3 = await prisma.problem.create({
    data: {
      title: 'Structural Road Subsidence and Pothole Clustering on GT Road Flyover Link',
      description: 'Dangerous road subsidence stretching 180 meters along high-density commercial freight lane. Poses critical rollover risk for two-wheelers and transit buses.',
      category: ProblemCategory.INFRASTRUCTURE,
      status: ProblemStatus.SUBMITTED,
      latitude: 26.4499,
      longitude: 80.3319,
      address: 'GT Road Junction, Fazalganj Industrial Area',
      district: 'Kanpur',
      state: 'Uttar Pradesh',
      mediaUrls: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60',
      ],
      submittedById: citizenUser.id,
    },
  });

  const prob4 = await prisma.problem.create({
    data: {
      title: 'Unsegregated Plastic Waste Clogging Drainage Canal at Sangam Ghat',
      description: 'Continuous inflow of single-use plastics choking the primary stormwater runoff channel, causing localized inundation and ecological degradation.',
      category: ProblemCategory.ENVIRONMENT,
      status: ProblemStatus.IN_PROGRESS,
      latitude: 25.4358,
      longitude: 81.8463,
      address: 'Sangam Embankment Channel, Daraganj',
      district: 'Prayagraj',
      state: 'Uttar Pradesh',
      mediaUrls: [
        'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=60',
      ],
      submittedById: citizenUser.id,
      assignedUniversityId: iitkProfile.id,
    },
  });

  // 5. Create Sample Proposal & Project
  console.log('Creating proposals and projects...');
  const proposal1 = await prisma.proposal.create({
    data: {
      problemId: prob2.id,
      universityId: iitbhuProfile.id,
      title: 'Phase-Change Material (PCM) Assisted Micro Solar Cold Hubs',
      abstract: 'Deployment of thermal battery PCM cold rooms operating with 3kW rooftop PV arrays, providing 4°C produce preservation without grid dependency for up to 72 hours.',
      budgetRequired: 1450000,
      timelineMonths: 4,
      status: 'APPROVED',
    },
  });

  const project1 = await prisma.project.create({
    data: {
      proposalId: proposal1.id,
      industryId: tataProfile.id,
      title: 'Project: Decentralized Solar Cold Storage for Rohaniya Mandi',
      status: 'IN_DEVELOPMENT',
      fundedAmount: 1450000,
      milestones: {
        create: [
          {
            title: 'M1: Site Survey, Soil Testing & Thermal Model Verification',
            description: 'Topographic assessment and boundary clearance at Kisan Mandi yard.',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isCompleted: true,
            fundingPercentage: 30,
          },
          {
            title: 'M2: Installation of Solar PV Array & Compressor Unit',
            description: 'Mounting 3kW mono-perc panels and commissioning insulated container.',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            isCompleted: false,
            fundingPercentage: 40,
          },
          {
            title: 'M3: Farmer Cooperative Handover & IoT Sensor Commissioning',
            description: 'Live telemetry integration and training of 40 local farmer members.',
            dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
            isCompleted: false,
            fundingPercentage: 30,
          },
        ],
      },
    },
  });

  // 6. Create Seed Notifications
  console.log('Creating notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: citizenUser.id,
        title: 'Problem Assigned to IIT Kanpur',
        message: 'Your report on Ward 4 Overhead Tank has been allocated to Dr. Alok Sharma for feasibility review.',
        type: 'PROBLEM_ASSIGNED',
        isRead: false,
      },
      {
        userId: citizenUser.id,
        title: 'Proposal Approved for Kisan Mandi',
        message: 'CSR grant of ₹14.5 Lakhs approved by Tata Trusts for Decentralized Cold Storage project.',
        type: 'FUNDING_APPROVED',
        isRead: true,
      },
      {
        userId: uniUser.id,
        title: 'New Mandate Assigned',
        message: 'Zonal Administration has assigned Problem #prob-101 to your research node.',
        type: 'MANDATE_DISPATCHED',
        isRead: false,
      },
    ],
  });

  console.log('✅ Database seeded successfully with Quad-Helix mock data!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
