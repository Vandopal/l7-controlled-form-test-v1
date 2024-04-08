import axios from "axios";

export default () => {
    const formHTML = `
      <form id="registrationForm">
        <div class="form-group">
          <label for="inputName">Name</label>
          <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="form-group">
          <label for="inputEmail">Email</label>
          <input type="text" class="form-control" id="inputEmail" placeholder="Введите email"
          name="email" required>
          <div class="invalid-feedback"></div>
        </div>
        <input type="submit" value="Submit" class="btn btn-primary" disabled>
      </form>`;
      
    const formContainer = document.querySelector('.form-container');   
    formContainer.innerHTML = formHTML;
    const form = document.getElementById('registrationForm');
    const submit = form.querySelector('input[type="submit"]');
    const inputs = form.querySelectorAll('input[name="name"], input[name="email"]');
    
    const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
    const validateEmail = (email) => (/\S+@\S+/.test(email) ? [] : ['invalid email']);
    
    const showErrors = (input, errors) => {
        const errorContainer = input.parentElement.querySelector('.invalid-feedback');
        errorContainer.textContent = errors.join(', ');
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    };
    
    const clearErrors = (input) => {
        const errorContainer = input.parentElement.querySelector('.invalid-feedback');
        errorContainer.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    };
    
    const updateSubmitButton = () => {
        const isValid = Array.from(inputs).every(input => input.classList.contains('is-valid'));
        submit.disabled = !isValid;
    };
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const name = input.getAttribute('name');
            const value = input.value.trim();
            const errors = name === 'name' ? validateName(value) : validateEmail(value);
            if (errors.length > 0) {
                showErrors(input, errors);
            } else {
                clearErrors(input);
            }
            state.values[name] = value;
            updateSubmitButton();
        });
    });
    
    const state = {
        errors: {
            name: '',
            email: ''
        },   
        values: {
            name: '',
            email: ''
        }
    };
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        axios.post('/users', Object.fromEntries(formData))
            .then(response => {
                document.body.innerHTML = `<p>${response.data.message}</p>`; 
            })
            .catch(error => {
                console.error(error);
            });
    });
};