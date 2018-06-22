// Back anchor link
function goBack() {
    window.history.back();
}

// ==============
// Requests logic
// ==============

export class ServerRequest {
    // Make HTTP GET request
    get(url) {
        return new Promise((resolve, reject) => {
            fetch(url, { credentials: 'include' })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        });
    }

    // Make HTTP POST request
    post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, { 
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        });
    }
}
