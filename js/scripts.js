class Form {
	constructor(main) {
		const selectors = {
			form: '#form',
			field: '.cmp-form-field',
			formModal: '#formModal',
			btnCloseModal: '.close'
		}
		const objects = {
			form: main.querySelector(selectors.form),
			fields: [].slice.call(main.querySelectorAll(selectors.field)),
			formModal: main.querySelector(selectors.formModal),
			btnCloseModal: main.querySelector(selectors.btnCloseModal)
		}
		const dynamicClasses = {
			focused: 'cmp-form-field--focus',
			activated: 'cmp-form-field--activated'
		}

		const formField = element => validations => {
			const input = element.querySelector('input')
			input.addEventListener('focus', e => element.classList.add(dynamicClasses.focused))
			input.addEventListener('blur', e => {
				element.classList.remove(dynamicClasses.focused)
				if (input.value !== '') { element.classList.add(dynamicClasses.activated) } 
				else { element.classList.remove(dynamicClasses.activated) }
			})
			input.addEventListener('keydown', e => {
				element.classList.toggle(dynamicClasses.activated, input.value !== '')
			})
			const isTrue = value => value === true
			return {
				populated: () => input.value > 0,
				isValid: () => validations.map(x => x(input.value)).every(isTrue)
			}
		}
		const fields = objects.fields.map(x => formField(x)())
		window.fields = fields
		
		const formSubmitted = () => {
			var modalContSubmission = document.getElementById('formModal').querySelector('ul')
			modalContSubmission.innerHTML = ''
			objects.fields.forEach(item => {
				let input = item.querySelector('input')
				let label = item.querySelector('label')
				modalContSubmission.innerHTML += '<li>' + label.textContent + ': <strong>' + input.value + '</strong></li>'
			})
			objects.formModal.style.display = "block"
		}
		const submitForm = event => {
			event.preventDefault()
			fetch('https://jsonplaceholder.typicode.com/posts', {
				method: 'POST',
				body: JSON.stringify(Object.fromEntries(new FormData(event.target))),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json()
				}
				return Promise.reject(response)
			}).then(function (data) {
				console.log(data)
				formSubmitted()
			}).catch(function (error) {
				console.warn(error)
			})
		}
		const closeModal = e => {
			objects.fields.forEach(item => {
				item.classList.remove(dynamicClasses.activated)
			})
			objects.form.reset()
			objects.formModal.style.display = "none"
		}
		const init = () => {
			document.addEventListener('submit', function(event) { submitForm(event) })
			objects.btnCloseModal.addEventListener('click', closeModal)
			window.addEventListener('click', function(e) {
				if (e.target == formModal) { closeModal() }
			})
		}
		init()
	}
}
const form = [].slice.call(document.querySelectorAll('.cmp-form'))
form.map(x => new Form(x))
