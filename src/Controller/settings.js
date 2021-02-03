const changeUsername = ()=>{
    let username = document.querySelector("#changeUsername_Username").value;
    let password = document.querySelector("#changeUsername_Password").value;
    ipcRenderer.send("change:username", {username: username, password: password});
    
    setTimeout(() => {
        document.querySelector("#changeUsername_Username").value = ""
        document.querySelector("#changeUsername_Password").value = ""
    }, 1000);
}

const changePassword = ()=>{
    let oldPassword = document.querySelector("#oldPassword").value;
    let newPassword = document.querySelector("#newPassword").value;
    let confirmPassword = document.querySelector("#confirmPassword").value;


    ipcRenderer.send("change:password", { oldPassword, newPassword, confirmPassword });
    
    setTimeout(() => {
        document.querySelector("#oldPassword").value = ""
        document.querySelector("#newPassword").value = ""
        document.querySelector("#confirmPassword").value = ""
    }, 1000);
}


//showing password

const showPassword = (id, eye_id)=>{
    const textinput = document.querySelector("#"+id)
    const targetEye = document.querySelector("#"+eye_id)

    if(textinput.type == "text"){
        textinput.type = "password"
        targetEye.src="../assets/icons/eye-closed.svg"

    }else{
        textinput.type = "text"
        targetEye.src="../assets/icons/eye.svg"
    }
}