import db from '../../../utils/db';

export default async (req: any, res: any) => {
  try {
    const { slug } = req.body;
    const users = await db.collection('users').get();
    const usersData = users.docs.map(user => user.data());

    if (usersData.some(user => user.slug === slug)) {
      res.status(400).end();
    } else {
      const { id } = await db.collection('users').add({
        ...req.body,
        created: new Date().toISOString(),
      });
      res.status(200).json({ id });
    }
  } catch (e) {
    res.status(400).end();
  }
}