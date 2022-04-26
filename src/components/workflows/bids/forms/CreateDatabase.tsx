import { Close } from '@mui/icons-material'
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useNotification } from '../../../../hooks/useNotification'

const validationSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    BIDSVersion: Yup.string().required('BIDS Version is required'),
})

const CreateDatabase = ({ open, handleClose }: { open: any, handleClose: any }) => {
    const { showNotif } = useNotification()
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        if (isSubmitted) {
            handleClose()
        }
    }, [isSubmitted])

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                Create a New BIDS Database
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Formik
                initialValues={{
                    Name: '',
                    BIDSVersion: '',
                    Licence: '',
                    Authors: [],
                    Acknowledgements: '',
                    HowToAcknowledge: '',
                    Funding: [],
                    ReferencesAndLinks: [],
                    DatasetDOI: ''
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    if (true) {
                        setSubmitting(false)
                        resetForm({ values: '' })

                        setIsSubmitted(true)
                        showNotif('Database created. Wait for reload', 'success')
                    }
                }}
            >
                {({ errors, handleChange, touched, values }: { errors: any, handleChange: any, touched: any, values: any }) => (
                    <Form>
                        <DialogContent dividers>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
                                        name="name"
                                        label="Licence"
                                        value={values.Licence}
                                        onChange={handleChange}
                                        error={touched.Licence && errors.Licence ? true : false}
                                        helperText={touched.Licence && errors.Licence ? errors.Licence : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
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
                                        size="small"
                                        variant="standard"
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