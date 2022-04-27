import { Close } from '@mui/icons-material'
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField
} from '@mui/material'
import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { createBidsDatabase } from '../../../../api/bids'
import { CreateBidsDatabaseDto } from '../../../../api/types'
import { useNotification } from '../../../../hooks/useNotification'
import { useAppStore } from '../../../../store/appProvider'

const validationSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    BIDSVersion: Yup.string().required('BIDS Version is required'),
})

const initialValues = {
    Name: '',
    BIDSVersion: '',
    Licence: '',
    Authors: [],
    Acknowledgements: '',
    HowToAcknowledge: '',
    Funding: [],
    ReferencesAndLinks: [],
    DatasetDOI: ''
}

interface ICreateDatabase {
    open: boolean
    handleClose: () => void
    setDatabaseCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateDatabase = ({ open, handleClose, setDatabaseCreated }: ICreateDatabase) => {
    const { showNotif } = useNotification()
    const { user: [user, setUser] } = useAppStore()

    return (
        <Dialog open={open} maxWidth="sm" sx={{ display: 'flex', justifyContent: 'space-between' }} fullWidth>
            <DialogTitle>
                Create a New BIDS Database
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    if (user && user.uid) {
                        setSubmitting(true)
                        
                        const createBidsDatabaseDto: CreateBidsDatabaseDto = {
                            owner: user.uid,
                            database: values.Name,
                            DatasetDescJSON: {
                                ...values
                            }
                        }
                        const cd = await createBidsDatabase(createBidsDatabaseDto)
                        if (cd.error) {
                            showNotif('Database not created, please try again', 'error')
                        }

                        setSubmitting(false)
                        showNotif('Database created. Wait for reload', 'success')
                        resetForm({ values: initialValues })
                        setDatabaseCreated(true)
                        handleClose()
                    }
                }}
            >
                {({ errors, handleChange, touched, values }) => (
                    <Form>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="Name"
                                        label="Name"
                                        value={values.Name}
                                        onChange={handleChange}
                                        error={touched.Name && errors.Name ? true : false}
                                        helperText={touched.Name && errors.Name ? errors.Name : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="BIDSVersion"
                                        label="BIDSVersion"
                                        value={values.BIDSVersion}
                                        onChange={handleChange}
                                        error={touched.BIDSVersion && errors.BIDSVersion ? true : false}
                                        helperText={touched.BIDSVersion && errors.BIDSVersion ? errors.BIDSVersion : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="Licence"
                                        label="Licence"
                                        value={values.Licence}
                                        onChange={handleChange}
                                        error={touched.Licence && errors.Licence ? true : false}
                                        helperText={touched.Licence && errors.Licence ? errors.Licence : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="Authors"
                                        label="Authors"
                                        value={values.Authors}
                                        onChange={handleChange}
                                        error={touched.Authors && errors.Authors ? true : false}
                                        helperText={touched.Authors && errors.Authors ? errors.Authors : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="Acknowledgements"
                                        label="Acknowledgements"
                                        value={values.Acknowledgements}
                                        onChange={handleChange}
                                        error={touched.Acknowledgements && errors.Acknowledgements ? true : false}
                                        helperText={touched.Acknowledgements && errors.Acknowledgements ? errors.Acknowledgements : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="HowToAcknowledge"
                                        label="HowToAcknowledge"
                                        value={values.HowToAcknowledge}
                                        onChange={handleChange}
                                        error={touched.HowToAcknowledge && errors.HowToAcknowledge ? true : false}
                                        helperText={touched.HowToAcknowledge && errors.HowToAcknowledge ? errors.HowToAcknowledge : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="Funding"
                                        label="Funding"
                                        value={values.Funding}
                                        onChange={handleChange}
                                        error={touched.Funding && errors.Funding ? true : false}
                                        helperText={touched.Funding && errors.Funding ? errors.Funding : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="ReferencesAndLinks"
                                        label="ReferencesAndLinks"
                                        value={values.ReferencesAndLinks}
                                        onChange={handleChange}
                                        error={touched.ReferencesAndLinks && errors.ReferencesAndLinks ? true : false}
                                        helperText={touched.ReferencesAndLinks && errors.ReferencesAndLinks ? errors.ReferencesAndLinks : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="DatasetDOI"
                                        label="DatasetDOI"
                                        value={values.DatasetDOI}
                                        onChange={handleChange}
                                        error={touched.DatasetDOI && errors.DatasetDOI ? true : false}
                                        helperText={touched.DatasetDOI && errors.DatasetDOI ? errors.DatasetDOI : null}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button color="error" onClick={handleClose}>
                                Close
                            </Button>
                            <Button type="submit" color="primary" variant="contained">
                                Create
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default CreateDatabase