import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {useTranslation} from 'react-i18next';

/**
 * A vertical stepper component that displays a sequence of steps with associated descriptions.
 *
 * @param steps An array of objects containing the label and description for each step.
 * @param onFinish A callback function that is called when the last step is reached.
 * @returns A React component that renders a vertical stepper.
 */
export default function VerticalStepper({steps, onFinish}: { steps: any[]; onFinish: any; }) {
    const {t} = useTranslation();

    const [activeStep, setActiveStep] = React.useState(0);

    /**
     * Increments the active step by 1.
     */
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === steps.length - 1) {
            onFinish();
        }
    };

    /**
     * Handles the click event for the "Back" button in the vertical stepper.
     * Decrements the active step by 1.
     */
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /**
     * Resets the active step to the first step.
     */
    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{maxWidth: "100%"}}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">{t("Last_step")}</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent TransitionProps={{unmountOnExit: false}}>
                            {step.content}
                            <Box sx={{mb: 2}}>
                                <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{mt: 1, mr: 1}}
                                    >
                                        {index === steps.length - 1 ? t("finish") : t('Continue')}
                                    </Button>
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{mt: 1, mr: 1}}
                                    >
                                        {
                                            t('back')
                                        }
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{p: 3}}>
                    <Typography>{t("All_steps_completed")}</Typography>
                    <Button onClick={handleReset} sx={{mt: 1, mr: 1}}>
                        {t('reset')}
                    </Button>
                </Paper>
            )}
        </Box>
    );
}