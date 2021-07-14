import React from 'react'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useAppStore } from '../store/appProvider'

// import { classNames } from "primereact/utils";
interface UserData {
	login: string
	password: string
}

const WebdavForm = ({ src }: { src: 'session' | 'app' }): JSX.Element => {
	// const [formData, setFormData] = useState({});
	const {
		user: [user, setUser],
	} = useAppStore()

	const formik = useFormik({
		initialValues: {
			login: '',
			password: '',
		},
		// validate: (data) => {
		//     console.log('validate')
		//   let errors: { login: string | undefined, password: string | undefined } = { login: undefined, password: undefined };

		//   if (!data.login) {
		//     errors.login = "Login is required.";
		//   }

		//   if (!data.password) {
		//     errors.password = "Password is required.";
		//   }

		//   console.log(errors)
		//   return errors;
		// },
		onSubmit: (data: UserData) => {
			// setFormData(data);
			setUser({ ...user, password: data.password, src })

			// formik.resetForm();
		},
	})

	//   const isFormFieldValid = (name: string) => !!(formik.touched[name] && formik.errors[name]);
	//   const getFormErrorMessage = (name: string) => {
	//       return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
	//   };

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<div className='p-field p-grid'>
					<label
						htmlFor='login'
						className='p-col-fixed'
						style={{ width: '100px' }}
						// className={classNames({ "p-error": isFormFieldValid("login") })}
					>
						Login *
					</label>
					<div className='p-col'>
						<InputText
							id='login'
							name='login'
							value={user?.uid}
							onChange={formik.handleChange}
							disabled
							// className={classNames({ "p-invalid": isFormFieldValid("login") })}
						/>
					</div>

					{/* {getFormErrorMessage("login")} */}
				</div>
				<div className='p-field p-grid'>
					<label
						htmlFor='password'
						className='p-col-fixed'
						style={{ width: '100px' }}
					>
						Password *
					</label>
					<div className='p-col'>
						<InputText
							id='password'
							type='password'
							value={formik.values.password}
							onChange={formik.handleChange}
							autoFocus
						/>
					</div>
				</div>
				<Button
					type='submit'
					label='Submit'
					className='p-mt-2'
					style={{ float: 'right' }}
				/>
			</form>
		</>
	)
}

export default WebdavForm
