import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, TextField, Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { createBidsDatabase } from '../../../../api/bids'
import { CreateBidsDatabaseDto } from '../../../../api/types'
import { useNotification } from '../../../../hooks/useNotification'
import { useAppStore } from '../../../../store/appProvider'

const validationSchema = Yup.object().shape({
    participant_id: Yup.string().required('ID is required'),
    age: Yup.string().required('Age is required'),
    sex: Yup.string().required('Sex is required'),
})


interface ICreateDatabase {
    open: boolean
    handleClose: () => void
    setDatabaseCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateParticipant = ({ open, handleClose, setDatabaseCreated }: ICreateDatabase) => {
    const { showNotif } = useNotification()
    const [submitted, setSubmitted] = useState(false)
    const [fields, setFields] = useState<string[]>(null)
    const {
        containers: [containers],
        user: [user, setUser],
        bidsDatabases: [bidsDatabases, setBidsDatabases],
        selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
        participants: [participants, setParticipants],
        selectedParticipants: [selectedParticipants, setSelectedParticipants],
        selectedFiles: [selectedFiles, setSelectedFiles]
    } = useAppStore()

    useEffect(() => {
        if (participants) {
            const one = JSON.parse(JSON.stringify(participants)).pop()
            if (one) {
                const participantFields = Object.keys(one)
                setFields(participantFields)
            } else {
                setFields(['participant_id', 'age', 'sex'])
            }
        }
    }, [participants])


    const initialValues = fields?.reduce((a, f) => ({ ...a, [f]: '' }), {})


    return (
        <Dialog open={open} sx={{ minWidth: '360' }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" >Create Participant</Typography>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            {initialValues && <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    setSubmitted(true)
                    setSelectedParticipants([values])

                    const nextParticipants = [...(participants || []), values]
                    if (nextParticipants)
                        setParticipants(nextParticipants)

                    resetForm()
                    showNotif('Participant created.', 'success')
                    setSubmitted(false)
                    handleClose()
                }}
            >
                {({ errors, handleChange, touched, values }) => (
                    <Form>
                        <DialogContent dividers>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                                {fields?.map(field => {

                                    return <Grid item xs={6}>
                                        <TextField
                                            key={field}
                                            disabled={submitted}
                                            size="small"
                                            fullWidth
                                            name={field}
                                            label={field}
                                            value={values[field]}
                                            onChange={handleChange}
                                            error={touched[field] && errors[field] ? true : false}
                                            helperText={touched[field] && errors[field] ? errors[field] : null}
                                        />
                                    </Grid>
                                })}
                                {
                                /* 
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
                                </Grid> */}
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
            }
        </Dialog>
    )
}

export default CreateParticipant