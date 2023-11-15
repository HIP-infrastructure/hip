import React from 'react'
import { UserCredentials } from './api/types'

const getCurrentUser = (): UserCredentials | null => {
  try {
    const head = document?.getElementsByTagName('head')[0]
    if (!head) {
      return null
    }

    const uid = head.getAttribute('data-user')
    if (uid === null) return null

    return {
      uid,
      displayName: head.getAttribute('data-user-displayname'),
      isAdmin: !!(window as any)._oc_isadmin,
    }

  } catch (error) {
    console.error('Error fetching current user', error) // eslint-disable-line no-console
    return null
  }
}

export { getCurrentUser } 
