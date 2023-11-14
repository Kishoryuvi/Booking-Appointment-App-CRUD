let myForm = document.getElementById('my-form');
let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
let mobileInput = document.getElementById('mobile');
let mssg = document.querySelector('.msg');
let userList = document.getElementById('users');

//Listen for Form Submit
myForm.addEventListener('submit' , onSubmit);

function onSubmit(e) {
    e.preventDefault();

    if(nameInput.value === "" || emailInput.value === "" || mobileInput.value === ""){
        //Display an error message
        mssg.classList.add('error');
        mssg.textContent = 'Please enter all fields';

        // Remove error after 3 seconds
        setTimeout(() => mssg.remove(), 3000);
    }else{
        //get user input values
         let name = e.target.name.value;
         let email = e.target.email.value;
         let mobile = e.target.mobile.value;

         let user = {
             name,
             email,
             mobile
         };
        
        //  Saving the user Details on Crud Crud

        axios.post("https://crudcrud.com/api/ec9d5ab6f8fe4bf99e49669b54cf185c/appointmentData", user, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            showUserOnScreen(response.data);
            console.log(response);
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h4> Something went wrong </h4>";
            console.log(err);
        });

        // localStorage.setItem(user.name , JSON.stringify(user));
        // showUserOnScreen(user);

    }
}


// Get the saved User Details from crudcrud.

window.addEventListener("DOMContentLoaded" , () => {
    axios.get("https://crudcrud.com/api/ec9d5ab6f8fe4bf99e49669b54cf185c/appointmentData")
      .then((res) => {
        console.log(res)
        for(var i=0;i<res.data.length;i++){
            showUserOnScreen(res.data[i]);
        }
      })
      .catch((error) => console.log(error))
  })


function showUserOnScreen(user){
        let li = document.createElement('li');
        let details = document.createTextNode(`${user.name} : ${user.email} : ${user.mobile} `);

        let deleteBtn = document.createElement('input');
        deleteBtn.type = 'button';
        deleteBtn.value = "Delete";
        deleteBtn.style.backgroundColor = 'lightPink';
        deleteBtn.onclick = () => {
            // localStorage.removeItem(user.name);
            userList.removeChild(li);

            //Sending a DELETE Request to CRUD API

            axios.delete(`https://crudcrud.com/api/ec9d5ab6f8fe4bf99e49669b54cf185c/appointmentData/${user._id}`)
            .then((res) => {
                userList.removeChild(li);
            })
            .catch((error) => console.log(error));
            
        }

        let editBtn = document.createElement('input');
        editBtn.type = 'button';
        editBtn.value = 'Edit';
        editBtn.style.backgroundColor = 'skyBlue';
        editBtn.onclick = () => {
            localStorage.removeItem(user.name);
            userList.removeChild(li);
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('mobile').value = user.mobile;

            
            // Update the user Details

            myForm.removeEventListener('submit', onSubmit);

            myForm.addEventListener('submit' , (e) => {
            e.preventDefault();

            const updatedUser = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                mobile: document.getElementById('mobile').value
            };

            axios
              .put(`https://crudcrud.com/api/ec9d5ab6f8fe4bf99e49669b54cf185c/appointmentData/${user._id}`, updatedUser)
              .then((res) => {
                //Update the user object
                user.name = updatedUser.name;
                user.email = updatedUser.email;
                user.mobile = updatedUser.mobile;
                //Update the details text node
                details.nodeValue = `${user.name} : ${user.email} : ${user.mobile}`;
                //Clear the form after updating
                nameInput.value = '';
                emailInput.value = '';
                mobileInput.value = '';
              })
              .catch((error) => console.log(error))

              //Restore the original Event Listener
              myForm.addEventListener('submit' , onSubmit);
        })


        }

        li.appendChild(details);
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);
        userList.appendChild(li);

        //Clear Fields
        nameInput.value = ' ';
        emailInput.value = ' ';
        mobileInput.value = ' ';
