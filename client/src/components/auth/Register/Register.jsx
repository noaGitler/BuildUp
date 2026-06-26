import React, { useState } from 'react';

import RegisterForm from './RegisterForm/RegisterForm.jsx';
import ProfileFields from './ProfileFields/ProfileFields.jsx';

const Register = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(2);
    const prevStep = () => setStep(1);

    return (
        <div className="auth-page-container">
            {step === 1 ? (
                <RegisterForm onStepComplete={() => nextStep()} />
            ) : (
                <ProfileFields />
            )}
        </div>
    );
};

export default Register;