import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, TextField, Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
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
    sub: '',
    age: '',
    sex: '',
}

interface ICreateDatabase {
    open: boolean
    handleClose: () => void
    setDatabaseCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateParticipant = ({ open, handleClose, setDatabaseCreated }: ICreateDatabase) => {
    const { showNotif } = useNotification()
    const [submitted, setSubmitted] = useState(false)
    const { user: [user] } = useAppStore()

    return (
        <Dialog open={open} sx={{ minWidth: '360' }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography component="h6">Create Participant</Typography>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {

                    setSubmitted(true)
                    showNotif('Database created. Wait for reload', 'success')
                    handleClose()

                }}
            >
                {({ errors, handleChange, touched, values }) => (
                    <Form>
                        <DialogContent dividers>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        disabled={submitted}
                                        name="sub"
                                        label="Sub"
                                        value={values.sub}
                                        onChange={handleChange}
                                        error={touched.sub && errors.sub ? true : false}
                                        helperText={touched.sub && errors.sub ? errors.sub : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        disabled={submitted}
                                        name="age"
                                        label="Age"
                                        value={values.age}
                                        onChange={handleChange}
                                        error={touched.age && errors.age ? true : false}
                                        helperText={touched.age && errors.age ? errors.age : null}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        disabled={submitted}
                                        name="sex"
                                        label="Sex"
                                        value={values.sex}
                                        onChange={handleChange}
                                        error={touched.sex && errors.sex ? true : false}
                                        helperText={touched.sex && errors.sex ? errors.sex : null}
                                    >
                                        <MenuItem key={'f'} value={'f'}>
                                            F
                                        </MenuItem>
                                        <MenuItem key={'m'} value={'m'}>
                                            M
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions>
                            <Button disabled={submitted} color="error" onClick={handleClose}>
                                Close
                            </Button>
                            <LoadingButton
                                color="primary"
                                type="submit"
                                loading={submitted}
                                loadingPosition="start"
                                startIcon={<Save />}
                                variant="contained"
                            >
                                Save
                            </LoadingButton>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default CreateParticipant