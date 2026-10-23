import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const UserRole = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
  ADMIN: "ADMIN",
  UNIVERSITY_ADMIN: "UNIVERSITY_ADMIN",
  VIEWER: "VIEWER",
};
const LandlordStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
};
const ListingCategory = {
  HOSTEL: "HOSTEL",
  BEDSITTER: "BEDSITTER",
  SINGLE_ROOM: "SINGLE_ROOM",
  STUDIO: "STUDIO",
  SHARED_APARTMENT: "SHARED_APARTMENT",
};
const ListingStatus = { AVAILABLE: "AVAILABLE", RENTED: "RENTED", HIDDEN: "HIDDEN" };

const TEST_ACCOUNTS = [
  {
    email: "admin@unihub.ke",
    password: "TestAdmin2024!",
    name: "UniHub Admin",
    role: UserRole.ADMIN,
    landlordProfile: null,
  },
  {
    email: "landlord.pending@unihub.ke",
    password: "TestLandlord2024!",
    name: "John Mwangi",
    role: UserRole.LANDLORD,
    landlordProfile: {
      businessName: "Mwangi Properties Ltd",
      phone: "+254700111222",
      whatsappNumber: "+254700111222",
      nationalId: "12345678",
      targetCampuses: ["JKUAT", "KU", "MMUST"],
      estimatedProperties: 5,
      status: LandlordStatus.PENDING,
      reviewNote: "Awaiting document verification",
      consentGivenAt: new Date(),
      consentVersion: "2026-07-01",
    },
  },
  {
    email: "landlord.approved@unihub.ke",
    password: "TestLandlord2024!",
    name: "Jane Wanjiku",
    role: UserRole.LANDLORD,
    landlordProfile: {
      businessName: "Wanjiku Student Housing",
      phone: "+254711222333",
      whatsappNumber: "+254711222333",
      nationalId: "23456789",
      targetCampuses: ["UoN", "Kenyatta University", "Strathmore"],
      estimatedProperties: 12,
      status: LandlordStatus.APPROVED,
      reviewNote: "All documents verified",
      consentGivenAt: new Date(),
      consentVersion: "2026-07-01",
    },
  },
  {
    email: "landlord.rejected@unihub.ke",
    password: "TestLandlord2024!",
    name: "Peter Ochieng",
    role: UserRole.LANDLORD,
    landlordProfile: {
      businessName: "Ochieng Rentals",
      phone: "+254722333444",
      whatsappNumber: "+254722333444",
      nationalId: "34567890",
      targetCampuses: ["Moi University", "Eldoret"],
      estimatedProperties: 3,
      status: LandlordStatus.REJECTED,
      reviewNote: "Missing business registration documents",
      consentGivenAt: new Date(),
      consentVersion: "2026-07-01",
    },
  },
  {
    email: "landlord.suspended@unihub.ke",
    password: "TestLandlord2024!",
    name: "Mary Atieno",
    role: UserRole.LANDLORD,
    landlordProfile: {
      businessName: "Atieno Hostels",
      phone: "+254733444555",
      whatsappNumber: "+254733444555",
      nationalId: "45678901",
      targetCampuses: ["Maseno", "Kisumu"],
      estimatedProperties: 8,
      status: LandlordStatus.SUSPENDED,
      reviewNote: "Complaint investigation in progress",
      consentGivenAt: new Date(),
      consentVersion: "2026-07-01",
    },
  },
  {
    email: "student@unihub.ke",
    password: "TestStudent2024!",
    name: "Brian Kiprop",
    role: UserRole.TENANT,
    landlordProfile: null,
  },
  {
    email: "viewer@unihub.ke",
    password: "TestViewer2024!",
    name: "Grace Wanjiku",
    role: UserRole.VIEWER,
    landlordProfile: null,
  },
  {
    email: "university@unihub.ke",
    password: "TestUniversity2024!",
    name: "Dr. Sarah Njeri",
    role: UserRole.UNIVERSITY_ADMIN,
    landlordProfile: null,
  },
];

// The password hash is produced by the same routine Better Auth uses to
// verify a sign-in, so the seeded accounts can actually sign in.
async function hashPasswordForAccount(password: string) {
  return hashPassword(password);
}

