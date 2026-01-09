async function testChat() {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: "test",
                hexagon: { boldness: 0.5, materialValue: 0.8, utility: 0.5, reliability: 0.5, comfort: 0.5, exclusivity: 0.5 }
            })
        });
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testChat();
