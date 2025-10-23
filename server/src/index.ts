import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

// Example: list users
app.get('/users', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
  res.json(users);
});

// Example: create community
app.post('/communities', async (req: Request, res: Response) => {
  const { name, slug, description, ownerId } = req.body;
  const community = await prisma.community.create({
    data: { name, slug, description, ownerId }
  });
  res.status(201).json(community);
});

// List communities
app.get('/communities', async (_req: Request, res: Response) => {
  const communities = await prisma.community.findMany({ take: 50, orderBy: { memberCount: 'desc' } });
  res.json(communities);
});

// Join a community
app.post('/communities/:id/join', async (req: Request, res: Response) => {
  const communityId = req.params.id;
  const { userId } = req.body as { userId?: string };
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const membership = await prisma.communityMembership.upsert({
    where: { communityId_userId: { communityId, userId } },
    update: { isBanned: false },
    create: { communityId, userId }
  });

  // increment member_count
  const count = await prisma.communityMembership.count({ where: { communityId, isBanned: false } });
  await prisma.community.update({ where: { id: communityId }, data: { memberCount: count } });

  res.status(201).json(membership);
});

// Leave a community
app.post('/communities/:id/leave', async (req: Request, res: Response) => {
  const communityId = req.params.id;
  const { userId } = req.body as { userId?: string };
  if (!userId) return res.status(400).json({ error: 'userId required' });

  await prisma.communityMembership.deleteMany({ where: { communityId, userId } });
  const count = await prisma.communityMembership.count({ where: { communityId, isBanned: false } });
  await prisma.community.update({ where: { id: communityId }, data: { memberCount: count } });

  res.json({ ok: true });
});

// Follow a user
app.post('/users/:id/follow', async (req: Request, res: Response) => {
  const followeeId = req.params.id;
  const { followerId } = req.body as { followerId?: string };
  if (!followerId) return res.status(400).json({ error: 'followerId required' });

  const follow = await prisma.follow.create({ data: { followerId, followeeId } });
  res.status(201).json(follow);
});

// Unfollow
app.post('/users/:id/unfollow', async (req: Request, res: Response) => {
  const followeeId = req.params.id;
  const { followerId } = req.body as { followerId?: string };
  if (!followerId) return res.status(400).json({ error: 'followerId required' });

  await prisma.follow.deleteMany({ where: { followerId, followeeId } });
  res.json({ ok: true });
});

// List activities (recent)
app.get('/activities', async (_req: Request, res: Response) => {
  const activities = await prisma.activity.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
  res.json(activities);
});

// Notifications for a user
app.get('/users/:id/notifications', async (req: Request, res: Response) => {
  const userId = req.params.id;
  const notifications = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json(notifications);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
