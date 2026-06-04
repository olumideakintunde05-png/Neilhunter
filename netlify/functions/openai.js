exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_KEY
      },
      body: JSON.stringify(body)
    });
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
