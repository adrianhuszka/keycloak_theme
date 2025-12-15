import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import {
    FormLabel,
    Button,
    FormControlLabel,
    TextField,
    FormControl,
    Typography,
    InputAdornment,
    IconButton,
    Link,
    Checkbox,
    Box
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Box id="kc-registration-container">
                    <Box id="kc-registration">
                        <Typography component={"span"}>
                            {msg("noAccount")}{" "}
                            <Link
                                variant="body2"
                                sx={{ alignSelf: "center", ":hover": { textDecoration: "none", color: "inherit !important" } }}
                                tabIndex={8}
                                href={url.registrationUrl}
                            >
                                {msg("doRegister")}
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            {realm.password && (
                <Box
                    component="form"
                    id="kc-form-login"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 2
                    }}
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                >
                    {!usernameHidden && (
                        <FormControl fullWidth>
                            <FormLabel htmlFor="username">
                                {!realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")}
                            </FormLabel>
                            <TextField
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                fullWidth
                                autoComplete="username"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                                variant="outlined"
                                color={messagesPerField.existsError("username", "password") ? "error" : "primary"}
                            />
                            {messagesPerField.existsError("username", "password") && (
                                <Typography component={"span"} id="input-error" sx={{ textAlign: "center" }} color="error" aria-live="polite">
                                    {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                                </Typography>
                            )}
                        </FormControl>
                    )}

                    <FormControl fullWidth>
                        <FormLabel htmlFor="password">{msg("password")}</FormLabel>
                        <TextField
                            tabIndex={3}
                            id="password"
                            name="password"
                            type="password"
                            fullWidth
                            autoComplete="current-password"
                            color={messagesPerField.existsError("username", "password") ? "error" : "primary"}
                            slotProps={{
                                input: {
                                    endAdornment: <PasswordToggle i18n={i18n} kcClsx={kcClsx} />
                                }
                            }}
                        />
                        {usernameHidden && messagesPerField.existsError("username", "password") && (
                            <Typography component={"span"} id="input-error" sx={{ textAlign: "center" }} color="error" aria-live="polite">
                                {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                            </Typography>
                        )}
                    </FormControl>

                    <div>
                        <div>
                            {realm.rememberMe && !usernameHidden && (
                                <div>
                                    <FormControlLabel
                                        control={<Checkbox defaultChecked={!!login.rememberMe} id="rememberMe" name="rememberMe" />}
                                        label={msg("rememberMe")}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            {realm.resetPasswordAllowed && (
                                <Link
                                    tabIndex={6}
                                    href={url.loginResetCredentialsUrl}
                                    variant="body2"
                                    sx={{ alignSelf: "center", ":hover": { textDecoration: "none", color: "inherit !important" } }}
                                >
                                    {msg("doForgotPassword")}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                        <Button
                            tabIndex={7}
                            disabled={isLoginButtonDisabled}
                            // className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                            name="login"
                            id="kc-login"
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            {msgStr("doLogIn")}
                        </Button>
                    </div>
                </Box>
            )}
        </Template>
    );
}

function PasswordToggle(props: { i18n: I18n; kcClsx: KcClsx }) {
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId: "password" });
    const { i18n } = props;
    const { msgStr } = i18n;

    return (
        <InputAdornment position="end">
            <IconButton
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                onClick={toggleIsPasswordRevealed}
                edge="end"
                sx={{ border: "none", backgroundColor: "transparent !important" }}
            >
                {isPasswordRevealed ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    );
}
