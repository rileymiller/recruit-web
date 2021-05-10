import React from 'react'
import Link from 'next/link'

const nfaDependencyVersion = require('../package.json').dependencies[
  'next-firebase-auth'
]
const nextDependencyVersion = require('../package.json').dependencies.next

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  versionsContainer: {
    marginLeft: 0,
    marginRight: 'auto',
  },
  button: {
    marginLeft: 16,
    cursor: 'pointer',
  },
  linkAnchor: {
    color: 'teal',
    display: 'block',
    lineHeight: '160%',
    marginRight: 23,
  },
}

const Header = ({ email, signOut }: { email: string | null, signOut: () => void }) => (
  <div style={styles.container}>
    <Link href="/">
      <a style={styles.linkAnchor}>Home</a>
    </Link>
    <div style={styles.versionsContainer}>
      <div>v{nfaDependencyVersion}</div>
      <div>Next.js v{nextDependencyVersion}</div>
    </div>
    {email ? (
      <>
        <p>Signed in as {email}</p>
        <button
          type="button"
          onClick={() => {
            signOut()
          }}
          style={styles.button}
        >
          Sign out
        </button>
      </>
    ) : (
      <>
        <p>You are not signed in.</p>
        <Link href="/auth">
          <a>
            <button type="button" style={styles.button}>
              Sign in
            </button>
          </a>
        </Link>
      </>
    )}
  </div>
)

export default Header
