function signIn() {

    let uname = getEl('username').value;
    let pword = getEl('password').value;
    
    fetch('https://freddy.codesubmit.io/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify({
            username: uname,
            password: pword
        })
    })
    .then( res =>{
        console.log(res)
        return res.json()
    })
    .then( data =>{
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        window.location.assign('./dashboard.html')
    })
    .catch(err=>console.log(err))
}

function getEl(arg){
    return document.getElementById(arg);
}