exports.handler = async function(event) {
  try {
    const { q } = JSON.parse(event.body);
    const url = `https://serpapi.com/search.json?engine=google_maps&q=${q}&api_key=${process.env.SERP_KEY}&type=search`;
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
