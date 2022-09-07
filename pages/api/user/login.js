import axios from 'axios';

const apiKey = process.env.SITE_API_KEY;
const baseUrl = process.env.SITE_API_URL;

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405);
    res.json({ error: 'Invaid Method' });
    return;
  }

  try {
    const response = await axios({
      headers: {
        XApiKey: apiKey,
      },
      method: 'POST',
      url: `${baseUrl}/UserLogin`,
      data: req.body,
    });

    if (response) {
      res.status(200);
      res.json(response.data);
    } else {
      res.status(200);
      res.json({ result: 'error' });
    }
  } catch (error) {
    res.status(500);
    res.json({ error: error });
  }
};
export default handler;
