class IsAlphanumeric {
    static ruleName = "isAlphanumeric"

    getErrorMessage() {
        return 'The field must only contain numbers and letters.'
    }

    validate(value) {
        const isEmpty = value == undefined || value.length === 0 
        if(isEmpty) return { isValid: true }
        
        const re = /^\S[a-zA-Z0-9]*$/   
        const isValid = re.test(String(value))
        const rule = IsAlphanumeric.ruleName
        const err = this.getErrorMessage()

        return isValid ? { isValid } : { isValid, rule, err }
    }
}

export default IsAlphanumeric