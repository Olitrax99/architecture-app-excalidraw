import React from "react";
import { useI18n } from "../../i18n";
import { WelcomeScreen } from "../../packages/excalidraw/index";

export const AppWelcomeScreen: React.FC<{
  setCollabDialogShown: (toggle: boolean) => any;
}> = React.memo((props) => {
  const { t } = useI18n();
  let headingContent = t("welcomeScreen.app.center_heading");

  return (
    <WelcomeScreen>
      <WelcomeScreen.Hints.MenuHint>
        {t("welcomeScreen.app.menuHint")}
      </WelcomeScreen.Hints.MenuHint>
      <WelcomeScreen.Hints.ToolbarHint />
      <WelcomeScreen.Hints.HelpHint />
    </WelcomeScreen>
  );
});
