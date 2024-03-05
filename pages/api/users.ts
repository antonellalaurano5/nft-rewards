import db from '../../utils/db';

export default async (req: any, res: any) => {
  try {
    const users = await db.collection('users').orderBy('created').get();
    const usersData = users.docs.map(user => ({
      id: user.id,
      ...user.data()
    }));
    res.status(200).json({ usersData });
  } catch (e) {
    res.status(400).end();
  }
}