async function main() {
  console.log("🔧 Creating UniHub test accounts...\n");
  for (const account of TEST_ACCOUNTS) {
    try {
      console.log(`Creating: ${account.email} (${account.role})`);
      const existingUser = await prisma.user.findUnique({ where: { email: account.email } });
      const hashedPassword = await hashPasswordForAccount(account.password);
      const user = existingUser
        ? await prisma.user.update({
            where: { id: existingUser.id },
            data: { name: account.name, password: hashedPassword, role: account.role },
          })
        : await prisma.user.create({
            data: {
              email: account.email,
              name: account.name,
              password: hashedPassword,
              role: account.role,
              emailVerified: true,
            },
          });
      console.log(`  ✅ User ready: ${user.id}`);

      // The email-and-password credential is held by the `credential` account
      // row, keyed by the user's id. This is the row the sign-in check reads.
      await prisma.account.upsert({
        where: { providerId_accountId: { providerId: "credential", accountId: user.id } },
        create: {
          userId: user.id,
          accountId: user.id,
          providerId: "credential",
          password: hashedPassword,
        },
        update: { password: hashedPassword },
      });
      if (account.landlordProfile) {
        await prisma.landlordProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            businessName: account.landlordProfile.businessName,
            phone: account.landlordProfile.phone,
            whatsappNumber: account.landlordProfile.whatsappNumber,
            nationalId: account.landlordProfile.nationalId,
            targetCampuses: JSON.stringify(account.landlordProfile.targetCampuses),
            estimatedProperties: account.landlordProfile.estimatedProperties,
            status: account.landlordProfile.status,
            reviewNote: account.landlordProfile.reviewNote,
            consentGivenAt: account.landlordProfile.consentGivenAt,
            consentVersion: account.landlordProfile.consentVersion,
          },
          update: {
            businessName: account.landlordProfile.businessName,
            phone: account.landlordProfile.phone,
            whatsappNumber: account.landlordProfile.whatsappNumber,
            nationalId: account.landlordProfile.nationalId,
            targetCampuses: JSON.stringify(account.landlordProfile.targetCampuses),
            estimatedProperties: account.landlordProfile.estimatedProperties,
            status: account.landlordProfile.status,
            reviewNote: account.landlordProfile.reviewNote,
            consentGivenAt: account.landlordProfile.consentGivenAt,
            consentVersion: account.landlordProfile.consentVersion,
          },
        });
        console.log(`  ✅ Landlord profile ready`);
      }
      await prisma.session.upsert({
        where: { token: `test-token-${user.id}` },
        create: {
          userId: user.id,
          token: `test-token-${user.id}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: "127.0.0.1",
          userAgent: "TestSeeder/1.0",
        },
        update: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      });
      console.log(`  ✅ Test session ready`);
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
    console.log("");
  }
  console.log("🏛️  Seeding sample universities...\n");
  const universities = [
    {
      name: "Jomo Kenyatta University of Agriculture and Technology",
      slug: "jkuat",
      location: "Juja, Kiambu County",
      description: "Leading university in technology and agriculture",
      verified: true,
      contactEmail: "info@jkuat.ac.ke",
      contactPhone: "+2546752711",
      foundedYear: 1981,
      studentCount: 25000,
    },
    {
      name: "University of Nairobi",
      slug: "uon",
      location: "Nairobi, Nairobi County",
      description: "Kenya's premier university",
      verified: true,
      contactEmail: "info@uonbi.ac.ke",
      contactPhone: "+25420318262",
      foundedYear: 1956,
      studentCount: 50000,
    },
    {
      name: "Kenyatta University",
      slug: "ku",
      location: "Kahawa, Nairobi County",
      description: "Second largest public university in Kenya",
      verified: true,
      contactEmail: "info@ku.ac.ke",
      contactPhone: "+254208709000",
      foundedYear: 1965,
      studentCount: 45000,
    },
    {
      name: "Strathmore University",
      slug: "strathmore",
      location: "Madaraka, Nairobi County",
      description: "Leading private university in business and IT",
      verified: true,
      contactEmail: "info@strathmore.edu",
      contactPhone: "+254703034000",
      foundedYear: 1961,
      studentCount: 6000,
    },
    {
      name: "Moi University",
      slug: "moi",
      location: "Eldoret, Uasin Gishu County",
      description: "Public university in the Rift Valley",
      verified: true,
      contactEmail: "info@mu.ac.ke",
      contactPhone: "+254532030000",
      foundedYear: 1984,
      studentCount: 30000,
    },
    {
      name: "Egerton University",
      slug: "egerton",
      location: "Njoro, Nakuru County",
      description: "Kenya's premier agricultural university",
      verified: true,
      contactEmail: "info@egerton.ac.ke",
      contactPhone: "+254512217723",
      foundedYear: 1939,
      studentCount: 22000,
    },
  ];
  for (const uni of universities) {
    try {
      await prisma.university.upsert({ where: { slug: uni.slug }, update: uni, create: uni });
      console.log(`  ✅ University: ${uni.name}`);
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }
  console.log("\n🏠  Seeding sample listings...\n");
  const approvedLandlord = await prisma.landlordProfile.findFirst({
    where: { status: LandlordStatus.APPROVED },
    include: { user: true },
  });
  if (approvedLandlord) {
    const listings = [
      {
        title: "Modern Bedsitter near JKUAT",
        description:
          "Fully furnished bedsitter with hot shower, 24/7 water, and WiFi. Walking distance to JKUAT main gate.",
        price: 950000,
        deposit: 950000,
        category: ListingCategory.BEDSITTER,
        location: "Juja, near JKUAT Gate A",
        latitude: -1.0967,
        longitude: 37.0076,
        images: JSON.stringify(["/listing-bedsitter.jpg", "/listing-bedsitter.jpg"]),
        amenities: JSON.stringify(["WiFi", "Hot Water", "24/7 Security", "Parking", "Laundry"]),
        genderRestriction: "none",
        hasWifi: true,
        hasWater: true,
        status: ListingStatus.AVAILABLE,
        isVerified: true,
        landlordId: approvedLandlord.id,
        userId: approvedLandlord.userId,
        university: "JKUAT",
        distanceFromCampus: "0.5 km",
      },
      {
        title: "Secure Hostel Room - UoN",
        description:
          "Gendered wing hostel with shared study lounges, cleaned daily. Walking distance to the University of Nairobi main campus.",
        price: 720000,
        deposit: 720000,
        category: ListingCategory.HOSTEL,
        location: "Nairobi, near University of Nairobi",
        latitude: -1.2791,
        longitude: 36.8245,
        images: JSON.stringify(["/listing-hostel.jpg", "/listing-twin-hostel.jpg"]),
        amenities: JSON.stringify(["Security", "Water", "Study Area", "Common Room", "Caretaker"]),
        genderRestriction: "male_only",
        hasWifi: true,
        hasWater: true,
        status: ListingStatus.AVAILABLE,
        isVerified: true,
        landlordId: approvedLandlord.id,
        userId: approvedLandlord.userId,
        university: "UoN",
        distanceFromCampus: "0.3 km",
      },
      {
        title: "Spacious Single Room - KU Area",
        description:
          "Large single room in a secure compound. Separate kitchen and bathroom. Great for postgrad students.",
        price: 800000,
        deposit: 800000,
        category: ListingCategory.SINGLE_ROOM,
        location: "Kahawa Wendani, near Kenyatta University",
        latitude: -1.1715,
        longitude: 36.9556,
        images: JSON.stringify(["/listing-apartment.jpg", "/listing-studio.jpg"]),
        amenities: JSON.stringify(["Security", "Water", "Parking", "Study Area"]),
        genderRestriction: "female_only",
        hasWifi: false,
        hasWater: true,
        status: ListingStatus.AVAILABLE,
        isVerified: true,
        landlordId: approvedLandlord.id,
        userId: approvedLandlord.userId,
        university: "Kenyatta University",
        distanceFromCampus: "1.2 km",
      },
      {
        title: "Furnished Studio - Madaraka",
        description:
          "Furnished studio apartment with modern finishes, water included, and high-speed internet. Near Strathmore University.",
        price: 1450000,
        deposit: 1450000,
        category: ListingCategory.STUDIO,
        location: "Madaraka, near Strathmore University",
        latitude: -1.3032,
        longitude: 36.8134,
        images: JSON.stringify(["/listing-studio.jpg", "/listing-apartment.jpg"]),
        amenities: JSON.stringify([
          "Water Included",
          "WiFi",
          "Parking",
          "24/7 Security",
          "Balcony",
        ]),
        genderRestriction: "none",
        hasWifi: true,
        hasWater: true,
        status: ListingStatus.AVAILABLE,
        isVerified: true,
        landlordId: approvedLandlord.id,
        userId: approvedLandlord.userId,
        university: "Strathmore",
        distanceFromCampus: "0.8 km",
      },
      {
        title: "Twin Hostel Room - Kesses",
        description:
          "Twin-sharing hostel room in Kesses with per-student pricing. Wi-Fi ready, with clean shared facilities.",
        price: 650000,
        deposit: 650000,
        category: ListingCategory.HOSTEL,
        location: "Kesses, near Moi University",
        latitude: 0.0678,
        longitude: 35.2817,
        images: JSON.stringify(["/listing-twin-hostel.jpg", "/listing-hostel.jpg"]),
        amenities: JSON.stringify(["WiFi", "Shared Facilities", "Water", "Security"]),
        genderRestriction: "none",
        hasWifi: true,
        hasWater: true,
        status: ListingStatus.AVAILABLE,
        isVerified: true,
        landlordId: approvedLandlord.id,
        userId: approvedLandlord.userId,
        university: "Moi University",
        distanceFromCampus: "1.5 km",
      },
      {
        title: "Shared Apartment - Njoro",
        description:
          "Shared apartment near Egerton University with Wi-Fi, water included, and secure parking. Ideal for groups.",
        price: 850000,
        deposit: 850000,
        category: ListingCategory.SHARED_APARTMENT,
        location: "Njoro, near Egerton University",
        latitude: -0.3576,
        longitude: 35.94,
        images: JSON.stringify(["/listing-shared.jpg", "/listing-apartment.jpg"]),
        amenities: JSON.stringify(["Wi-Fi Ready", "Water Included", "Parking", "Gated Community"]),
        genderRestriction: "none",
        hasWifi: true,
        hasWater: true,
        status: ListingStatus.AVAILABLE,
        isVerified: true,
        landlordId: approvedLandlord.id,
        userId: approvedLandlord.userId,
        university: "Egerton University",
        distanceFromCampus: "2.0 km",
      },
    ];
    for (const listing of listings) {
      try {
        const existing = await prisma.listing.findFirst({ where: { title: listing.title } });
        if (existing) {
          await prisma.listing.update({ where: { id: existing.id }, data: listing });
          console.log(`  ✅ Listing updated: ${listing.title}`);
        } else {
          await prisma.listing.create({ data: listing });
          console.log(`  ✅ Listing: ${listing.title}`);
        }
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
      }
    }
  }
  // ---------------------------------------------------------------- admin
  // content: agents, categories, properties, hostels and the settings row.
  // These used to be Firestore documents, so nothing existed in SQLite and the
  // administrator console opened on empty tables.
  console.log("\n🧑‍💼  Seeding agents, categories and properties...\n");

  const agents = [
    {
      name: "Grace Njoki",
      phone: "+254712345678",
      whatsappNumber: "254712345678",
      profilePhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      isActive: true,
    },
    {
      name: "Samuel Kiptoo",
      phone: "+254723456789",
      whatsappNumber: "254723456789",
      profilePhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      isActive: true,
    },
    {
      name: "Faith Wambui",
      phone: "+254734567890",
      whatsappNumber: "254734567890",
      profilePhotoUrl: null,
      isActive: false,
    },
  ];

  const agentIds: string[] = [];
  for (const agent of agents) {
    try {
      const existing = await prisma.agent.findFirst({ where: { name: agent.name } });
      const row = existing
        ? await prisma.agent.update({ where: { id: existing.id }, data: agent })
        : await prisma.agent.create({ data: agent });
      agentIds.push(row.id);
      console.log(`  ✅ Agent: ${row.name}`);
    } catch (error) {
      console.error(`  ❌ Agent error: ${error.message}`);
    }
  }

  const categories = [
    { name: "Hostels", slug: "hostels", isActive: true, sortOrder: 1 },
    { name: "Bedsitters", slug: "bedsitters", isActive: true, sortOrder: 2 },
    { name: "Studio Apartments", slug: "studio-apartments", isActive: true, sortOrder: 3 },
    { name: "Shared Apartments", slug: "shared-apartments", isActive: true, sortOrder: 4 },
  ];

  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    try {
      const row = await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
      categoryIds[category.slug] = row.id;
      console.log(`  ✅ Category: ${row.name}`);
    } catch (error) {
      console.error(`  ❌ Category error: ${error.message}`);
    }
  }

  const properties = [
    {
      title: "Sunrise Hostel — JKUAT Gate A",
      categorySlug: "hostels",
      price: 12000,
      deposit: 12000,
      location: "Juja, near JKUAT Gate A",
      latitude: -1.0967,
      longitude: 37.0076,
      description:
        "Twin and single hostel rooms with hot showers, 24/7 water and fibre internet. Gated compound with a resident warden.",
      features: ["WiFi", "Hot water", "Security", "Study room", "Laundry"],
      status: "available",
      media: [
        {
          public_id: "seed/hostel-1",
          secure_url: "/listing-hostel.jpg",
          resource_type: "image",
          format: "jpg",
          order: 0,
        },
        {
          public_id: "seed/twin-1",
          secure_url: "/listing-twin-hostel.jpg",
          resource_type: "image",
          format: "jpg",
          order: 1,
        },
      ],
    },
    {
      title: "Riverside Bedsitter — KU",
      categorySlug: "bedsitters",
      price: 15000,
      deposit: 15000,
      location: "Kahawa Wendani, near Kenyatta University",
      latitude: -1.1715,
      longitude: 36.9556,
      description:
        "Self-contained bedsitter with a separate kitchen and bathroom, five minutes from the KU main gate.",
      features: ["Private kitchen", "Water", "Parking", "Security"],
      status: "available",
      media: [
        {
          public_id: "seed/bedsitter-1",
          secure_url: "/listing-bedsitter.jpg",
          resource_type: "image",
          format: "jpg",
          order: 0,
        },
      ],
    },
    {
      title: "Studio 9 — Strathmore",
      categorySlug: "studio-apartments",
      price: 28000,
      deposit: 28000,
      location: "Madaraka, near Strathmore University",
      latitude: -1.31,
      longitude: 36.813,
      description:
        "Furnished studio with a work desk and fast internet, ideal for postgraduates on placement in Nairobi.",
      features: ["Furnished", "WiFi", "Backup power", "Lift"],
      status: "occupied",
      media: [
        {
          public_id: "seed/studio-1",
          secure_url: "/listing-studio.jpg",
          resource_type: "image",
          format: "jpg",
          order: 0,
        },
      ],
    },
    {
      title: "Riverside Shared Apartment — Moi",
      categorySlug: "shared-apartments",
      price: 9000,
      deposit: 9000,
      location: "Kesses, near Moi University",
      latitude: 0.0678,
      longitude: 35.2817,
      description:
        "Three-bedroom shared apartment with per-student pricing, a shared kitchen and a study lounge.",
      features: ["Shared kitchen", "WiFi", "Water", "Parking"],
      status: "available",
      media: [
        {
          public_id: "seed/shared-1",
          secure_url: "/listing-shared.jpg",
          resource_type: "image",
          format: "jpg",
          order: 0,
        },
      ],
    },
  ];

  for (const property of properties) {
    try {
      const { categorySlug, ...rest } = property;
      const payload = {
        title: rest.title,
        categoryId: categoryIds[categorySlug] ?? "",
        price: rest.price,
        deposit: rest.deposit,
        location: rest.location,
        latitude: rest.latitude,
        longitude: rest.longitude,
        description: rest.description,
        features: JSON.stringify(rest.features),
        agentId: agentIds[0] ?? "",
        status: rest.status,
        media: JSON.stringify(rest.media),
      };
      const existing = await prisma.property.findFirst({ where: { title: payload.title } });
      if (existing) {
        await prisma.property.update({ where: { id: existing.id }, data: payload });
      } else {
        await prisma.property.create({ data: payload });
      }
      console.log(`  ✅ Property: ${payload.title}`);
    } catch (error) {
      console.error(`  ❌ Property error: ${error.message}`);
    }
  }

  console.log("\n🏨  Seeding hostels...\n");
  const jkuat = await prisma.university.findUnique({ where: { slug: "jkuat" } });
  const uon = await prisma.university.findUnique({ where: { slug: "uon" } });
  const hostels = [
    {
      universityId: jkuat?.id ?? "",
      name: "Sunrise Hostel",
      location: "Juja, Gate A",
      description: "Twin and single rooms with hot water, WiFi and a resident warden.",
      hostelType: "mixed",
      images: JSON.stringify([
        {
          public_id: "seed/hostel-1",
          secure_url: "/listing-hostel.jpg",
          resource_type: "image",
          format: "jpg",
          order: 0,
        },
      ]),
      amenities: JSON.stringify(["WiFi", "Hot water", "Security", "Laundry"]),
      wardenName: "Mr. Kamau",
      wardenPhone: "+254711000111",
      wardenEmail: "warden@sunrisehostel.co.ke",
      status: "active",
    },
    {
      universityId: uon?.id ?? "",
      name: "Madaraka Girls Hostel",
      location: "Madaraka, Nairobi",
      description: "Girls-only hostel with a study room, CCTV and standby power.",
      hostelType: "girls",
      images: JSON.stringify([
        {
          public_id: "seed/hostel-2",
          secure_url: "/listing-video-female-hostel-poster.jpg",
          resource_type: "image",
          format: "jpg",
          order: 0,
        },
      ]),
      amenities: JSON.stringify(["WiFi", "CCTV", "Study room", "Backup power"]),
      wardenName: "Mrs. Otieno",
      wardenPhone: "+254722000222",
      wardenEmail: "warden@madarakagirls.co.ke",
      status: "active",
    },
  ];

  for (const hostel of hostels) {
    try {
      if (!hostel.universityId) continue;
      const existing = await prisma.hostel.findFirst({ where: { name: hostel.name } });
      if (existing) {
        await prisma.hostel.update({ where: { id: existing.id }, data: hostel });
      } else {
        await prisma.hostel.create({ data: hostel });
      }
      console.log(`  ✅ Hostel: ${hostel.name}`);
    } catch (error) {
      console.error(`  ❌ Hostel error: ${error.message}`);
    }
  }

  console.log("\n⚙️   Seeding site settings...\n");
  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        siteName: "UniHub",
        siteUrl: "http://localhost:8080",
        adminEmail: "admin@unihub.ke",
      },
      create: {
        id: "global",
        siteName: "UniHub",
        siteUrl: "http://localhost:8080",
        adminEmail: "admin@unihub.ke",
        maintenanceMode: false,
        maintenanceMessage: "We are currently performing scheduled maintenance.",
        heroTitle: "Find student housing near your campus",
        heroSubtitle: "Verified hostels, bedsitters and apartments across Kenya.",
        ctaText: "Browse listings",
      },
    });
    console.log("  ✅ Site settings ready");
  } catch (error) {
    console.error(`  ❌ Settings error: ${error.message}`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 TEST ACCOUNT CREDENTIALS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(
    "🔐 ADMIN\n   Email: admin@unihub.ke\n   Password: TestAdmin2024!\n   Access: /admin (requires VITE_ADMIN_EMAILS=admin@unihub.ke in .env)\n",
  );
  console.log(
    "🏠 LANDLORDS\n   Pending:    landlord.pending@unihub.ke    / Password: TestLandlord2024!\n   Approved:   landlord.approved@unihub.ke   / Password: TestLandlord2024!\n   Rejected:   landlord.rejected@unihub.ke   / Password: TestLandlord2024!\n   Suspended:  landlord.suspended@unihub.ke  / Password: TestLandlord2024!\n",
  );
  console.log("🎓 STUDENT/TENANT\n   Email: student@unihub.ke\n   Password: TestStudent2024!\n");
  console.log(
    "👁️  VIEWER (read-only)\n   Email: viewer@unihub.ke\n   Password: TestViewer2024!\n   Access: dashboard data only, no export, no admin write operations\n",
  );
  console.log(
    "🏛️ UNIVERSITY ADMIN\n   Email: university@unihub.ke\n   Password: TestUniversity2024!\n",
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  IMPORTANT: Change passwords after first login!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
