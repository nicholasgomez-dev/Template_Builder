

const usersFields = {
    id: {type: 'id', label: 'ID'},
    fullName: {
        type: 'string', label: 'Full Name',

    },
    first_name: {
        type: 'string', label: 'First Name',

    },
    last_name: {
        type: 'string', label: 'Last Name',

    },
    username: {
        type: 'string', label: 'Username',

    },
    phoneNumber: {
        type: 'string', label: 'Phone Number',

    },
    email_address: {
        type: 'string', label: 'E-mail',

    },
    disabled: {
        type: 'boolean', label: 'Disabled',

    },
    role: {
        type: 'enum', label: 'Role',

        options: [

            {value: 'omni', label: 'Omni'},
            {value: 'collaborator', label: 'Collaborator'},
        ],

    },
    avatar: {
        type: 'images', label: 'Avatar',

    },
    pword: {
        type: 'string', label: 'Password',

    },
    emailVerified: {
        type: 'boolean', label: 'emailVerified',

    },
    emailVerificationToken: {
        type: 'string', label: 'emailVerificationToken',

    },
    emailVerificationTokenExpiresAt: {
        type: 'datetime', label: 'emailVerificationTokenExpiresAt',

    },
    passwordResetToken: {
        type: 'string', label: 'passwordResetToken',

    },
    passwordResetTokenExpiresAt: {
        type: 'datetime', label: 'passwordResetTokenExpiresAt',

    },
    sitename: {
        type: 'string', label: 'Site Name',
    },
    siteemailaddress: { type: 'string', label: 'Site E-mail Address',

    },

    tagName: { type: 'string', label: 'Meta Name',

    },

    tagContent: { type: 'string', label: 'Meta Content',

    },
    imageinsertname: {
        type: 'string', label: 'Image Name',
    }
}

export default usersFields;
