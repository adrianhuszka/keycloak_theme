import { useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import "../style.css";
import { Container } from "../components/Container";
import { CustomCard } from "../components/CustomCard";
import { Box, Button, FormLabel, Link, Menu, MenuItem, Stack, Typography } from "@mui/material";
import ColorModeSelect from "../themes/ColorModeSelect";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <Container direction="column" justifyContent="space-between">
            <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
            <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                <div id="kc-header-wrapper" style={{ textAlign: "center" }}>
                    {msg("loginTitleHtml", realm.displayNameHtml)}
                </div>
            </div>
            <CustomCard variant="outlined">
                <Stack spacing={2} direction={"column"}>
                    {enabledLanguages.length > 1 && (
                        <Box className={kcClsx("kcLocaleMainClass")} sx={{ alignSelf: "flex-end" }}>
                            <Box className={kcClsx("kcLocaleWrapperClass")}>
                                <Box className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                    <Button
                                        tabIndex={1}
                                        sx={{ padding: 0 }}
                                        aria-label={msgStr("languages")}
                                        aria-haspopup="true"
                                        aria-expanded={open ? "true" : undefined}
                                        aria-controls={open ? "language-switch1" : undefined}
                                        onClick={handleClick}
                                    >
                                        {currentLanguage.label}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        role="menu"
                                        tabIndex={-1}
                                        aria-labelledby="kc-current-locale-link"
                                        aria-activedescendant=""
                                        id="language-switch1"
                                        className={kcClsx("kcLocaleListClass")}
                                    >
                                        {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                            <MenuItem key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                                <Link role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                                                    {label}
                                                </Link>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </Box>
                        </Box>
                    )}
                    {(() => {
                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <h1 id="kc-page-title">{headerNode}</h1>
                        ) : (
                            <Box id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                <FormLabel sx={{ fontSize: "1.2rem" }}>{auth.attemptedUsername}</FormLabel>
                                <Link id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                    <Box className="kc-login-tooltip">
                                        <i className={kcClsx("kcResetFlowIcon")}></i>
                                        <Typography component={"span"} className="kc-tooltip-text" sx={{ zIndex: "200", fontSize: ".8rem" }}>
                                            {msg("restartLoginTooltip")}
                                        </Typography>
                                    </Box>
                                </Link>
                            </Box>
                        );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                        <span className="subtitle">
                                            <span className="required">*</span>
                                            {msg("requiredFields")}
                                        </span>
                                    </div>
                                    <div className="col-md-10">{node}</div>
                                </div>
                            );
                        }

                        return node;
                    })()}
                </Stack>
                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Box
                                className={clsx(
                                    `alert-${message.type}`,
                                    kcClsx("kcAlertClass"),
                                    `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                )}
                                sx={{
                                    marginBottom: "1rem"
                                }}
                            >
                                <div className="pf-c-alert__icon">
                                    {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                    {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                    {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                    {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                </div>
                                <Typography component={"span"} className={kcClsx("kcAlertTitleClass")}>
                                    {kcSanitize(message.summary)}
                                </Typography>
                            </Box>
                        )}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <Box sx={{ margin: "20px -40px -30px" }}>
                                <Box sx={{ padding: "15px 35px", borderTop: "1px solid rgba(51, 60, 77, 0.6)" }}>{infoNode}</Box>
                            </Box>
                        )}
                    </div>
                </div>
            </CustomCard>
        </Container>
    );
}
