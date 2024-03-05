import db from '../../../utils/db';

export default async (req: any, res: any) => {
  const { id } = req.query;

  try {
    if (req.method === 'POST') {
      await db.collection('users').doc(id).create({
        ...req.body,
        updated: new Date().toISOString(),
        created: new Date().toISOString(),
      });
    } else if (req.method === 'PUT') {
      await db.collection('users').doc(id).update({
        ...req.body,
        updated: new Date().toISOString(),
      });
    } else if (req.method === 'GET') {
      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) {
        res.status(404).json({ status: 404 });
      } else {
        res.status(200).json(doc.data());
      }
    } else if (req.method === 'DELETE') {
      await db.collection('users').doc(id).delete();
    }
    res.status(200).end();
  } catch (e) {
    res.status(400).end();
  }
}