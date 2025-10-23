import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const andi = await prisma.user.upsert({
    where: { handle: 'Andi' },
    update: {},
    create: {
      name: 'Andrew Kim',
      handle: 'Andi',
      email: 'andi@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      role: 'project_author',
      status: 'active',
      bio: 'Technical Lead at Salamander'
    }
  });

  const charles = await prisma.user.upsert({
    where: { handle: 'Charles' },
    update: {},
    create: {
      name: 'Charles Mbugua',
      handle: 'Charles',
      email: 'charles@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      role: 'maintainer',
      status: 'active'
    }
  });

  const festus = await prisma.user.upsert({
    where: { handle: 'festuspro' },
    update: {},
    create: {
      name: 'Festus Pro',
      handle: 'festuspro',
      email: 'festus@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      role: 'user',
      status: 'active'
    }
  });

  const community = await prisma.community.upsert({
    where: { slug: 'andi-nauranat' },
    update: {},
    create: {
      name: 'Andi - "NauraNat"',
      slug: 'andi-nauranat',
      description: 'Technical Lead at Salamander',
      imageUrl: 'https://picsum.photos/seed/community1/400/200',
      ownerId: andi.id,
      memberCount: 1
    }
  });

  await prisma.communityMembership.upsert({
    where: { communityId_userId: { communityId: community.id, userId: andi.id } },
    update: {},
    create: {
      communityId: community.id,
      userId: andi.id,
      role: 'owner'
    }
  });

  await prisma.activity.create({
    data: {
      userId: andi.id,
      type: 'join_community',
      targetType: 'community',
      targetId: community.id,
      metadata: { note: 'joined via seed' }
    }
  });

  await prisma.report.create({
    data: {
      reporterId: festus.id,
      reportedUserId: andi.id,
      communityId: community.id,
      description: 'Spam behavior observed',
      evidence: []
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
