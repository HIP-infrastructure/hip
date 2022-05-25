import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useNotification } from '../../../../hooks/useNotification'
import { useAppStore } from '../../../../store/appProvider'

type IField = Record<string, string>

const validationSchema = Yup.object().shape({
    participant_id: Yup.string().required('ID is required'),
    age: Yup.string().required('Age is required'),
    sex: Yup.string().required('Sex is required'),
})

interface ICreateDatabase {
    open: boolean
    handleClose: () => void
    setParticipantCreated: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateParticipant = ({
    open,
    handleClose,
    setParticipantCreated,
}: ICreateDatabase) => {
    const { showNotif } = useNotification()
    const [submitted, setSubmitted] = useState(false)
    const [fields, setFields] = useState<string[]>(['participant_id', 'age', 'sex'])
    const {
        containers: [containers],
        user: [user, setUser],
        bidsDatabases: [bidsDatabases, setBidsDatabases],
        selectedBidsDatabase: [selectedBidsDatabase, setSelectedBidsDatabase],
        selectedParticipants: [selectedParticipants, setSelectedParticipants],
        selectedFiles: [selectedFiles, setSelectedFiles],
    } = useAppStore()

    useEffect(() => {
        if (selectedBidsDatabase?.participants) {
            const one = JSON.parse(JSON.stringify(selectedBidsDatabase.participants)).pop()
            if (one) {
                const participantFields = Object.keys(one)
                setFields(participantFields)
            }
        }
    }, [selectedBidsDatabase])

    const initialValues = fields?.reduce((a, f) => ({ ...a, [f]: '' }), {})

    return (
        <Dialog open={open} sx={{ minWidth: '360' }}>
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant='h6'>Create Participant</Typography>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>

            {initialValues && (
                <Formik
                    initialValues={initialValues}
                    // validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        setSubmitted(true)
                        setSelectedParticipants([values])

                        const nextParticipants = [...(selectedBidsDatabase?.participants || []), values]
                        if (nextParticipants) setSelectedBidsDatabase({
                            ...selectedBidsDatabase,
                            participants: nextParticipants})

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
                                        return (
                                            <Grid item xs={6} key={field}>
                                                <TextField
                                                    key={field}
                                                    disabled={submitted}
                                                    size='small'
                                                    fullWidth
                                                    name={field}
                                                    label={field}
                                                    value={(values as IField)[field]}
                                                    onChange={handleChange}
                                                    error={(touched as IField)[field] && (errors as IField)[field] ? true : false}
                                                    helperText={
                                                        (touched as IField)[field] && (errors as IField)[field]
                                                            ? (errors as IField)[field]
                                                            : null
                                                    }
                                                />
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    disabled={submitted}
                                    color='error'
                                    onClick={handleClose}
                                >
                                    Close
                                </Button>
                                <LoadingButton
                                    color='primary'
                                    type='submit'
                                    loading={submitted}
                                    loadingPosition='start'
                                    startIcon={<Save />}
                                    variant='contained'
                                >
                                    Save
                                </LoadingButton>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            )}
        </Dialog>
    )
}

export default CreateParticipant
