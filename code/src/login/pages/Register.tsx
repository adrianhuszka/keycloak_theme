import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Box, Button, Checkbox, FormControlLabel, Link, Typography } from "@mui/material";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: 2
                }}
                id="kc-register-form"
                action={url.registrationAction}
                method="post"
            >
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="form-group">
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                        </div>
                    </div>
                )}
                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <span>
                                <Link
                                    href={url.loginUrl}
                                    variant="body2"
                                    sx={{
                                        alignSelf: "center",
                                        display: "block",
                                        width: "fit-content",
                                        ":hover": { textDecoration: "none", color: "inherit !important" }
                                    }}
                                >
                                    {msg("backToLogin")}
                                </Link>
                            </span>
                        </div>
                    </div>

                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <Button
                                fullWidth
                                variant="contained"
                                className={"g-recaptcha"}
                                data-sitekey={recaptchaSiteKey}
                                data-callback={() => {
                                    (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                                }}
                                data-action={recaptchaAction}
                                type="submit"
                            >
                                {msg("doRegister")}
                            </Button>
                        </Box>
                    ) : (
                        <Box id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <Button
                                disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                                type="submit"
                                fullWidth
                                variant="contained"
                            >
                                {msgStr("doRegister")}
                            </Button>
                        </Box>
                    )}
                </div>
            </Box>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;

    return (
        <>
            <Box className="form-group">
                <Box className={kcClsx("kcInputWrapperClass")}>
                    {msg("termsTitle")}
                    <Box id="kc-registration-terms-text">{msg("termsText")}</Box>
                </Box>
            </Box>
            <Box className="form-group">
                <Box className={kcClsx("kcLabelWrapperClass")}>
                    {/* <Checkbox
                        id="termsAccepted"
                        name="termsAccepted"
                        className={kcClsx("kcCheckboxInputClass")}
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    <label htmlFor="termsAccepted" className={kcClsx("kcLabelClass")}>
                        {msg("acceptTerms")}
                    </label> */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="termsAccepted"
                                name="termsAccepted"
                                checked={areTermsAccepted}
                                onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                                aria-invalid={messagesPerField.existsError("termsAccepted")}
                            />
                        }
                        label={msg("acceptTerms")}
                    />
                </Box>
                {messagesPerField.existsError("termsAccepted") && (
                    <Box className={kcClsx("kcLabelWrapperClass")}>
                        <Typography
                            component={"span"}
                            id="input-error-terms-accepted"
                            className={kcClsx("kcInputErrorMessageClass")}
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
}
