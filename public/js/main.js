// Back anchor link
function goBack() {
    window.history.back();
}

export function flashMessage(state) {
    let message = document.querySelector('.flashMessage')
    // if(message.innerHTML !== ''){
    //     message.innerHTML = '';
    // }
    if(state.state === 'error'){
        message.innerHTML = `
        <div class="container">
            <div class="alert alert-danger" role="alert">
                ${state.message}
            </div>
        </div>
        `
    } else if(state.state !== 'error') {
        message.innerHTML = `
        <div class="container">
            <div class="alert alert-success" role="alert">
                ${state.message}
            </div>
        </div>
        `
    }
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
