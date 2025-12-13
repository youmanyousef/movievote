// wait script. polls the server until its time to go to next onerror
// 
async function pollingFunction(code) {
	const url = '/vote/wait/choices';
	fetch(url, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: `code=${code}`
		}).then(response => {
			if (!response.ok) {
				throw new Error('Network error. Something went wrong. Go back to the home page.');
			}
			return response.json();
		}).then (data => {
			console.log(data);
		}).catch(error => {
			console.error('Something went wrong. Go back to the home page.', error);
		});
	
}